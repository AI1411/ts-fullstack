import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import UserList from '@/features/admin/users/components/UserList';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { userService } from '@/features/admin/users/services';
import { User } from '@/features/admin/users/controllers';

// Mock the services
vi.mock('@/features/admin/users/services', () => ({
  userService: {
    getUsers: vi.fn(),
    updateUser: vi.fn(),
    deleteUser: vi.fn()
  }
}));

describe('UserList Component', () => {
  let queryClient: QueryClient;
  const mockUsers: User[] = [
    {
      id: 1,
      name: 'Test User 1',
      email: 'user1@example.com',
      created_at: '2023-01-01T00:00:00Z',
      updated_at: '2023-01-01T00:00:00Z'
    },
    {
      id: 2,
      name: 'Test User 2',
      email: 'user2@example.com',
      created_at: '2023-01-02T00:00:00Z',
      updated_at: '2023-01-02T00:00:00Z'
    },
    {
      id: 3,
      name: 'Test User 3',
      email: 'user3@example.com',
      created_at: '2023-01-03T00:00:00Z',
      updated_at: '2023-01-03T00:00:00Z'
    }
  ];

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
    // Mock getUsers to return empty array
    vi.mocked(userService.getUsers).mockResolvedValue([]);

    render(
      <QueryClientProvider client={queryClient}>
        <UserList />
      </QueryClientProvider>
    );

    // Check if the component is defined
    expect(UserList).toBeDefined();
    expect(typeof UserList).toBe('function');

    // Check if the component renders without crashing
    // The component might be in a loading state or showing the table
    const component = screen.queryByTestId('loading') || screen.queryByTestId('user-list') || screen.queryByTestId('user-table');
    expect(component).toBeInTheDocument();
  });

  it('should show loading state initially', () => {
    // Mock getUsers to return a promise that never resolves
    vi.mocked(userService.getUsers).mockImplementation(() => new Promise(() => {}));

    render(
      <QueryClientProvider client={queryClient}>
        <UserList />
      </QueryClientProvider>
    );

    // Check if loading state is displayed
    expect(screen.getByTestId('loading')).toBeInTheDocument();
    expect(screen.getByText('読み込み中...')).toBeInTheDocument();
  });

  it('should show error state when fetching users fails', async () => {
    // Mock getUsers to reject with an error
    vi.mocked(userService.getUsers).mockRejectedValue(new Error('Failed to fetch users'));

    render(
      <QueryClientProvider client={queryClient}>
        <UserList />
      </QueryClientProvider>
    );

    // Check if error state is displayed
    await waitFor(() => {
      expect(screen.getByTestId('error')).toBeInTheDocument();
      expect(screen.getByText('エラーが発生しました')).toBeInTheDocument();
    });
  });

  it('should render users when data is loaded', async () => {
    // Mock getUsers to return mock users
    vi.mocked(userService.getUsers).mockResolvedValue(mockUsers);

    render(
      <QueryClientProvider client={queryClient}>
        <UserList />
      </QueryClientProvider>
    );

    // Wait for users to load
    await waitFor(() => {
      expect(screen.getByTestId('user-table')).toBeInTheDocument();
    });

    // Check if users are displayed
    expect(screen.getByText('Test User 1')).toBeInTheDocument();
    expect(screen.getByText('Test User 2')).toBeInTheDocument();
    expect(screen.getByText('Test User 3')).toBeInTheDocument();

    expect(screen.getByText('user1@example.com')).toBeInTheDocument();
    expect(screen.getByText('user2@example.com')).toBeInTheDocument();
    expect(screen.getByText('user3@example.com')).toBeInTheDocument();

    // Check if edit and delete buttons are displayed
    const editButtons = screen.getAllByText('編集');
    const deleteButtons = screen.getAllByText('削除');

    expect(editButtons.length).toBe(3);
    expect(deleteButtons.length).toBe(3);
  });

  it('should enter edit mode when edit button is clicked', async () => {
    // Mock getUsers to return mock users
    vi.mocked(userService.getUsers).mockResolvedValue(mockUsers);

    render(
      <QueryClientProvider client={queryClient}>
        <UserList />
      </QueryClientProvider>
    );

    // Wait for users to load
    await waitFor(() => {
      expect(screen.getByTestId('user-table')).toBeInTheDocument();
    });

    // Click edit button for the first user
    const editButtons = screen.getAllByText('編集');
    fireEvent.click(editButtons[0]);

    // Check if edit form is displayed
    const nameInput = screen.getByDisplayValue('Test User 1');
    const emailInput = screen.getByDisplayValue('user1@example.com');
    const passwordInput = screen.getByPlaceholderText('新しいパスワード（変更する場合）');

    expect(nameInput).toBeInTheDocument();
    expect(emailInput).toBeInTheDocument();
    expect(passwordInput).toBeInTheDocument();

    // Check if save and cancel buttons are displayed
    expect(screen.getByText('保存')).toBeInTheDocument();
    expect(screen.getByText('キャンセル')).toBeInTheDocument();

    // Check if password toggle button is displayed
    expect(screen.getByText('表示')).toBeInTheDocument();
  });

  it('should toggle password visibility', async () => {
    // Mock getUsers to return mock users
    vi.mocked(userService.getUsers).mockResolvedValue(mockUsers);

    render(
      <QueryClientProvider client={queryClient}>
        <UserList />
      </QueryClientProvider>
    );

    // Wait for users to load
    await waitFor(() => {
      expect(screen.getByTestId('user-table')).toBeInTheDocument();
    });

    // Click edit button for the first user
    const editButtons = screen.getAllByText('編集');
    fireEvent.click(editButtons[0]);

    // Get password input and toggle button
    const passwordInput = screen.getByPlaceholderText('新しいパスワード（変更する場合）');
    const toggleButton = screen.getByText('表示');

    // Initially password should be hidden
    expect(passwordInput).toHaveAttribute('type', 'password');

    // Click toggle button to show password
    fireEvent.click(toggleButton);

    // Password should now be visible
    expect(passwordInput).toHaveAttribute('type', 'text');
    expect(screen.getByText('隠す')).toBeInTheDocument();

    // Click toggle button again to hide password
    fireEvent.click(screen.getByText('隠す'));

    // Password should be hidden again
    expect(passwordInput).toHaveAttribute('type', 'password');
    expect(screen.getByText('表示')).toBeInTheDocument();
  });

  it('should cancel edit mode when cancel button is clicked', async () => {
    // Mock getUsers to return mock users
    vi.mocked(userService.getUsers).mockResolvedValue(mockUsers);

    render(
      <QueryClientProvider client={queryClient}>
        <UserList />
      </QueryClientProvider>
    );

    // Wait for users to load
    await waitFor(() => {
      expect(screen.getByTestId('user-table')).toBeInTheDocument();
    });

    // Click edit button for the first user
    const editButtons = screen.getAllByText('編集');
    fireEvent.click(editButtons[0]);

    // Check if edit form is displayed
    expect(screen.getByDisplayValue('Test User 1')).toBeInTheDocument();

    // Click cancel button
    const cancelButton = screen.getByText('キャンセル');
    fireEvent.click(cancelButton);

    // Check if edit form is no longer displayed
    expect(screen.queryByDisplayValue('Test User 1')).not.toBeInTheDocument();

    // Check if edit button is displayed again
    expect(screen.getAllByText('編集').length).toBe(3);
  });

  it('should update user when save button is clicked', async () => {
    // Mock getUsers to return mock users
    vi.mocked(userService.getUsers).mockResolvedValue(mockUsers);

    // Mock updateUser to return updated user
    const updatedUser = {
      ...mockUsers[0],
      name: 'Updated User',
      email: 'updated@example.com'
    };
    vi.mocked(userService.updateUser).mockResolvedValue(updatedUser);

    render(
      <QueryClientProvider client={queryClient}>
        <UserList />
      </QueryClientProvider>
    );

    // Wait for users to load
    await waitFor(() => {
      expect(screen.getByTestId('user-table')).toBeInTheDocument();
    });

    // Click edit button for the first user
    const editButtons = screen.getAllByText('編集');
    fireEvent.click(editButtons[0]);

    // Update form fields
    const nameInput = screen.getByDisplayValue('Test User 1');
    fireEvent.change(nameInput, { target: { value: 'Updated User' } });

    const emailInput = screen.getByDisplayValue('user1@example.com');
    fireEvent.change(emailInput, { target: { value: 'updated@example.com' } });

    // Click save button
    const saveButton = screen.getByText('保存');
    fireEvent.click(saveButton);

    // Check if updateUser was called with correct arguments
    await waitFor(() => {
      expect(userService.updateUser).toHaveBeenCalledWith(1, {
        name: 'Updated User',
        email: 'updated@example.com'
      });
    });
  });

  it('should update user with password when provided', async () => {
    // Mock getUsers to return mock users
    vi.mocked(userService.getUsers).mockResolvedValue(mockUsers);

    // Mock updateUser to return updated user
    const updatedUser = {
      ...mockUsers[0],
      name: 'Updated User',
      email: 'updated@example.com'
    };
    vi.mocked(userService.updateUser).mockResolvedValue(updatedUser);

    render(
      <QueryClientProvider client={queryClient}>
        <UserList />
      </QueryClientProvider>
    );

    // Wait for users to load
    await waitFor(() => {
      expect(screen.getByTestId('user-table')).toBeInTheDocument();
    });

    // Click edit button for the first user
    const editButtons = screen.getAllByText('編集');
    fireEvent.click(editButtons[0]);

    // Update form fields
    const nameInput = screen.getByDisplayValue('Test User 1');
    fireEvent.change(nameInput, { target: { value: 'Updated User' } });

    const emailInput = screen.getByDisplayValue('user1@example.com');
    fireEvent.change(emailInput, { target: { value: 'updated@example.com' } });

    const passwordInput = screen.getByPlaceholderText('新しいパスワード（変更する場合）');
    fireEvent.change(passwordInput, { target: { value: 'newpassword' } });

    // Click save button
    const saveButton = screen.getByText('保存');
    fireEvent.click(saveButton);

    // Check if updateUser was called with correct arguments including password
    await waitFor(() => {
      expect(userService.updateUser).toHaveBeenCalledWith(1, {
        name: 'Updated User',
        email: 'updated@example.com',
        password: 'newpassword'
      });
    });
  });

  it('should delete user when delete button is clicked and confirmed', async () => {
    // Mock getUsers to return mock users
    vi.mocked(userService.getUsers).mockResolvedValue(mockUsers);

    // Mock deleteUser to resolve successfully
    vi.mocked(userService.deleteUser).mockResolvedValue();

    // Mock window.confirm to return true
    const originalConfirm = window.confirm;
    window.confirm = vi.fn(() => true);

    render(
      <QueryClientProvider client={queryClient}>
        <UserList />
      </QueryClientProvider>
    );

    // Wait for users to load
    await waitFor(() => {
      expect(screen.getByTestId('user-table')).toBeInTheDocument();
    });

    // Click delete button for the first user
    const deleteButtons = screen.getAllByText('削除');
    fireEvent.click(deleteButtons[0]);

    // Check if deleteUser was called with correct argument
    await waitFor(() => {
      expect(userService.deleteUser).toHaveBeenCalledWith(1);
    });

    // Restore original confirm
    window.confirm = originalConfirm;
  });

  it('should not delete user when delete is canceled', async () => {
    // Mock getUsers to return mock users
    vi.mocked(userService.getUsers).mockResolvedValue(mockUsers);

    // Mock window.confirm to return false
    const originalConfirm = window.confirm;
    window.confirm = vi.fn(() => false);

    render(
      <QueryClientProvider client={queryClient}>
        <UserList />
      </QueryClientProvider>
    );

    // Wait for users to load
    await waitFor(() => {
      expect(screen.getByTestId('user-table')).toBeInTheDocument();
    });

    // Click delete button for the first user
    const deleteButtons = screen.getAllByText('削除');
    fireEvent.click(deleteButtons[0]);

    // Check if deleteUser was not called
    expect(userService.deleteUser).not.toHaveBeenCalled();

    // Restore original confirm
    window.confirm = originalConfirm;
  });
});
