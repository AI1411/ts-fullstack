import ChatForm from '@/features/admin/chats/components/ChatForm';
import { chatService } from '@/features/admin/chats/services';
import type { User } from '@/features/admin/users/controllers';
import { userService } from '@/features/admin/users/services';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

// Mock the services
vi.mock('@/features/admin/chats/services', () => ({
  chatService: {
    createChat: vi.fn(),
  },
}));

vi.mock('@/features/admin/users/services', () => ({
  userService: {
    getUsers: vi.fn(),
  },
}));

// Mock Next.js router
const mockPush = vi.fn();
vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mockPush,
  }),
}));

describe('ChatForm Component', () => {
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
    vi.mocked(userService.getUsers).mockResolvedValue([]);

    render(
      <QueryClientProvider client={queryClient}>
        <ChatForm />
      </QueryClientProvider>
    );

    expect(screen.getByText('新しいチャットを開始')).toBeInTheDocument();
    expect(screen.getByText('ユーザーを選択')).toBeInTheDocument();
    expect(screen.getByText('ユーザーを選択してください')).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: 'チャットを開始' })
    ).toBeInTheDocument();
  });

  it('should show loading state for users', () => {
    // Mock a delayed response to ensure we see the loading state
    vi.mocked(userService.getUsers).mockImplementation(
      () => new Promise((resolve) => setTimeout(() => resolve([]), 100))
    );

    render(
      <QueryClientProvider client={queryClient}>
        <ChatForm />
      </QueryClientProvider>
    );

    // Select should be disabled during loading
    expect(screen.getByRole('combobox')).toBeDisabled();
    expect(
      screen.getByRole('button', { name: 'チャットを開始' })
    ).toBeDisabled();
  });

  it('should display user options when data is available', async () => {
    // Mock user data
    const mockUsers: User[] = [
      { id: 1, name: 'Current User' },
      { id: 2, name: 'User 2' },
      { id: 3, name: 'User 3' },
    ];

    vi.mocked(userService.getUsers).mockResolvedValue(mockUsers);

    render(
      <QueryClientProvider client={queryClient}>
        <ChatForm />
      </QueryClientProvider>
    );

    // Wait for the component to finish loading
    await waitFor(() => {
      expect(screen.getByRole('combobox')).not.toBeDisabled();
    });

    // Only users other than the current user (ID 1) should be in the dropdown
    expect(screen.queryByText('Current User')).not.toBeInTheDocument();
    expect(screen.getByText('User 2')).toBeInTheDocument();
    expect(screen.getByText('User 3')).toBeInTheDocument();
  });

  it('should show validation error when submitting without selecting a user', async () => {
    // Mock user data
    const mockUsers: User[] = [
      { id: 1, name: 'Current User' },
      { id: 2, name: 'User 2' },
    ];

    vi.mocked(userService.getUsers).mockResolvedValue(mockUsers);

    render(
      <QueryClientProvider client={queryClient}>
        <ChatForm />
      </QueryClientProvider>
    );

    // Wait for the component to finish loading
    await waitFor(() => {
      expect(screen.getByRole('combobox')).not.toBeDisabled();
    });

    // Submit the form without selecting a user
    fireEvent.click(screen.getByRole('button', { name: 'チャットを開始' }));

    // Check for validation error
    expect(
      screen.getByText('ユーザーを選択してください', {
        selector: '.text-red-700',
      })
    ).toBeInTheDocument();
    expect(chatService.createChat).not.toHaveBeenCalled();
  });

  it('should create a chat and redirect when form is submitted successfully', async () => {
    // Mock user data
    const mockUsers: User[] = [
      { id: 1, name: 'Current User' },
      { id: 2, name: 'User 2' },
    ];

    // Mock successful chat creation
    const mockChat = {
      id: 123,
      creator_id: 1,
      recipient_id: 2,
      created_at: '2023-01-01T00:00:00Z',
      updated_at: '2023-01-01T00:00:00Z',
    };

    vi.mocked(userService.getUsers).mockResolvedValue(mockUsers);
    vi.mocked(chatService.createChat).mockResolvedValue(mockChat);

    render(
      <QueryClientProvider client={queryClient}>
        <ChatForm />
      </QueryClientProvider>
    );

    // Wait for the component to finish loading
    await waitFor(() => {
      expect(screen.getByRole('combobox')).not.toBeDisabled();
    });

    // Select a user
    fireEvent.change(screen.getByRole('combobox'), { target: { value: '2' } });

    // Submit the form
    fireEvent.click(screen.getByRole('button', { name: 'チャットを開始' }));

    // Check for loading state
    expect(screen.getByText('処理中...')).toBeInTheDocument();

    // Wait for the submission to complete
    await waitFor(() => {
      expect(chatService.createChat).toHaveBeenCalledWith({
        creator_id: 1,
        recipient_id: 2,
      });
    });

    // Check if redirected to the new chat
    expect(mockPush).toHaveBeenCalledWith('/admin/chats/123');
  });

  it('should show error message when chat creation fails', async () => {
    // Mock user data
    const mockUsers: User[] = [
      { id: 1, name: 'Current User' },
      { id: 2, name: 'User 2' },
    ];

    // Mock failed chat creation
    const mockError = new Error('Chat creation failed');
    vi.mocked(userService.getUsers).mockResolvedValue(mockUsers);
    vi.mocked(chatService.createChat).mockRejectedValue(mockError);

    render(
      <QueryClientProvider client={queryClient}>
        <ChatForm />
      </QueryClientProvider>
    );

    // Wait for the component to finish loading
    await waitFor(() => {
      expect(screen.getByRole('combobox')).not.toBeDisabled();
    });

    // Select a user
    fireEvent.change(screen.getByRole('combobox'), { target: { value: '2' } });

    // Submit the form
    fireEvent.click(screen.getByRole('button', { name: 'チャットを開始' }));

    // Wait for the error message
    await waitFor(() => {
      expect(screen.getByText('Chat creation failed')).toBeInTheDocument();
    });

    // Check that we didn't redirect
    expect(mockPush).not.toHaveBeenCalled();
  });

  it('should handle non-Error objects in catch block', async () => {
    // Mock user data
    const mockUsers: User[] = [
      { id: 1, name: 'Current User' },
      { id: 2, name: 'User 2' },
    ];

    // Mock failed chat creation with a string
    vi.mocked(userService.getUsers).mockResolvedValue(mockUsers);
    vi.mocked(chatService.createChat).mockRejectedValue('String error');

    // Spy on console.error
    const consoleErrorSpy = vi
      .spyOn(console, 'error')
      .mockImplementation(() => {});

    render(
      <QueryClientProvider client={queryClient}>
        <ChatForm />
      </QueryClientProvider>
    );

    // Wait for the component to finish loading
    await waitFor(() => {
      expect(screen.getByRole('combobox')).not.toBeDisabled();
    });

    // Select a user
    fireEvent.change(screen.getByRole('combobox'), { target: { value: '2' } });

    // Submit the form
    fireEvent.click(screen.getByRole('button', { name: 'チャットを開始' }));

    // Wait for the error message
    await waitFor(() => {
      expect(
        screen.getByText('チャットの作成に失敗しました')
      ).toBeInTheDocument();
    });

    // Check that console.error was called
    expect(consoleErrorSpy).toHaveBeenCalledWith('String error');

    consoleErrorSpy.mockRestore();
  });
});
