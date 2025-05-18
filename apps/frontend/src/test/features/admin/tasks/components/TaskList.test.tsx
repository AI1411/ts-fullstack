import TaskList from '@/features/admin/tasks/components/TaskList';
import { taskService } from '@/features/admin/tasks/services';
import { teamService } from '@/features/admin/teams/services';
import { userService } from '@/features/admin/users/services';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

// Mock the services
vi.mock('@/features/admin/tasks/services', () => ({
  taskService: {
    getTasks: vi.fn(),
    updateTask: vi.fn(),
    deleteTask: vi.fn(),
  },
}));

vi.mock('@/features/admin/users/services', () => ({
  userService: {
    getUsers: vi.fn(),
  },
}));

vi.mock('@/features/admin/teams/services', () => ({
  teamService: {
    getTeams: vi.fn(),
  },
}));

// Mock the SubTaskList and SubTaskForm components
vi.mock('@/features/admin/sub-tasks/components/SubTaskList', () => ({
  default: vi.fn(() => (
    <div data-testid="mock-subtask-list">Mock SubTaskList</div>
  )),
}));

vi.mock('@/features/admin/sub-tasks/components/SubTaskForm', () => ({
  default: vi.fn(() => (
    <div data-testid="mock-subtask-form">Mock SubTaskForm</div>
  )),
}));

// Mock window.confirm
const originalConfirm = window.confirm;
window.confirm = vi.fn();

describe('TaskList Component', () => {
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
    window.confirm = vi.fn(() => true); // Default to confirming
  });

  afterEach(() => {
    window.confirm = originalConfirm;
  });

  it('should render loading state', () => {
    // Mock loading state
    vi.mocked(taskService.getTasks).mockImplementation(
      () => new Promise(() => {})
    );
    vi.mocked(userService.getUsers).mockResolvedValue([]);
    vi.mocked(teamService.getTeams).mockResolvedValue([]);

    render(
      <QueryClientProvider client={queryClient}>
        <TaskList />
      </QueryClientProvider>
    );

    expect(screen.getByText('読み込み中...')).toBeInTheDocument();
  });

  it('should render error state', async () => {
    // Mock error state
    vi.mocked(taskService.getTasks).mockRejectedValue(new Error('API error'));
    vi.mocked(userService.getUsers).mockResolvedValue([]);
    vi.mocked(teamService.getTeams).mockResolvedValue([]);

    render(
      <QueryClientProvider client={queryClient}>
        <TaskList />
      </QueryClientProvider>
    );

    await waitFor(() => {
      expect(screen.getByText('エラーが発生しました')).toBeInTheDocument();
    });
  });

  it('should render tasks when loaded', async () => {
    // Mock tasks, users, and teams data
    const mockTasks = [
      {
        id: 1,
        title: 'Task 1',
        description: 'Description 1',
        status: 'PENDING',
        user_id: 1,
        team_id: 1,
        due_date: '2023-01-01',
        created_at: '2023-01-01T00:00:00Z',
      },
      {
        id: 2,
        title: 'Task 2',
        description: 'Description 2',
        status: 'IN_PROGRESS',
        user_id: 2,
        team_id: 2,
        due_date: '2023-01-02',
        created_at: '2023-01-01T00:00:00Z',
      },
    ];

    const mockUsers = [
      { id: 1, name: 'User 1' },
      { id: 2, name: 'User 2' },
    ];

    const mockTeams = [
      { id: 1, name: 'Team 1' },
      { id: 2, name: 'Team 2' },
    ];

    vi.mocked(taskService.getTasks).mockResolvedValue(mockTasks);
    vi.mocked(userService.getUsers).mockResolvedValue(mockUsers);
    vi.mocked(teamService.getTeams).mockResolvedValue(mockTeams);

    render(
      <QueryClientProvider client={queryClient}>
        <TaskList />
      </QueryClientProvider>
    );

    // Wait for tasks to load
    await waitFor(() => {
      expect(screen.getByText('Task 1')).toBeInTheDocument();
    });

    // Check if tasks are displayed
    expect(screen.getByText('Task 1')).toBeInTheDocument();
    expect(screen.getByText('Task 2')).toBeInTheDocument();
    expect(screen.getByText('Description 1')).toBeInTheDocument();
    expect(screen.getByText('Description 2')).toBeInTheDocument();

    // Check if status badges are displayed with correct colors
    const pendingBadge = screen.getByText('未着手');
    const inProgressBadge = screen.getByText('進行中');
    expect(pendingBadge).toBeInTheDocument();
    expect(inProgressBadge).toBeInTheDocument();

    // Check if user and team names are displayed
    expect(screen.getByText('User 1')).toBeInTheDocument();
    expect(screen.getByText('User 2')).toBeInTheDocument();
    expect(screen.getByText('Team 1')).toBeInTheDocument();
    expect(screen.getByText('Team 2')).toBeInTheDocument();
  });

  it('should enter edit mode when edit button is clicked', async () => {
    // Mock tasks, users, and teams data
    const mockTasks = [
      {
        id: 1,
        title: 'Task 1',
        description: 'Description 1',
        status: 'PENDING',
        user_id: 1,
        team_id: 1,
        due_date: '2023-01-01',
        created_at: '2023-01-01T00:00:00Z',
      },
    ];

    const mockUsers = [
      { id: 1, name: 'User 1' },
      { id: 2, name: 'User 2' },
    ];

    const mockTeams = [
      { id: 1, name: 'Team 1' },
      { id: 2, name: 'Team 2' },
    ];

    vi.mocked(taskService.getTasks).mockResolvedValue(mockTasks);
    vi.mocked(userService.getUsers).mockResolvedValue(mockUsers);
    vi.mocked(teamService.getTeams).mockResolvedValue(mockTeams);

    render(
      <QueryClientProvider client={queryClient}>
        <TaskList />
      </QueryClientProvider>
    );

    // Wait for tasks to load
    await waitFor(() => {
      expect(screen.getByText('Task 1')).toBeInTheDocument();
    });

    // Click edit button
    const editButton = screen.getByText('編集');
    fireEvent.click(editButton);

    // Check if edit mode is active
    expect(screen.getByText('保存')).toBeInTheDocument();
    expect(screen.getByText('キャンセル')).toBeInTheDocument();

    // Check if form inputs are populated with task data
    const titleInput = screen.getByDisplayValue('Task 1');
    const descriptionInput = screen.getByDisplayValue('Description 1');
    expect(titleInput).toBeInTheDocument();
    expect(descriptionInput).toBeInTheDocument();
  });

  it('should update task when save button is clicked', async () => {
    // Mock tasks, users, and teams data
    const mockTasks = [
      {
        id: 1,
        title: 'Task 1',
        description: 'Description 1',
        status: 'PENDING',
        user_id: 1,
        team_id: 1,
        due_date: '2023-01-01',
        created_at: '2023-01-01T00:00:00Z',
      },
    ];

    const mockUsers = [
      { id: 1, name: 'User 1' },
      { id: 2, name: 'User 2' },
    ];

    const mockTeams = [
      { id: 1, name: 'Team 1' },
      { id: 2, name: 'Team 2' },
    ];

    vi.mocked(taskService.getTasks).mockResolvedValue(mockTasks);
    vi.mocked(userService.getUsers).mockResolvedValue(mockUsers);
    vi.mocked(teamService.getTeams).mockResolvedValue(mockTeams);
    vi.mocked(taskService.updateTask).mockResolvedValue({
      ...mockTasks[0],
      title: 'Updated Task',
      description: 'Updated Description',
    });

    render(
      <QueryClientProvider client={queryClient}>
        <TaskList />
      </QueryClientProvider>
    );

    // Wait for tasks to load
    await waitFor(() => {
      expect(screen.getByText('Task 1')).toBeInTheDocument();
    });

    // Click edit button
    const editButton = screen.getByText('編集');
    fireEvent.click(editButton);

    // Update form inputs
    const titleInput = screen.getByDisplayValue('Task 1');
    const descriptionInput = screen.getByDisplayValue('Description 1');

    fireEvent.change(titleInput, { target: { value: 'Updated Task' } });
    fireEvent.change(descriptionInput, {
      target: { value: 'Updated Description' },
    });

    // Click save button
    const saveButton = screen.getByText('保存');
    fireEvent.click(saveButton);

    // Verify updateTask was called with correct data
    await waitFor(() => {
      expect(taskService.updateTask).toHaveBeenCalledWith(1, {
        title: 'Updated Task',
        description: 'Updated Description',
        status: 'PENDING',
        user_id: 1,
        team_id: 1,
        due_date: '2023-01-01',
      });
    });
  });

  it('should cancel edit mode when cancel button is clicked', async () => {
    // Mock tasks, users, and teams data
    const mockTasks = [
      {
        id: 1,
        title: 'Task 1',
        description: 'Description 1',
        status: 'PENDING',
        user_id: 1,
        team_id: 1,
        due_date: '2023-01-01',
        created_at: '2023-01-01T00:00:00Z',
      },
    ];

    vi.mocked(taskService.getTasks).mockResolvedValue(mockTasks);
    vi.mocked(userService.getUsers).mockResolvedValue([]);
    vi.mocked(teamService.getTeams).mockResolvedValue([]);

    render(
      <QueryClientProvider client={queryClient}>
        <TaskList />
      </QueryClientProvider>
    );

    // Wait for tasks to load
    await waitFor(() => {
      expect(screen.getByText('Task 1')).toBeInTheDocument();
    });

    // Click edit button
    const editButton = screen.getByText('編集');
    fireEvent.click(editButton);

    // Check if edit mode is active
    expect(screen.getByText('保存')).toBeInTheDocument();
    expect(screen.getByText('キャンセル')).toBeInTheDocument();

    // Click cancel button
    const cancelButton = screen.getByText('キャンセル');
    fireEvent.click(cancelButton);

    // Check if edit mode is deactivated
    expect(screen.queryByText('保存')).not.toBeInTheDocument();
    expect(screen.queryByText('キャンセル')).not.toBeInTheDocument();
    expect(screen.getByText('編集')).toBeInTheDocument();
  });

  it('should delete task when delete button is clicked and confirmed', async () => {
    // Mock tasks, users, and teams data
    const mockTasks = [
      {
        id: 1,
        title: 'Task 1',
        description: 'Description 1',
        status: 'PENDING',
        user_id: 1,
        team_id: 1,
        due_date: '2023-01-01',
        created_at: '2023-01-01T00:00:00Z',
      },
    ];

    vi.mocked(taskService.getTasks).mockResolvedValue(mockTasks);
    vi.mocked(userService.getUsers).mockResolvedValue([]);
    vi.mocked(teamService.getTeams).mockResolvedValue([]);
    vi.mocked(taskService.deleteTask).mockResolvedValue();

    // Mock confirm to return true (user confirms deletion)
    window.confirm = vi.fn(() => true);

    render(
      <QueryClientProvider client={queryClient}>
        <TaskList />
      </QueryClientProvider>
    );

    // Wait for tasks to load
    await waitFor(() => {
      expect(screen.getByText('Task 1')).toBeInTheDocument();
    });

    // Click delete button
    const deleteButton = screen.getByText('削除');
    fireEvent.click(deleteButton);

    // Verify confirm was called
    expect(window.confirm).toHaveBeenCalledWith(
      'このタスクを削除してもよろしいですか？'
    );

    // Verify deleteTask was called with correct ID
    await waitFor(() => {
      expect(taskService.deleteTask).toHaveBeenCalledWith(1);
    });
  });

  it('should not delete task when delete is not confirmed', async () => {
    // Mock tasks, users, and teams data
    const mockTasks = [
      {
        id: 1,
        title: 'Task 1',
        description: 'Description 1',
        status: 'PENDING',
        user_id: 1,
        team_id: 1,
        due_date: '2023-01-01',
        created_at: '2023-01-01T00:00:00Z',
      },
    ];

    vi.mocked(taskService.getTasks).mockResolvedValue(mockTasks);
    vi.mocked(userService.getUsers).mockResolvedValue([]);
    vi.mocked(teamService.getTeams).mockResolvedValue([]);
    vi.mocked(taskService.deleteTask).mockResolvedValue();

    // Mock confirm to return false (user cancels deletion)
    window.confirm = vi.fn(() => false);

    render(
      <QueryClientProvider client={queryClient}>
        <TaskList />
      </QueryClientProvider>
    );

    // Wait for tasks to load
    await waitFor(() => {
      expect(screen.getByText('Task 1')).toBeInTheDocument();
    });

    // Click delete button
    const deleteButton = screen.getByText('削除');
    fireEvent.click(deleteButton);

    // Verify confirm was called
    expect(window.confirm).toHaveBeenCalledWith(
      'このタスクを削除してもよろしいですか？'
    );

    // Verify deleteTask was not called
    expect(taskService.deleteTask).not.toHaveBeenCalled();
  });

  it('should expand task to show subtasks when expand button is clicked', async () => {
    // Mock tasks, users, and teams data
    const mockTasks = [
      {
        id: 1,
        title: 'Task 1',
        description: 'Description 1',
        status: 'PENDING',
        user_id: 1,
        team_id: 1,
        due_date: '2023-01-01',
        created_at: '2023-01-01T00:00:00Z',
      },
    ];

    vi.mocked(taskService.getTasks).mockResolvedValue(mockTasks);
    vi.mocked(userService.getUsers).mockResolvedValue([]);
    vi.mocked(teamService.getTeams).mockResolvedValue([]);

    render(
      <QueryClientProvider client={queryClient}>
        <TaskList />
      </QueryClientProvider>
    );

    // Wait for tasks to load
    await waitFor(() => {
      expect(screen.getByText('Task 1')).toBeInTheDocument();
    });

    // Initially, subtask list should not be visible
    expect(screen.queryByTestId('mock-subtask-list')).not.toBeInTheDocument();

    // Find and click the expand button (it has an icon, so we need to find it by role)
    const expandButtons = screen.getAllByRole('button');
    // The first button should be the expand button
    fireEvent.click(expandButtons[0]);

    // Now subtask list should be visible
    expect(screen.getByTestId('mock-subtask-list')).toBeInTheDocument();
  });

  it('should show subtask form when add subtask button is clicked', async () => {
    // Mock tasks, users, and teams data
    const mockTasks = [
      {
        id: 1,
        title: 'Task 1',
        description: 'Description 1',
        status: 'PENDING',
        user_id: 1,
        team_id: 1,
        due_date: '2023-01-01',
        created_at: '2023-01-01T00:00:00Z',
      },
    ];

    vi.mocked(taskService.getTasks).mockResolvedValue(mockTasks);
    vi.mocked(userService.getUsers).mockResolvedValue([]);
    vi.mocked(teamService.getTeams).mockResolvedValue([]);

    render(
      <QueryClientProvider client={queryClient}>
        <TaskList />
      </QueryClientProvider>
    );

    // Wait for tasks to load
    await waitFor(() => {
      expect(screen.getByText('Task 1')).toBeInTheDocument();
    });

    // Initially, subtask form should not be visible
    expect(screen.queryByTestId('mock-subtask-form')).not.toBeInTheDocument();

    // Find and click the add subtask button (it has an icon, so we need to find it by title)
    const addSubtaskButton = screen.getByTitle('サブタスクを追加');
    fireEvent.click(addSubtaskButton);

    // Now subtask form should be visible
    expect(screen.getByTestId('mock-subtask-form')).toBeInTheDocument();
  });
});
