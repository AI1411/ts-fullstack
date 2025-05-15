import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import ChatDetail from '@/features/admin/chats/components/ChatDetail';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { chatService } from '@/features/admin/chats/services';
import { userService } from '@/features/admin/users/services';
import { Chat, ChatMessageWithSender } from '@/features/admin/chats/controllers';

// Mock the services
vi.mock('@/features/admin/chats/services', () => ({
  chatService: {
    getChatById: vi.fn(),
    getChatMessages: vi.fn(),
    markMessagesAsRead: vi.fn()
  }
}));

vi.mock('@/features/admin/users/services', () => ({
  userService: {
    getUserById: vi.fn()
  }
}));

// Mock the MessageList and MessageForm components
vi.mock('@/features/admin/chats/components/MessageList', () => ({
  default: vi.fn(() => <div data-testid="message-list">MessageList Component</div>)
}));

vi.mock('@/features/admin/chats/components/MessageForm', () => ({
  default: vi.fn(() => <div data-testid="message-form">MessageForm Component</div>)
}));

// Mock Next.js Link component
vi.mock('next/link', () => ({
  default: ({ children, href }: { children: React.ReactNode, href: string }) => (
    <a href={href} data-testid="link">
      {children}
    </a>
  )
}));

// Mock date-fns to avoid locale issues in tests
vi.mock('date-fns', () => ({
  formatDistanceToNow: vi.fn(() => '3日前')
}));

// Mock scrollIntoView
Element.prototype.scrollIntoView = vi.fn();

describe('ChatDetail Component', () => {
  let queryClient: QueryClient;
  const mockChatId = 1;

  beforeEach(() => {
    queryClient = new QueryClient({
      defaultOptions: {
        queries: {
          retry: false,
        },
      },
    });
    vi.clearAllMocks();
  });

  it('should render loading state initially', () => {
    // Mock delayed responses
    vi.mocked(chatService.getChatById).mockImplementation(
      () => new Promise(resolve => setTimeout(() => resolve({} as Chat), 100))
    );
    vi.mocked(chatService.getChatMessages).mockImplementation(
      () => new Promise(resolve => setTimeout(() => resolve([]), 100))
    );

    render(
      <QueryClientProvider client={queryClient}>
        <ChatDetail chatId={mockChatId} />
      </QueryClientProvider>
    );

    expect(screen.getByRole('status')).toBeInTheDocument();
  });

  it('should show error state when chat is not found', async () => {
    // Mock failed chat response
    vi.mocked(chatService.getChatById).mockResolvedValue(null as unknown as Chat);
    vi.mocked(chatService.getChatMessages).mockResolvedValue([]);

    render(
      <QueryClientProvider client={queryClient}>
        <ChatDetail chatId={mockChatId} />
      </QueryClientProvider>
    );

    await waitFor(() => {
      expect(screen.getByText('チャットが見つかりませんでした。')).toBeInTheDocument();
    });
  });

  it('should render chat details when data is available', async () => {
    // Mock successful responses
    const mockChat: Chat = {
      id: 1,
      creator_id: 1,
      recipient_id: 2,
      created_at: '2023-01-01T00:00:00Z',
      updated_at: '2023-01-02T00:00:00Z'
    };

    const mockMessages: ChatMessageWithSender[] = [];

    const mockUser = {
      id: 2,
      name: 'Test User'
    };

    vi.mocked(chatService.getChatById).mockResolvedValue(mockChat);
    vi.mocked(chatService.getChatMessages).mockResolvedValue(mockMessages);
    vi.mocked(userService.getUserById).mockResolvedValue(mockUser);
    vi.mocked(chatService.markMessagesAsRead).mockResolvedValue({
      success: true,
      count: 0,
      messages: []
    });

    render(
      <QueryClientProvider client={queryClient}>
        <ChatDetail chatId={mockChatId} />
      </QueryClientProvider>
    );

    await waitFor(() => {
      expect(screen.getByText('Test User')).toBeInTheDocument();
    });

    // Check if MessageList and MessageForm are rendered
    expect(screen.getByTestId('message-list')).toBeInTheDocument();
    expect(screen.getByTestId('message-form')).toBeInTheDocument();

    // Check if back link is rendered
    expect(screen.getByTestId('link')).toHaveAttribute('href', '/admin/chats');

    // Verify markMessagesAsRead was called
    await waitFor(() => {
      expect(chatService.markMessagesAsRead).toHaveBeenCalledWith(mockChatId, 1);
    });
  });

  it('should handle case when other user is not found', async () => {
    // Mock successful chat response but null user
    const mockChat: Chat = {
      id: 1,
      creator_id: 1,
      recipient_id: 2,
      created_at: '2023-01-01T00:00:00Z',
      updated_at: '2023-01-02T00:00:00Z'
    };

    vi.mocked(chatService.getChatById).mockResolvedValue(mockChat);
    vi.mocked(chatService.getChatMessages).mockResolvedValue([]);
    vi.mocked(userService.getUserById).mockResolvedValue(null);
    vi.mocked(chatService.markMessagesAsRead).mockResolvedValue({
      success: true,
      count: 0,
      messages: []
    });

    render(
      <QueryClientProvider client={queryClient}>
        <ChatDetail chatId={mockChatId} />
      </QueryClientProvider>
    );

    await waitFor(() => {
      expect(screen.getByText('ユーザー')).toBeInTheDocument();
    });

    // Check if the avatar shows a question mark
    expect(screen.getByText('?')).toBeInTheDocument();
  });

  it('should handle error when marking messages as read fails', async () => {
    // Mock successful responses but failed markMessagesAsRead
    const mockChat: Chat = {
      id: 1,
      creator_id: 1,
      recipient_id: 2,
      created_at: '2023-01-01T00:00:00Z',
      updated_at: '2023-01-02T00:00:00Z'
    };

    const mockUser = {
      id: 2,
      name: 'Test User'
    };

    vi.mocked(chatService.getChatById).mockResolvedValue(mockChat);
    vi.mocked(chatService.getChatMessages).mockResolvedValue([]);
    vi.mocked(userService.getUserById).mockResolvedValue(mockUser);
    vi.mocked(chatService.markMessagesAsRead).mockRejectedValue(new Error('Failed to mark as read'));

    // Spy on console.error
    const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    render(
      <QueryClientProvider client={queryClient}>
        <ChatDetail chatId={mockChatId} />
      </QueryClientProvider>
    );

    await waitFor(() => {
      expect(screen.getByText('Test User')).toBeInTheDocument();
    });

    // Verify error was logged
    await waitFor(() => {
      expect(consoleErrorSpy).toHaveBeenCalledWith(
        'Failed to mark messages as read:',
        expect.any(Error)
      );
    });

    consoleErrorSpy.mockRestore();
  });

  it('should scroll to the latest message when messages change', async () => {
    // Mock successful responses
    const mockChat: Chat = {
      id: 1,
      creator_id: 1,
      recipient_id: 2,
      created_at: '2023-01-01T00:00:00Z',
      updated_at: '2023-01-02T00:00:00Z'
    };

    const mockMessages: ChatMessageWithSender[] = [
      {
        message: {
          id: 1,
          chat_id: 1,
          sender_id: 1,
          content: 'Hello',
          is_read: true,
          created_at: '2023-01-01T00:00:00Z',
          updated_at: '2023-01-01T00:00:00Z'
        },
        sender: {
          id: 1,
          name: 'Current User'
        }
      }
    ];

    const mockUser = {
      id: 2,
      name: 'Test User'
    };

    vi.mocked(chatService.getChatById).mockResolvedValue(mockChat);
    vi.mocked(chatService.getChatMessages).mockResolvedValue(mockMessages);
    vi.mocked(userService.getUserById).mockResolvedValue(mockUser);
    vi.mocked(chatService.markMessagesAsRead).mockResolvedValue({
      success: true,
      count: 0,
      messages: []
    });

    render(
      <QueryClientProvider client={queryClient}>
        <ChatDetail chatId={mockChatId} />
      </QueryClientProvider>
    );

    await waitFor(() => {
      expect(screen.getByText('Test User')).toBeInTheDocument();
    });

    // Verify scrollIntoView was called
    await waitFor(() => {
      expect(Element.prototype.scrollIntoView).toHaveBeenCalledWith({ behavior: 'smooth' });
    });

    // Update messages to trigger the useEffect again
    const updatedMessages = [
      ...mockMessages,
      {
        message: {
          id: 2,
          chat_id: 1,
          sender_id: 2,
          content: 'Hi there',
          is_read: false,
          created_at: '2023-01-02T00:00:00Z',
          updated_at: '2023-01-02T00:00:00Z'
        },
        sender: {
          id: 2,
          name: 'Test User'
        }
      }
    ];

    // Update the mock to return the new messages
    vi.mocked(chatService.getChatMessages).mockResolvedValue(updatedMessages);

    // Trigger a re-render by invalidating the query
    queryClient.invalidateQueries({ queryKey: ['chatMessages', mockChatId] });

    // Verify scrollIntoView was called again
    await waitFor(() => {
      expect(Element.prototype.scrollIntoView).toHaveBeenCalledTimes(2);
    });
  });
});
