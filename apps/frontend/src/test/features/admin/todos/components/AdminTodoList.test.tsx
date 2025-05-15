import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import AdminTodoList from '@/features/admin/todos/components/AdminTodoList';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { todoService } from '@/features/admin/todos/services';
import { Todo } from '@/features/admin/todos/controllers';

// Mock the services
vi.mock('@/features/admin/todos/services', () => ({
  todoService: {
    getTodos: vi.fn(),
    updateTodo: vi.fn(),
    deleteTodo: vi.fn()
  }
}));

describe('AdminTodoList Component', () => {
  let queryClient: QueryClient;
  const mockTodos: Todo[] = [
    {
      id: 1,
      user_id: 1,
      title: 'Test Todo 1',
      description: 'Description 1',
      status: 'PENDING',
      created_at: '2023-01-01T00:00:00Z',
      updated_at: '2023-01-01T00:00:00Z'
    },
    {
      id: 2,
      user_id: 1,
      title: 'Test Todo 2',
      description: 'Description 2',
      status: 'IN_PROGRESS',
      created_at: '2023-01-02T00:00:00Z',
      updated_at: '2023-01-02T00:00:00Z'
    },
    {
      id: 3,
      user_id: 2,
      title: 'Test Todo 3',
      description: 'Description 3',
      status: 'COMPLETED',
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
    // Mock getTodos to return empty array
    vi.mocked(todoService.getTodos).mockResolvedValue([]);

    render(
      <QueryClientProvider client={queryClient}>
        <AdminTodoList />
      </QueryClientProvider>
    );

    // Check if the component is defined
    expect(AdminTodoList).toBeDefined();
    expect(typeof AdminTodoList).toBe('function');

    // Check if the component renders without crashing
    // The component might be in a loading state or showing the table
    const component = screen.queryByTestId('loading') || screen.queryByTestId('admin-todo-list') || screen.queryByTestId('admin-todo-table');
    expect(component).toBeInTheDocument();
  });

  it('should show loading state initially', () => {
    // Mock getTodos to return a promise that never resolves
    vi.mocked(todoService.getTodos).mockImplementation(() => new Promise(() => {}));

    render(
      <QueryClientProvider client={queryClient}>
        <AdminTodoList />
      </QueryClientProvider>
    );

    // Check if loading state is displayed
    expect(screen.getByTestId('loading')).toBeInTheDocument();
    expect(screen.getByText('読み込み中...')).toBeInTheDocument();
  });

  it('should show error state when fetching todos fails', async () => {
    // Mock getTodos to reject with an error
    vi.mocked(todoService.getTodos).mockRejectedValue(new Error('Failed to fetch todos'));

    render(
      <QueryClientProvider client={queryClient}>
        <AdminTodoList />
      </QueryClientProvider>
    );

    // Check if error state is displayed
    await waitFor(() => {
      expect(screen.getByTestId('error')).toBeInTheDocument();
      expect(screen.getByText('エラーが発生しました')).toBeInTheDocument();
    });
  });

  it('should render todos when data is loaded', async () => {
    // Mock getTodos to return mock todos
    vi.mocked(todoService.getTodos).mockResolvedValue(mockTodos);

    render(
      <QueryClientProvider client={queryClient}>
        <AdminTodoList />
      </QueryClientProvider>
    );

    // Wait for todos to load
    await waitFor(() => {
      expect(screen.getByTestId('admin-todo-table')).toBeInTheDocument();
    });

    // Check if todos are displayed
    expect(screen.getByText('Test Todo 1')).toBeInTheDocument();
    expect(screen.getByText('Test Todo 2')).toBeInTheDocument();
    expect(screen.getByText('Test Todo 3')).toBeInTheDocument();

    // Check if status badges are displayed with correct colors
    const pendingBadge = screen.getByText('未着手');
    const inProgressBadge = screen.getByText('進行中');
    const completedBadge = screen.getByText('完了');

    expect(pendingBadge).toBeInTheDocument();
    expect(inProgressBadge).toBeInTheDocument();
    expect(completedBadge).toBeInTheDocument();

    // Check if edit and delete buttons are displayed
    const editButtons = screen.getAllByText('編集');
    const deleteButtons = screen.getAllByText('削除');

    expect(editButtons.length).toBe(3);
    expect(deleteButtons.length).toBe(3);
  });

  it('should enter edit mode when edit button is clicked', async () => {
    // Mock getTodos to return mock todos
    vi.mocked(todoService.getTodos).mockResolvedValue(mockTodos);

    render(
      <QueryClientProvider client={queryClient}>
        <AdminTodoList />
      </QueryClientProvider>
    );

    // Wait for todos to load
    await waitFor(() => {
      expect(screen.getByTestId('admin-todo-table')).toBeInTheDocument();
    });

    // Click edit button for the first todo
    const editButtons = screen.getAllByText('編集');
    fireEvent.click(editButtons[0]);

    // Check if edit form is displayed
    const titleInput = screen.getByDisplayValue('Test Todo 1');
    const descriptionInput = screen.getByDisplayValue('Description 1');
    const statusSelect = screen.getByRole('combobox');

    expect(titleInput).toBeInTheDocument();
    expect(descriptionInput).toBeInTheDocument();
    expect(statusSelect).toBeInTheDocument();

    // Check if save and cancel buttons are displayed
    expect(screen.getByText('保存')).toBeInTheDocument();
    expect(screen.getByText('キャンセル')).toBeInTheDocument();
  });

  it('should cancel edit mode when cancel button is clicked', async () => {
    // Mock getTodos to return mock todos
    vi.mocked(todoService.getTodos).mockResolvedValue(mockTodos);

    render(
      <QueryClientProvider client={queryClient}>
        <AdminTodoList />
      </QueryClientProvider>
    );

    // Wait for todos to load
    await waitFor(() => {
      expect(screen.getByTestId('admin-todo-table')).toBeInTheDocument();
    });

    // Click edit button for the first todo
    const editButtons = screen.getAllByText('編集');
    fireEvent.click(editButtons[0]);

    // Check if edit form is displayed
    expect(screen.getByDisplayValue('Test Todo 1')).toBeInTheDocument();

    // Click cancel button
    const cancelButton = screen.getByText('キャンセル');
    fireEvent.click(cancelButton);

    // Check if edit form is no longer displayed
    expect(screen.queryByDisplayValue('Test Todo 1')).not.toBeInTheDocument();

    // Check if edit button is displayed again
    expect(screen.getAllByText('編集').length).toBe(3);
  });

  it('should update todo when save button is clicked', async () => {
    // Mock getTodos to return mock todos
    vi.mocked(todoService.getTodos).mockResolvedValue(mockTodos);

    // Mock updateTodo to return updated todo
    const updatedTodo = {
      ...mockTodos[0],
      title: 'Updated Todo',
      description: 'Updated Description',
      status: 'COMPLETED'
    };
    vi.mocked(todoService.updateTodo).mockResolvedValue(updatedTodo);

    render(
      <QueryClientProvider client={queryClient}>
        <AdminTodoList />
      </QueryClientProvider>
    );

    // Wait for todos to load
    await waitFor(() => {
      expect(screen.getByTestId('admin-todo-table')).toBeInTheDocument();
    });

    // Click edit button for the first todo
    const editButtons = screen.getAllByText('編集');
    fireEvent.click(editButtons[0]);

    // Update form fields
    const titleInput = screen.getByDisplayValue('Test Todo 1');
    fireEvent.change(titleInput, { target: { value: 'Updated Todo' } });

    const descriptionInput = screen.getByDisplayValue('Description 1');
    fireEvent.change(descriptionInput, { target: { value: 'Updated Description' } });

    const statusSelect = screen.getByRole('combobox');
    fireEvent.change(statusSelect, { target: { value: 'COMPLETED' } });

    // Click save button
    const saveButton = screen.getByText('保存');
    fireEvent.click(saveButton);

    // Check if updateTodo was called with correct arguments
    await waitFor(() => {
      expect(todoService.updateTodo).toHaveBeenCalledWith(1, {
        title: 'Updated Todo',
        description: 'Updated Description',
        status: 'COMPLETED'
      });
    });
  });

  it('should delete todo when delete button is clicked and confirmed', async () => {
    // Mock getTodos to return mock todos
    vi.mocked(todoService.getTodos).mockResolvedValue(mockTodos);

    // Mock deleteTodo to resolve successfully
    vi.mocked(todoService.deleteTodo).mockResolvedValue();

    // Mock window.confirm to return true
    const originalConfirm = window.confirm;
    window.confirm = vi.fn(() => true);

    render(
      <QueryClientProvider client={queryClient}>
        <AdminTodoList />
      </QueryClientProvider>
    );

    // Wait for todos to load
    await waitFor(() => {
      expect(screen.getByTestId('admin-todo-table')).toBeInTheDocument();
    });

    // Click delete button for the first todo
    const deleteButtons = screen.getAllByText('削除');
    fireEvent.click(deleteButtons[0]);

    // Check if deleteTodo was called with correct argument
    await waitFor(() => {
      expect(todoService.deleteTodo).toHaveBeenCalledWith(1);
    });

    // Restore original confirm
    window.confirm = originalConfirm;
  });

  it('should not delete todo when delete is canceled', async () => {
    // Mock getTodos to return mock todos
    vi.mocked(todoService.getTodos).mockResolvedValue(mockTodos);

    // Mock window.confirm to return false
    const originalConfirm = window.confirm;
    window.confirm = vi.fn(() => false);

    render(
      <QueryClientProvider client={queryClient}>
        <AdminTodoList />
      </QueryClientProvider>
    );

    // Wait for todos to load
    await waitFor(() => {
      expect(screen.getByTestId('admin-todo-table')).toBeInTheDocument();
    });

    // Click delete button for the first todo
    const deleteButtons = screen.getAllByText('削除');
    fireEvent.click(deleteButtons[0]);

    // Check if deleteTodo was not called
    expect(todoService.deleteTodo).not.toHaveBeenCalled();

    // Restore original confirm
    window.confirm = originalConfirm;
  });
});
