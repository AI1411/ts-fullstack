import NotificationForm from '@/features/admin/notifications/components/NotificationForm';
import { notificationService } from '@/features/admin/notifications/services';
import { userService } from '@/features/admin/users/services';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

// Mock the notification service
vi.mock('@/features/admin/notifications/services', () => ({
  notificationService: {
    createNotification: vi.fn(),
  },
}));

// Mock the user service
vi.mock('@/features/admin/users/services', () => ({
  userService: {
    getUsers: vi.fn(),
  },
}));

describe('NotificationForm Component', () => {
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
    // Mock successful response for users
    vi.mocked(userService.getUsers).mockResolvedValue([]);

    render(
      <QueryClientProvider client={queryClient}>
        <NotificationForm />
      </QueryClientProvider>
    );

    // Check if the component is defined
    expect(NotificationForm).toBeDefined();
    expect(typeof NotificationForm).toBe('function');

    // Check if form elements are rendered
    expect(
      screen.getByText('通知を追加', { selector: 'h2' })
    ).toBeInTheDocument();
    expect(screen.getByLabelText(/タイトル/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/メッセージ/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/ユーザー/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/既読としてマーク/i)).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /通知を追加/i })
    ).toBeInTheDocument();
  });

  it('should display user options when users are available', async () => {
    // Mock user data
    const mockUsers = [
      { id: 1, name: 'User 1', email: 'user1@example.com' },
      { id: 2, name: 'User 2', email: 'user2@example.com' },
    ];

    vi.mocked(userService.getUsers).mockResolvedValue(mockUsers);

    render(
      <QueryClientProvider client={queryClient}>
        <NotificationForm />
      </QueryClientProvider>
    );

    // Wait for users to load
    await waitFor(() => {
      expect(
        screen.getByText('User 1 (user1@example.com)')
      ).toBeInTheDocument();
    });

    expect(screen.getByText('User 2 (user2@example.com)')).toBeInTheDocument();
  });

  it('should update form data when inputs change', async () => {
    vi.mocked(userService.getUsers).mockResolvedValue([]);

    render(
      <QueryClientProvider client={queryClient}>
        <NotificationForm />
      </QueryClientProvider>
    );

    // Get form inputs
    const titleInput = screen.getByLabelText(/タイトル/i);
    const messageInput = screen.getByLabelText(/メッセージ/i);
    const isReadCheckbox = screen.getByLabelText(/既読としてマーク/i);

    // Change input values
    fireEvent.change(titleInput, { target: { value: 'Test Title' } });
    fireEvent.change(messageInput, { target: { value: 'Test Message' } });
    fireEvent.click(isReadCheckbox);

    // Check if input values are updated
    expect(titleInput).toHaveValue('Test Title');
    expect(messageInput).toHaveValue('Test Message');
    expect(isReadCheckbox).toBeChecked();
  });

  it('should handle form submission successfully', async () => {
    vi.mocked(userService.getUsers).mockResolvedValue([]);
    vi.mocked(notificationService.createNotification).mockResolvedValue({
      id: 1,
      title: 'Test Title',
      message: 'Test Message',
      user_id: null,
      is_read: true,
      created_at: '2023-01-01T00:00:00Z',
    });

    render(
      <QueryClientProvider client={queryClient}>
        <NotificationForm />
      </QueryClientProvider>
    );

    // Get form inputs
    const titleInput = screen.getByLabelText(/タイトル/i);
    const messageInput = screen.getByLabelText(/メッセージ/i);
    const isReadCheckbox = screen.getByLabelText(/既読としてマーク/i);
    const submitButton = screen.getByRole('button', { name: /通知を追加/i });

    // Fill the form
    fireEvent.change(titleInput, { target: { value: 'Test Title' } });
    fireEvent.change(messageInput, { target: { value: 'Test Message' } });
    fireEvent.click(isReadCheckbox);

    // Submit the form
    fireEvent.click(submitButton);

    // Verify createNotification was called with correct data
    await waitFor(() => {
      expect(notificationService.createNotification).toHaveBeenCalledWith({
        title: 'Test Title',
        message: 'Test Message',
        user_id: null,
        is_read: true,
      });
    });

    // Check if form was reset after successful submission
    await waitFor(() => {
      expect(titleInput).toHaveValue('');
      expect(messageInput).toHaveValue('');
      expect(isReadCheckbox).not.toBeChecked();
    });
  });

  it('should handle form submission with user_id', async () => {
    // Mock user data
    const mockUsers = [{ id: 1, name: 'User 1', email: 'user1@example.com' }];

    vi.mocked(userService.getUsers).mockResolvedValue(mockUsers);
    vi.mocked(notificationService.createNotification).mockResolvedValue({
      id: 1,
      title: 'Test Title',
      message: 'Test Message',
      user_id: 1,
      is_read: false,
      created_at: '2023-01-01T00:00:00Z',
    });

    render(
      <QueryClientProvider client={queryClient}>
        <NotificationForm />
      </QueryClientProvider>
    );

    // Wait for users to load
    await waitFor(() => {
      expect(
        screen.getByText('User 1 (user1@example.com)')
      ).toBeInTheDocument();
    });

    // Get form inputs
    const titleInput = screen.getByLabelText(/タイトル/i);
    const messageInput = screen.getByLabelText(/メッセージ/i);
    const userSelect = screen.getByLabelText(/ユーザー/i);
    const submitButton = screen.getByRole('button', { name: /通知を追加/i });

    // Fill the form
    fireEvent.change(titleInput, { target: { value: 'Test Title' } });
    fireEvent.change(messageInput, { target: { value: 'Test Message' } });
    fireEvent.change(userSelect, { target: { value: '1' } });

    // Submit the form
    fireEvent.click(submitButton);

    // Verify createNotification was called with correct data
    await waitFor(() => {
      expect(notificationService.createNotification).toHaveBeenCalledWith({
        title: 'Test Title',
        message: 'Test Message',
        user_id: 1,
        is_read: false,
      });
    });
  });

  it('should handle form submission error', async () => {
    vi.mocked(userService.getUsers).mockResolvedValue([]);
    vi.mocked(notificationService.createNotification).mockRejectedValue(
      new Error('API error')
    );

    render(
      <QueryClientProvider client={queryClient}>
        <NotificationForm />
      </QueryClientProvider>
    );

    // Get form inputs
    const titleInput = screen.getByLabelText(/タイトル/i);
    const messageInput = screen.getByLabelText(/メッセージ/i);
    const submitButton = screen.getByRole('button', { name: /通知を追加/i });

    // Fill the form
    fireEvent.change(titleInput, { target: { value: 'Test Title' } });
    fireEvent.change(messageInput, { target: { value: 'Test Message' } });

    // Submit the form
    fireEvent.click(submitButton);

    // Verify error message is displayed
    await waitFor(() => {
      expect(screen.getByText('API error')).toBeInTheDocument();
    });

    // Form should not be reset on error
    expect(titleInput).toHaveValue('Test Title');
    expect(messageInput).toHaveValue('Test Message');
  });

  it('should show submitting state during form submission', async () => {
    vi.mocked(userService.getUsers).mockResolvedValue([]);
    // Mock a delayed response to ensure we see the submitting state
    vi.mocked(notificationService.createNotification).mockImplementation(
      () =>
        new Promise((resolve) =>
          setTimeout(
            () =>
              resolve({
                id: 1,
                title: 'Test Title',
                message: 'Test Message',
                user_id: null,
                is_read: false,
                created_at: '2023-01-01T00:00:00Z',
              }),
            100
          )
        )
    );

    render(
      <QueryClientProvider client={queryClient}>
        <NotificationForm />
      </QueryClientProvider>
    );

    // Get form inputs
    const titleInput = screen.getByLabelText(/タイトル/i);
    const messageInput = screen.getByLabelText(/メッセージ/i);
    const submitButton = screen.getByRole('button', { name: /通知を追加/i });

    // Fill the form
    fireEvent.change(titleInput, { target: { value: 'Test Title' } });
    fireEvent.change(messageInput, { target: { value: 'Test Message' } });

    // Submit the form
    fireEvent.click(submitButton);

    // Check if submitting state is shown
    expect(screen.getByText('送信中...')).toBeInTheDocument();

    // Wait for submission to complete
    await waitFor(() => {
      expect(screen.queryByText('送信中...')).not.toBeInTheDocument();
      expect(
        screen.getByRole('button', { name: /通知を追加/i })
      ).toBeInTheDocument();
    });
  });

  it('should handle non-Error objects in catch block', async () => {
    vi.mocked(userService.getUsers).mockResolvedValue([]);
    // Mock a rejection with a non-Error object
    vi.mocked(notificationService.createNotification).mockRejectedValue(
      'String error'
    );

    render(
      <QueryClientProvider client={queryClient}>
        <NotificationForm />
      </QueryClientProvider>
    );

    // Get form inputs
    const titleInput = screen.getByLabelText(/タイトル/i);
    const messageInput = screen.getByLabelText(/メッセージ/i);
    const submitButton = screen.getByRole('button', { name: /通知を追加/i });

    // Fill the form
    fireEvent.change(titleInput, { target: { value: 'Test Title' } });
    fireEvent.change(messageInput, { target: { value: 'Test Message' } });

    // Submit the form
    fireEvent.click(submitButton);

    // Verify default error message is displayed
    await waitFor(() => {
      expect(screen.getByText('通知の追加に失敗しました')).toBeInTheDocument();
    });
  });
});
