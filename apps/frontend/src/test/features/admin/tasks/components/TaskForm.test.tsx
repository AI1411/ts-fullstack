import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import TaskForm from '@/features/admin/tasks/components/TaskForm';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { taskService } from '@/features/admin/tasks/services';
import { userService } from '@/features/admin/users/services';
import { teamService } from '@/features/admin/teams/services';

// Mock the services
vi.mock('@/features/admin/tasks/services', () => ({
  taskService: {
    createTask: vi.fn()
  }
}));

vi.mock('@/features/admin/users/services', () => ({
  userService: {
    getUsers: vi.fn()
  }
}));

vi.mock('@/features/admin/teams/services', () => ({
  teamService: {
    getTeams: vi.fn()
  }
}));

describe('TaskForm Component', () => {
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
    // Mock users and teams data
    vi.mocked(userService.getUsers).mockResolvedValue([]);
    vi.mocked(teamService.getTeams).mockResolvedValue([]);

    render(
      <QueryClientProvider client={queryClient}>
        <TaskForm />
      </QueryClientProvider>
    );

    // Check if the component is defined
    expect(TaskForm).toBeDefined();
    expect(typeof TaskForm).toBe('function');

    // Check if form elements are rendered
    expect(screen.getByRole('heading', { name: 'タスクを追加' })).toBeInTheDocument();
    expect(screen.getByLabelText(/タイトル/)).toBeInTheDocument();
    expect(screen.getByLabelText(/説明/)).toBeInTheDocument();
    expect(screen.getByLabelText(/担当ユーザー/)).toBeInTheDocument();
    expect(screen.getByLabelText(/チーム/)).toBeInTheDocument();
    expect(screen.getByLabelText(/期限日/)).toBeInTheDocument();
    expect(screen.getByLabelText(/ステータス/)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'タスクを追加' })).toBeInTheDocument();
  });

  it('should display user options when users are loaded', async () => {
    // Mock users and teams data
    const mockUsers = [
      { id: 1, name: 'User 1', email: 'user1@example.com' },
      { id: 2, name: 'User 2', email: 'user2@example.com' }
    ];

    vi.mocked(userService.getUsers).mockResolvedValue(mockUsers);
    vi.mocked(teamService.getTeams).mockResolvedValue([]);

    render(
      <QueryClientProvider client={queryClient}>
        <TaskForm />
      </QueryClientProvider>
    );

    // Wait for users to load
    await waitFor(() => {
      expect(screen.getByText(/User 1 \(user1@example.com\)/)).toBeInTheDocument();
    });

    // Check if user options are displayed
    expect(screen.getByText('担当者なし')).toBeInTheDocument();
    expect(screen.getByText(/User 1 \(user1@example.com\)/)).toBeInTheDocument();
    expect(screen.getByText(/User 2 \(user2@example.com\)/)).toBeInTheDocument();
  });

  it('should display team options when teams are loaded', async () => {
    // Mock users and teams data
    const mockTeams = [
      { id: 1, name: 'Team 1', description: 'Description 1' },
      { id: 2, name: 'Team 2', description: 'Description 2' }
    ];

    vi.mocked(userService.getUsers).mockResolvedValue([]);
    vi.mocked(teamService.getTeams).mockResolvedValue(mockTeams);

    render(
      <QueryClientProvider client={queryClient}>
        <TaskForm />
      </QueryClientProvider>
    );

    // Wait for teams to load
    await waitFor(() => {
      expect(screen.getByText('Team 1')).toBeInTheDocument();
    });

    // Check if team options are displayed
    expect(screen.getByText('チームなし')).toBeInTheDocument();
    expect(screen.getByText('Team 1')).toBeInTheDocument();
    expect(screen.getByText('Team 2')).toBeInTheDocument();
  });

  it('should submit the form with correct data', async () => {
    // Mock users and teams data
    const mockUsers = [
      { id: 1, name: 'User 1', email: 'user1@example.com' }
    ];

    const mockTeams = [
      { id: 1, name: 'Team 1', description: 'Description 1' }
    ];

    vi.mocked(userService.getUsers).mockResolvedValue(mockUsers);
    vi.mocked(teamService.getTeams).mockResolvedValue(mockTeams);
    vi.mocked(taskService.createTask).mockResolvedValue({
      id: 1,
      title: 'Test Task',
      description: 'Test Description',
      status: 'PENDING',
      user_id: 1,
      team_id: 1,
      due_date: '2023-01-01',
      created_at: '2023-01-01T00:00:00Z'
    });

    render(
      <QueryClientProvider client={queryClient}>
        <TaskForm />
      </QueryClientProvider>
    );

    // Wait for users and teams to load
    await waitFor(() => {
      expect(screen.getByText(/User 1/)).toBeInTheDocument();
      expect(screen.getByText('Team 1')).toBeInTheDocument();
    });

    // Fill the form
    const titleInput = screen.getByLabelText(/タイトル/);
    fireEvent.change(titleInput, { target: { value: 'Test Task' } });

    const descriptionInput = screen.getByLabelText(/説明/);
    fireEvent.change(descriptionInput, { target: { value: 'Test Description' } });

    const userSelect = screen.getByLabelText(/担当ユーザー/);
    fireEvent.change(userSelect, { target: { value: '1' } });

    const teamSelect = screen.getByLabelText(/チーム/);
    fireEvent.change(teamSelect, { target: { value: '1' } });

    const dueDateInput = screen.getByLabelText(/期限日/);
    fireEvent.change(dueDateInput, { target: { value: '2023-01-01' } });

    const statusSelect = screen.getByLabelText(/ステータス/);
    fireEvent.change(statusSelect, { target: { value: 'PENDING' } });

    // Submit the form
    const submitButton = screen.getByRole('button', { name: 'タスクを追加' });
    fireEvent.click(submitButton);

    // Verify createTask was called with correct data
    await waitFor(() => {
      expect(taskService.createTask).toHaveBeenCalledWith({
        title: 'Test Task',
        description: 'Test Description',
        user_id: 1,
        team_id: 1,
        status: 'PENDING',
        due_date: '2023-01-01'
      });
    });

    // Form should be reset after successful submission
    await waitFor(() => {
      expect(titleInput).toHaveValue('');
      expect(descriptionInput).toHaveValue('');
    });
  });

  it('should show error message when task creation fails', async () => {
    // Mock users and teams data
    vi.mocked(userService.getUsers).mockResolvedValue([]);
    vi.mocked(teamService.getTeams).mockResolvedValue([]);
    vi.mocked(taskService.createTask).mockRejectedValue(new Error('API error'));

    render(
      <QueryClientProvider client={queryClient}>
        <TaskForm />
      </QueryClientProvider>
    );

    // Fill the form with minimal required data
    const titleInput = screen.getByLabelText(/タイトル/);
    fireEvent.change(titleInput, { target: { value: 'Test Task' } });

    // Submit the form
    const submitButton = screen.getByRole('button', { name: 'タスクを追加' });
    fireEvent.click(submitButton);

    // Check if error message is displayed
    await waitFor(() => {
      expect(screen.getByText('タスクの追加に失敗しました')).toBeInTheDocument();
    });

    // Form should not be reset
    expect(titleInput).toHaveValue('Test Task');
  });

  it('should disable submit button while submitting', async () => {
    // Mock users and teams data
    vi.mocked(userService.getUsers).mockResolvedValue([]);
    vi.mocked(teamService.getTeams).mockResolvedValue([]);

    // Mock a delayed response to ensure we see the submitting state
    vi.mocked(taskService.createTask).mockImplementation(
      () => new Promise(resolve => setTimeout(() => resolve({
        id: 1,
        title: 'Test Task',
        description: 'Test Description',
        status: 'PENDING',
        user_id: null,
        team_id: null,
        due_date: null,
        created_at: '2023-01-01T00:00:00Z'
      }), 100))
    );

    render(
      <QueryClientProvider client={queryClient}>
        <TaskForm />
      </QueryClientProvider>
    );

    // Fill the form with minimal required data
    const titleInput = screen.getByLabelText(/タイトル/);
    fireEvent.change(titleInput, { target: { value: 'Test Task' } });

    // Submit the form
    const submitButton = screen.getByRole('button', { name: 'タスクを追加' });
    fireEvent.click(submitButton);

    // Check if button text changes to "送信中..."
    expect(screen.getByText('送信中...')).toBeInTheDocument();

    // Check if button is disabled
    const disabledButton = screen.getByText('送信中...');
    expect(disabledButton).toBeDisabled();

    // Wait for submission to complete
    await waitFor(() => {
      expect(screen.queryByText('送信中...')).not.toBeInTheDocument();
    });

    // Button should be enabled again
    expect(screen.getByRole('button', { name: 'タスクを追加' })).toBeEnabled();
  });
});
