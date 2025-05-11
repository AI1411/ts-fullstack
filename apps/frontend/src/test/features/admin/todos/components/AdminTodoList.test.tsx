import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import AdminTodoList from '@/features/admin/todos/components/AdminTodoList';
import { todoService } from '@/features/admin/todos/services';

// Mock the todoService
vi.mock('@/features/admin/todos/services', () => ({
  todoService: {
    getTodos: vi.fn(),
    updateTodo: vi.fn(),
    deleteTodo: vi.fn()
  }
}));

// Mock React Query
const mockUseQuery = vi.fn();
const mockUseQueryClient = vi.fn();

vi.mock('@tanstack/react-query', () => ({
  useQuery: () => mockUseQuery(),
  useQueryClient: () => mockUseQueryClient()
}));

describe('AdminTodoList Component', () => {
  const mockTodos = [
    {
      id: 1,
      title: 'Test Todo 1',
      description: 'This is a test todo',
      user_id: 1,
      status: 'PENDING',
      created_at: '2023-01-01T00:00:00.000Z',
      updated_at: '2023-01-01T00:00:00.000Z'
    },
    {
      id: 2,
      title: 'Test Todo 2',
      description: null,
      user_id: null,
      status: 'COMPLETED',
      created_at: '2023-01-02T00:00:00.000Z',
      updated_at: '2023-01-02T00:00:00.000Z'
    }
  ];

  beforeEach(() => {
    vi.clearAllMocks();
    // Setup the mock to return our test data
    vi.mocked(todoService.getTodos).mockResolvedValue(mockTodos);
    vi.mocked(todoService.updateTodo).mockResolvedValue(mockTodos[0]);
    vi.mocked(todoService.deleteTodo).mockResolvedValue(undefined);

    // Mock window.confirm
    vi.spyOn(window, 'confirm').mockImplementation(() => true);

    // Setup default mock implementation for useQuery
    mockUseQuery.mockReturnValue({
      data: mockTodos,
      isLoading: false,
      error: null
    });

    // Setup default mock implementation for useQueryClient
    mockUseQueryClient.mockReturnValue({
      invalidateQueries: vi.fn()
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('renders todos in a table', () => {
    render(<AdminTodoList />);

    // Check if the table headers are rendered
    expect(screen.getByText('ID')).toBeInTheDocument();
    expect(screen.getByText('タイトル')).toBeInTheDocument();
    expect(screen.getByText('説明')).toBeInTheDocument();
    expect(screen.getByText('ステータス')).toBeInTheDocument();
    expect(screen.getByText('作成日')).toBeInTheDocument();
    expect(screen.getByText('アクション')).toBeInTheDocument();

    // Check if the todos are rendered
    expect(screen.getByText('Test Todo 1')).toBeInTheDocument();
    expect(screen.getByText('This is a test todo')).toBeInTheDocument();
    expect(screen.getByText('Test Todo 2')).toBeInTheDocument();

    // Check status badges
    expect(screen.getByText('未着手')).toBeInTheDocument();
    expect(screen.getByText('完了')).toBeInTheDocument();

    // Check action buttons
    const editButtons = screen.getAllByText('編集');
    expect(editButtons.length).toBe(2);
    const deleteButtons = screen.getAllByText('削除');
    expect(deleteButtons.length).toBe(2);
  });

  it('enters edit mode when edit button is clicked', async () => {
    const user = userEvent.setup();
    render(<AdminTodoList />);

    // Click the edit button for the first todo
    const editButtons = screen.getAllByText('編集');
    await user.click(editButtons[0]);

    // Check if the form inputs are rendered
    const titleInput = screen.getByDisplayValue('Test Todo 1');
    expect(titleInput).toBeInTheDocument();
    const descriptionInput = screen.getByDisplayValue('This is a test todo');
    expect(descriptionInput).toBeInTheDocument();

    // Check if the save and cancel buttons are rendered
    expect(screen.getByText('保存')).toBeInTheDocument();
    expect(screen.getByText('キャンセル')).toBeInTheDocument();
  });

  it('updates a todo when save button is clicked', async () => {
    const user = userEvent.setup();
    render(<AdminTodoList />);

    // Click the edit button for the first todo
    const editButtons = screen.getAllByText('編集');
    await user.click(editButtons[0]);

    // Edit the title
    const titleInput = screen.getByDisplayValue('Test Todo 1');
    await user.clear(titleInput);
    await user.type(titleInput, 'Updated Todo');

    // Click the save button
    await user.click(screen.getByText('保存'));

    // Check if updateTodo was called with the correct data
    await waitFor(() => {
      expect(todoService.updateTodo).toHaveBeenCalledWith(1, {
        title: 'Updated Todo',
        description: 'This is a test todo',
        status: 'PENDING'
      });
    });
  });

  it('cancels editing when cancel button is clicked', async () => {
    const user = userEvent.setup();
    render(<AdminTodoList />);

    // Click the edit button for the first todo
    const editButtons = screen.getAllByText('編集');
    await user.click(editButtons[0]);

    // Edit the title
    const titleInput = screen.getByDisplayValue('Test Todo 1');
    await user.clear(titleInput);
    await user.type(titleInput, 'Updated Todo');

    // Click the cancel button
    await user.click(screen.getByText('キャンセル'));

    // Check if we're back in view mode
    expect(screen.queryByDisplayValue('Updated Todo')).not.toBeInTheDocument();
    expect(screen.getByText('Test Todo 1')).toBeInTheDocument();
  });

  it('deletes a todo when delete button is clicked and confirmed', async () => {
    const user = userEvent.setup();
    render(<AdminTodoList />);

    // Click the delete button for the first todo
    const deleteButtons = screen.getAllByText('削除');
    await user.click(deleteButtons[0]);

    // Check if confirm was called
    expect(window.confirm).toHaveBeenCalledWith('このTodoを削除してもよろしいですか？');

    // Check if deleteTodo was called with the correct id
    await waitFor(() => {
      expect(todoService.deleteTodo).toHaveBeenCalledWith(1);
    });
  });

  it('does not delete a todo when delete is canceled', async () => {
    // Mock confirm to return false
    vi.spyOn(window, 'confirm').mockImplementationOnce(() => false);

    const user = userEvent.setup();
    render(<AdminTodoList />);

    // Click the delete button for the first todo
    const deleteButtons = screen.getAllByText('削除');
    await user.click(deleteButtons[0]);

    // Check if confirm was called
    expect(window.confirm).toHaveBeenCalledWith('このTodoを削除してもよろしいですか？');

    // Check that deleteTodo was not called
    expect(todoService.deleteTodo).not.toHaveBeenCalled();
  });

  it('shows loading state when data is loading', () => {
    // Override the mock for this test
    mockUseQuery.mockReturnValue({
      data: undefined,
      isLoading: true,
      error: null
    });

    render(<AdminTodoList />);
    expect(screen.getByText('読み込み中...')).toBeInTheDocument();
  });

  it('shows error state when there is an error', () => {
    // Override the mock for this test
    mockUseQuery.mockReturnValue({
      data: undefined,
      isLoading: false,
      error: new Error('Failed to fetch todos')
    });

    render(<AdminTodoList />);
    expect(screen.getByText('エラーが発生しました')).toBeInTheDocument();
  });
});
