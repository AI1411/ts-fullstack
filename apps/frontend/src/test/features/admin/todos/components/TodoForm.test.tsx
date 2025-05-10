import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import TodoForm from '@/features/admin/todos/components/TodoForm';
import { todoService } from '@/features/admin/todos/services';
import { userService } from '@/features/admin/users/services';

// Mock the services
vi.mock('@/features/admin/todos/services', () => ({
  todoService: {
    createTodo: vi.fn()
  }
}));

vi.mock('@/features/admin/users/services', () => ({
  userService: {
    getUsers: vi.fn()
  }
}));

// Mock React Query
vi.mock('@tanstack/react-query', () => {
  const actual = vi.importActual('@tanstack/react-query');
  return {
    ...actual,
    useQuery: ({ queryKey }) => {
      if (queryKey[0] === 'users') {
        return {
          data: [
            { id: 1, name: 'User 1', email: 'user1@example.com' },
            { id: 2, name: 'User 2', email: 'user2@example.com' }
          ],
          isLoading: false,
          error: null
        };
      }
      return {
        data: undefined,
        isLoading: false,
        error: null
      };
    },
    useQueryClient: () => ({
      invalidateQueries: vi.fn()
    })
  };
});

describe('TodoForm Component', () => {
  const mockUsers = [
    { id: 1, name: 'User 1', email: 'user1@example.com' },
    { id: 2, name: 'User 2', email: 'user2@example.com' }
  ];

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(userService.getUsers).mockResolvedValue(mockUsers);
    vi.mocked(todoService.createTodo).mockResolvedValue({
      id: 1,
      title: 'Test Todo',
      description: 'Test Description',
      user_id: 1,
      status: 'PENDING',
      created_at: '2023-01-01T00:00:00.000Z',
      updated_at: '2023-01-01T00:00:00.000Z'
    });
  });

  it('renders the form correctly', () => {
    render(<TodoForm />);

    // Check if form elements are rendered
    expect(screen.getByRole('heading', { name: 'Todoを追加' })).toBeInTheDocument();
    expect(screen.getByLabelText('タイトル')).toBeInTheDocument();
    expect(screen.getByLabelText('説明')).toBeInTheDocument();
    expect(screen.getByLabelText('担当ユーザー')).toBeInTheDocument();
    expect(screen.getByLabelText('ステータス')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Todoを追加' })).toBeInTheDocument();
  });

  it('renders user options correctly', () => {
    render(<TodoForm />);

    // Check if user options are rendered
    const userSelect = screen.getByLabelText('担当ユーザー');
    expect(userSelect).toBeInTheDocument();

    // Open the select dropdown
    fireEvent.click(userSelect);

    // Check if user options are rendered
    expect(screen.getByText('担当者なし')).toBeInTheDocument();
    expect(screen.getByText('User 1 (user1@example.com)')).toBeInTheDocument();
    expect(screen.getByText('User 2 (user2@example.com)')).toBeInTheDocument();
  });

  it('submits the form with correct data', async () => {
    const user = userEvent.setup();
    render(<TodoForm />);

    // Fill out the form
    await user.type(screen.getByLabelText('タイトル'), 'Test Todo');
    await user.type(screen.getByLabelText('説明'), 'Test Description');

    // Select a user
    const userSelect = screen.getByLabelText('担当ユーザー');
    fireEvent.change(userSelect, { target: { value: '1' } });

    // Select a status
    const statusSelect = screen.getByLabelText('ステータス');
    fireEvent.change(statusSelect, { target: { value: 'IN_PROGRESS' } });

    // Submit the form
    await user.click(screen.getByRole('button', { name: 'Todoを追加' }));

    // Check if createTodo was called with the correct data
    await waitFor(() => {
      expect(todoService.createTodo).toHaveBeenCalledWith({
        title: 'Test Todo',
        description: 'Test Description',
        user_id: 1,
        status: 'IN_PROGRESS'
      });
    });
  });

  it('displays error message when submission fails', async () => {
    // Mock createTodo to throw an error
    vi.mocked(todoService.createTodo).mockRejectedValue(new Error('Failed to create todo'));

    const user = userEvent.setup();
    render(<TodoForm />);

    // Fill out the form
    await user.type(screen.getByLabelText('タイトル'), 'Test Todo');

    // Submit the form
    await user.click(screen.getByRole('button', { name: 'Todoを追加' }));

    // Check if error message is displayed
    await waitFor(() => {
      expect(screen.getByText('Failed to create todo')).toBeInTheDocument();
    });
  });
});
