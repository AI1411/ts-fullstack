import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import ChatList from '@/features/admin/chats/components/ChatList';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { chatService } from '@/features/admin/chats/services';
import { ChatWithUser } from '@/features/admin/chats/controllers';

// Mock the chat service
vi.mock('@/features/admin/chats/services', () => ({
  chatService: {
    getUserChats: vi.fn()
  }
}));

// Mock date-fns to avoid locale issues in tests
vi.mock('date-fns', () => ({
  formatDistanceToNow: vi.fn(() => '3日前')
}));

describe('ChatList Component', () => {
  let queryClient: QueryClient;

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

  it('should render the component', () => {
    // Mock successful response with empty array
    vi.mocked(chatService.getUserChats).mockResolvedValue([]);

    render(
      <QueryClientProvider client={queryClient}>
        <ChatList />
      </QueryClientProvider>
    );

    // Check if the component is defined
    expect(ChatList).toBeDefined();
    expect(typeof ChatList).toBe('function');
  });

  it('should show loading state initially', () => {
    // Mock a delayed response to ensure we see the loading state
    vi.mocked(chatService.getUserChats).mockImplementation(
      () => new Promise(resolve => setTimeout(() => resolve([]), 100))
    );

    render(
      <QueryClientProvider client={queryClient}>
        <ChatList />
      </QueryClientProvider>
    );

    expect(screen.getByTestId('loading')).toBeInTheDocument();
    expect(screen.queryByTestId('chat-list')).not.toBeInTheDocument();
  });

  it('should show error state when API call fails', async () => {
    // Mock a failed response
    vi.mocked(chatService.getUserChats).mockRejectedValue(new Error('API error'));

    render(
      <QueryClientProvider client={queryClient}>
        <ChatList />
      </QueryClientProvider>
    );

    // Wait for the error message to appear
    await waitFor(() => {
      expect(screen.getByTestId('error')).toBeInTheDocument();
    });

    expect(screen.queryByTestId('chat-list')).not.toBeInTheDocument();
    expect(screen.getByText('エラーが発生しました。再度お試しください。')).toBeInTheDocument();
  });

  it('should show empty state when no chats are available', async () => {
    // Mock successful response with empty array
    vi.mocked(chatService.getUserChats).mockResolvedValue([]);

    render(
      <QueryClientProvider client={queryClient}>
        <ChatList />
      </QueryClientProvider>
    );

    // Wait for the component to finish loading
    await waitFor(() => {
      expect(screen.queryByTestId('loading')).not.toBeInTheDocument();
    });

    expect(screen.getByTestId('chat-list')).toBeInTheDocument();
    expect(screen.getByText('チャットがありません')).toBeInTheDocument();
  });

  it('should display chat list when data is available', async () => {
    // Mock chat data
    const mockChats: ChatWithUser[] = [
      {
        chat: {
          id: 1,
          creator_id: 1,
          recipient_id: 2,
          created_at: '2023-01-01T00:00:00Z',
          updated_at: '2023-01-02T00:00:00Z'
        },
        otherUser: {
          id: 2,
          name: 'Test User 1'
        }
      },
      {
        chat: {
          id: 2,
          creator_id: 1,
          recipient_id: 3,
          created_at: '2023-01-03T00:00:00Z',
          updated_at: '2023-01-04T00:00:00Z'
        },
        otherUser: {
          id: 3,
          name: 'Test User 2'
        }
      }
    ];

    vi.mocked(chatService.getUserChats).mockResolvedValue(mockChats);

    render(
      <QueryClientProvider client={queryClient}>
        <ChatList />
      </QueryClientProvider>
    );

    // Wait for the component to finish loading
    await waitFor(() => {
      expect(screen.queryByTestId('loading')).not.toBeInTheDocument();
    });

    expect(screen.getByTestId('chat-list')).toBeInTheDocument();
    expect(screen.getByText('Test User 1')).toBeInTheDocument();
    expect(screen.getByText('Test User 2')).toBeInTheDocument();
    expect(screen.getAllByText('3日前')).toHaveLength(2); // From our mocked formatDistanceToNow
  });

  it('should filter chats based on search input', async () => {
    // Mock chat data
    const mockChats: ChatWithUser[] = [
      {
        chat: {
          id: 1,
          creator_id: 1,
          recipient_id: 2,
          created_at: '2023-01-01T00:00:00Z',
          updated_at: '2023-01-02T00:00:00Z'
        },
        otherUser: {
          id: 2,
          name: 'Alice'
        }
      },
      {
        chat: {
          id: 2,
          creator_id: 1,
          recipient_id: 3,
          created_at: '2023-01-03T00:00:00Z',
          updated_at: '2023-01-04T00:00:00Z'
        },
        otherUser: {
          id: 3,
          name: 'Bob'
        }
      }
    ];

    vi.mocked(chatService.getUserChats).mockResolvedValue(mockChats);

    render(
      <QueryClientProvider client={queryClient}>
        <ChatList />
      </QueryClientProvider>
    );

    // Wait for the component to finish loading
    await waitFor(() => {
      expect(screen.queryByTestId('loading')).not.toBeInTheDocument();
    });

    // Verify both users are initially displayed
    expect(screen.getByText('Alice')).toBeInTheDocument();
    expect(screen.getByText('Bob')).toBeInTheDocument();

    // Search for "Alice"
    const searchInput = screen.getByTestId('search-input');
    fireEvent.change(searchInput, { target: { value: 'Alice' } });

    // Verify only Alice is displayed
    expect(screen.getByText('Alice')).toBeInTheDocument();
    expect(screen.queryByText('Bob')).not.toBeInTheDocument();

    // Search for a non-existent user
    fireEvent.change(searchInput, { target: { value: 'Charlie' } });

    // Verify no users are displayed and the "no results" message is shown
    expect(screen.queryByText('Alice')).not.toBeInTheDocument();
    expect(screen.queryByText('Bob')).not.toBeInTheDocument();
    expect(screen.getByText('検索結果がありません')).toBeInTheDocument();
  });
});
