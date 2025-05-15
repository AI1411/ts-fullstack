import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import NotificationList from '@/features/admin/notifications/components/NotificationList';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { notificationService } from '@/features/admin/notifications/services';
import { userService } from '@/features/admin/users/services';
import { Notification } from '@/features/admin/notifications/controllers';

// Mock the notification service
vi.mock('@/features/admin/notifications/services', () => ({
  notificationService: {
    getNotifications: vi.fn(),
    updateNotification: vi.fn(),
    deleteNotification: vi.fn(),
    toggleNotificationReadStatus: vi.fn()
  }
}));

// Mock the user service
vi.mock('@/features/admin/users/services', () => ({
  userService: {
    getUsers: vi.fn()
  }
}));

describe('NotificationList Component', () => {
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
    vi.mocked(notificationService.getNotifications).mockResolvedValue([]);
    vi.mocked(userService.getUsers).mockResolvedValue([]);

    render(
      <QueryClientProvider client={queryClient}>
        <NotificationList />
      </QueryClientProvider>
    );

    // Check if the component is defined
    expect(NotificationList).toBeDefined();
    expect(typeof NotificationList).toBe('function');
  });

  it('should show loading state initially', () => {
    // Mock a delayed response to ensure we see the loading state
    vi.mocked(notificationService.getNotifications).mockImplementation(
      () => new Promise(resolve => setTimeout(() => resolve([]), 100))
    );
    vi.mocked(userService.getUsers).mockResolvedValue([]);

    render(
      <QueryClientProvider client={queryClient}>
        <NotificationList />
      </QueryClientProvider>
    );

    expect(screen.getByText('読み込み中...')).toBeInTheDocument();
  });

  it('should show error state when API call fails', async () => {
    // Mock a failed response
    vi.mocked(notificationService.getNotifications).mockRejectedValue(new Error('API error'));
    vi.mocked(userService.getUsers).mockResolvedValue([]);

    render(
      <QueryClientProvider client={queryClient}>
        <NotificationList />
      </QueryClientProvider>
    );

    // Wait for the error message to appear
    await waitFor(() => {
      expect(screen.getByText('エラーが発生しました')).toBeInTheDocument();
    });
  });

  it('should display notification list when data is available', async () => {
    // Mock notification data
    const mockNotifications: Notification[] = [
      {
        id: 1,
        title: 'Test Notification 1',
        message: 'This is test notification 1',
        user_id: 1,
        is_read: false,
        created_at: '2023-01-01T00:00:00Z'
      },
      {
        id: 2,
        title: 'Test Notification 2',
        message: 'This is test notification 2',
        user_id: 2,
        is_read: true,
        created_at: '2023-01-02T00:00:00Z'
      }
    ];

    // Mock user data
    const mockUsers = [
      { id: 1, name: 'User 1', email: 'user1@example.com' },
      { id: 2, name: 'User 2', email: 'user2@example.com' }
    ];

    vi.mocked(notificationService.getNotifications).mockResolvedValue(mockNotifications);
    vi.mocked(userService.getUsers).mockResolvedValue(mockUsers);

    render(
      <QueryClientProvider client={queryClient}>
        <NotificationList />
      </QueryClientProvider>
    );

    // Wait for the component to finish loading
    await waitFor(() => {
      expect(screen.queryByText('読み込み中...')).not.toBeInTheDocument();
    });

    // Check if notifications are displayed
    expect(screen.getByText('Test Notification 1')).toBeInTheDocument();
    expect(screen.getByText('Test Notification 2')).toBeInTheDocument();
    
    // Check if user names are displayed
    expect(screen.getByText('User 1')).toBeInTheDocument();
    expect(screen.getByText('User 2')).toBeInTheDocument();
    
    // Check if read status is displayed correctly
    expect(screen.getByText('未読')).toBeInTheDocument();
    expect(screen.getByText('既読')).toBeInTheDocument();
  });

  it('should handle edit mode correctly', async () => {
    // Mock notification data
    const mockNotifications: Notification[] = [
      {
        id: 1,
        title: 'Test Notification',
        message: 'This is a test notification',
        user_id: 1,
        is_read: false,
        created_at: '2023-01-01T00:00:00Z'
      }
    ];

    // Mock user data
    const mockUsers = [
      { id: 1, name: 'User 1', email: 'user1@example.com' },
      { id: 2, name: 'User 2', email: 'user2@example.com' }
    ];

    vi.mocked(notificationService.getNotifications).mockResolvedValue(mockNotifications);
    vi.mocked(userService.getUsers).mockResolvedValue(mockUsers);

    render(
      <QueryClientProvider client={queryClient}>
        <NotificationList />
      </QueryClientProvider>
    );

    // Wait for the component to finish loading
    await waitFor(() => {
      expect(screen.queryByText('読み込み中...')).not.toBeInTheDocument();
    });

    // Click edit button
    fireEvent.click(screen.getByText('編集'));

    // Check if edit form is displayed
    expect(screen.getByDisplayValue('Test Notification')).toBeInTheDocument();
    expect(screen.getByDisplayValue('This is a test notification')).toBeInTheDocument();
    expect(screen.getByText('保存')).toBeInTheDocument();
    expect(screen.getByText('キャンセル')).toBeInTheDocument();

    // Edit the notification
    fireEvent.change(screen.getByDisplayValue('Test Notification'), { 
      target: { value: 'Updated Notification' } 
    });
    fireEvent.change(screen.getByDisplayValue('This is a test notification'), { 
      target: { value: 'This is an updated notification' } 
    });

    // Mock successful update
    vi.mocked(notificationService.updateNotification).mockResolvedValue({
      id: 1,
      title: 'Updated Notification',
      message: 'This is an updated notification',
      user_id: 1,
      is_read: false,
      created_at: '2023-01-01T00:00:00Z'
    });

    // Save the changes
    fireEvent.click(screen.getByText('保存'));

    // Verify update was called with correct data
    await waitFor(() => {
      expect(notificationService.updateNotification).toHaveBeenCalledWith(1, {
        title: 'Updated Notification',
        message: 'This is an updated notification',
        user_id: 1,
        is_read: false
      });
    });
  });

  it('should handle cancel edit correctly', async () => {
    // Mock notification data
    const mockNotifications: Notification[] = [
      {
        id: 1,
        title: 'Test Notification',
        message: 'This is a test notification',
        user_id: 1,
        is_read: false,
        created_at: '2023-01-01T00:00:00Z'
      }
    ];

    vi.mocked(notificationService.getNotifications).mockResolvedValue(mockNotifications);
    vi.mocked(userService.getUsers).mockResolvedValue([]);

    render(
      <QueryClientProvider client={queryClient}>
        <NotificationList />
      </QueryClientProvider>
    );

    // Wait for the component to finish loading
    await waitFor(() => {
      expect(screen.queryByText('読み込み中...')).not.toBeInTheDocument();
    });

    // Click edit button
    fireEvent.click(screen.getByText('編集'));

    // Check if edit form is displayed
    expect(screen.getByDisplayValue('Test Notification')).toBeInTheDocument();

    // Click cancel button
    fireEvent.click(screen.getByText('キャンセル'));

    // Check if edit form is no longer displayed
    expect(screen.queryByDisplayValue('Test Notification')).not.toBeInTheDocument();
    expect(screen.getByText('Test Notification')).toBeInTheDocument();
  });

  it('should handle delete correctly', async () => {
    // Mock notification data
    const mockNotifications: Notification[] = [
      {
        id: 1,
        title: 'Test Notification',
        message: 'This is a test notification',
        user_id: 1,
        is_read: false,
        created_at: '2023-01-01T00:00:00Z'
      }
    ];

    vi.mocked(notificationService.getNotifications).mockResolvedValue(mockNotifications);
    vi.mocked(userService.getUsers).mockResolvedValue([]);
    vi.mocked(notificationService.deleteNotification).mockResolvedValue();

    // Mock window.confirm to always return true
    const originalConfirm = window.confirm;
    window.confirm = vi.fn(() => true);

    render(
      <QueryClientProvider client={queryClient}>
        <NotificationList />
      </QueryClientProvider>
    );

    // Wait for the component to finish loading
    await waitFor(() => {
      expect(screen.queryByText('読み込み中...')).not.toBeInTheDocument();
    });

    // Click delete button
    fireEvent.click(screen.getByText('削除'));

    // Verify delete was called with correct id
    await waitFor(() => {
      expect(notificationService.deleteNotification).toHaveBeenCalledWith(1);
    });

    // Restore original confirm
    window.confirm = originalConfirm;
  });

  it('should handle delete cancellation correctly', async () => {
    // Mock notification data
    const mockNotifications: Notification[] = [
      {
        id: 1,
        title: 'Test Notification',
        message: 'This is a test notification',
        user_id: 1,
        is_read: false,
        created_at: '2023-01-01T00:00:00Z'
      }
    ];

    vi.mocked(notificationService.getNotifications).mockResolvedValue(mockNotifications);
    vi.mocked(userService.getUsers).mockResolvedValue([]);

    // Mock window.confirm to return false (cancel)
    const originalConfirm = window.confirm;
    window.confirm = vi.fn(() => false);

    render(
      <QueryClientProvider client={queryClient}>
        <NotificationList />
      </QueryClientProvider>
    );

    // Wait for the component to finish loading
    await waitFor(() => {
      expect(screen.queryByText('読み込み中...')).not.toBeInTheDocument();
    });

    // Click delete button
    fireEvent.click(screen.getByText('削除'));

    // Verify delete was not called
    expect(notificationService.deleteNotification).not.toHaveBeenCalled();

    // Restore original confirm
    window.confirm = originalConfirm;
  });

  it('should handle toggle read status correctly', async () => {
    // Mock notification data
    const mockNotifications: Notification[] = [
      {
        id: 1,
        title: 'Test Notification',
        message: 'This is a test notification',
        user_id: 1,
        is_read: false,
        created_at: '2023-01-01T00:00:00Z'
      }
    ];

    vi.mocked(notificationService.getNotifications).mockResolvedValue(mockNotifications);
    vi.mocked(userService.getUsers).mockResolvedValue([]);
    vi.mocked(notificationService.toggleNotificationReadStatus).mockResolvedValue({
      ...mockNotifications[0],
      is_read: true
    });

    render(
      <QueryClientProvider client={queryClient}>
        <NotificationList />
      </QueryClientProvider>
    );

    // Wait for the component to finish loading
    await waitFor(() => {
      expect(screen.queryByText('読み込み中...')).not.toBeInTheDocument();
    });

    // Click the read status button
    fireEvent.click(screen.getByText('未読'));

    // Verify toggleNotificationReadStatus was called with correct parameters
    await waitFor(() => {
      expect(notificationService.toggleNotificationReadStatus).toHaveBeenCalledWith(1, true);
    });
  });

  it('should handle getUserName correctly with null user_id', async () => {
    // Mock notification data with null user_id
    const mockNotifications: Notification[] = [
      {
        id: 1,
        title: 'Test Notification',
        message: 'This is a test notification',
        user_id: null,
        is_read: false,
        created_at: '2023-01-01T00:00:00Z'
      }
    ];

    vi.mocked(notificationService.getNotifications).mockResolvedValue(mockNotifications);
    vi.mocked(userService.getUsers).mockResolvedValue([
      { id: 1, name: 'User 1', email: 'user1@example.com' }
    ]);

    render(
      <QueryClientProvider client={queryClient}>
        <NotificationList />
      </QueryClientProvider>
    );

    // Wait for the component to finish loading
    await waitFor(() => {
      expect(screen.queryByText('読み込み中...')).not.toBeInTheDocument();
    });

    // Check if '-' is displayed for null user_id
    expect(screen.getByText('-')).toBeInTheDocument();
  });

  it('should handle getUserName correctly with non-existent user_id', async () => {
    // Mock notification data with non-existent user_id
    const mockNotifications: Notification[] = [
      {
        id: 1,
        title: 'Test Notification',
        message: 'This is a test notification',
        user_id: 999, // Non-existent user ID
        is_read: false,
        created_at: '2023-01-01T00:00:00Z'
      }
    ];

    vi.mocked(notificationService.getNotifications).mockResolvedValue(mockNotifications);
    vi.mocked(userService.getUsers).mockResolvedValue([
      { id: 1, name: 'User 1', email: 'user1@example.com' }
    ]);

    render(
      <QueryClientProvider client={queryClient}>
        <NotificationList />
      </QueryClientProvider>
    );

    // Wait for the component to finish loading
    await waitFor(() => {
      expect(screen.queryByText('読み込み中...')).not.toBeInTheDocument();
    });

    // Check if '-' is displayed for non-existent user_id
    expect(screen.getByText('-')).toBeInTheDocument();
  });
});