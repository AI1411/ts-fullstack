import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import SubTaskList from '@/features/admin/sub-tasks/components/SubTaskList';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { subTaskService } from '@/features/admin/sub-tasks/services';
import { SubTask } from '@/features/admin/sub-tasks/controllers';

// Mock the sub-task service
vi.mock('@/features/admin/sub-tasks/services', () => ({
  subTaskService: {
    getSubTasksByTaskId: vi.fn(),
    updateSubTask: vi.fn(),
    deleteSubTask: vi.fn()
  }
}));

describe('SubTaskList Component', () => {
  let queryClient: QueryClient;
  const taskId = 1;

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
    vi.mocked(subTaskService.getSubTasksByTaskId).mockResolvedValue([]);

    render(
      <QueryClientProvider client={queryClient}>
        <SubTaskList taskId={taskId} />
      </QueryClientProvider>
    );

    // Check if the component is defined
    expect(SubTaskList).toBeDefined();
    expect(typeof SubTaskList).toBe('function');
  });

  it('should show loading state initially', () => {
    // Mock a delayed response to ensure we see the loading state
    vi.mocked(subTaskService.getSubTasksByTaskId).mockImplementation(
      () => new Promise(resolve => setTimeout(() => resolve([]), 100))
    );

    render(
      <QueryClientProvider client={queryClient}>
        <SubTaskList taskId={taskId} />
      </QueryClientProvider>
    );

    expect(screen.getByText('読み込み中...')).toBeInTheDocument();
  });

  it('should show error state when API call fails', async () => {
    // Mock a failed response
    vi.mocked(subTaskService.getSubTasksByTaskId).mockRejectedValue(new Error('API error'));

    render(
      <QueryClientProvider client={queryClient}>
        <SubTaskList taskId={taskId} />
      </QueryClientProvider>
    );

    // Wait for the error message to appear
    await waitFor(() => {
      expect(screen.getByText('エラーが発生しました')).toBeInTheDocument();
    });
  });

  it('should show empty state when no sub-tasks are available', async () => {
    // Mock successful response with empty array
    vi.mocked(subTaskService.getSubTasksByTaskId).mockResolvedValue([]);

    render(
      <QueryClientProvider client={queryClient}>
        <SubTaskList taskId={taskId} />
      </QueryClientProvider>
    );

    // Wait for the component to finish loading
    await waitFor(() => {
      expect(screen.queryByText('読み込み中...')).not.toBeInTheDocument();
    });

    expect(screen.getByText('サブタスクはありません')).toBeInTheDocument();
  });

  it('should display sub-task list when data is available', async () => {
    // Mock sub-task data
    const mockSubTasks: SubTask[] = [
      {
        id: 1,
        task_id: taskId,
        title: 'Test Sub-Task 1',
        description: 'Description 1',
        status: 'PENDING',
        due_date: '2023-01-01',
        created_at: '2023-01-01T00:00:00Z',
        updated_at: '2023-01-01T00:00:00Z'
      },
      {
        id: 2,
        task_id: taskId,
        title: 'Test Sub-Task 2',
        description: 'Description 2',
        status: 'COMPLETED',
        due_date: '2023-01-02',
        created_at: '2023-01-01T00:00:00Z',
        updated_at: '2023-01-01T00:00:00Z'
      }
    ];

    vi.mocked(subTaskService.getSubTasksByTaskId).mockResolvedValue(mockSubTasks);

    render(
      <QueryClientProvider client={queryClient}>
        <SubTaskList taskId={taskId} />
      </QueryClientProvider>
    );

    // Wait for the component to finish loading
    await waitFor(() => {
      expect(screen.queryByText('読み込み中...')).not.toBeInTheDocument();
    });

    expect(screen.getByText('Test Sub-Task 1')).toBeInTheDocument();
    expect(screen.getByText('Test Sub-Task 2')).toBeInTheDocument();
    expect(screen.getByText('Description 1')).toBeInTheDocument();
    expect(screen.getByText('Description 2')).toBeInTheDocument();
  });

  it('should handle edit mode correctly', async () => {
    // Mock sub-task data
    const mockSubTasks: SubTask[] = [
      {
        id: 1,
        task_id: taskId,
        title: 'Test Sub-Task 1',
        description: 'Description 1',
        status: 'PENDING',
        due_date: '2023-01-01',
        created_at: '2023-01-01T00:00:00Z',
        updated_at: '2023-01-01T00:00:00Z'
      }
    ];

    vi.mocked(subTaskService.getSubTasksByTaskId).mockResolvedValue(mockSubTasks);
    vi.mocked(subTaskService.updateSubTask).mockResolvedValue(mockSubTasks[0]);

    render(
      <QueryClientProvider client={queryClient}>
        <SubTaskList taskId={taskId} />
      </QueryClientProvider>
    );

    // Wait for the component to finish loading
    await waitFor(() => {
      expect(screen.queryByText('読み込み中...')).not.toBeInTheDocument();
    });

    // Click edit button
    const editButtons = screen.getAllByText('編集');
    fireEvent.click(editButtons[0]);

    // Check if edit form is displayed
    expect(screen.getByDisplayValue('Test Sub-Task 1')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Description 1')).toBeInTheDocument();

    // Update the title
    const titleInput = screen.getByDisplayValue('Test Sub-Task 1');
    fireEvent.change(titleInput, { target: { value: 'Updated Sub-Task 1' } });

    // Click save button
    const saveButton = screen.getByText('保存');
    fireEvent.click(saveButton);

    // Verify updateSubTask was called with correct data
    await waitFor(() => {
      expect(subTaskService.updateSubTask).toHaveBeenCalledWith(1, {
        title: 'Updated Sub-Task 1',
        description: 'Description 1',
        status: 'PENDING',
        due_date: '2023-01-01',
        task_id: taskId
      });
    });
  });

  it('should handle cancel edit correctly', async () => {
    // Mock sub-task data
    const mockSubTasks: SubTask[] = [
      {
        id: 1,
        task_id: taskId,
        title: 'Test Sub-Task 1',
        description: 'Description 1',
        status: 'PENDING',
        due_date: '2023-01-01',
        created_at: '2023-01-01T00:00:00Z',
        updated_at: '2023-01-01T00:00:00Z'
      }
    ];

    vi.mocked(subTaskService.getSubTasksByTaskId).mockResolvedValue(mockSubTasks);

    render(
      <QueryClientProvider client={queryClient}>
        <SubTaskList taskId={taskId} />
      </QueryClientProvider>
    );

    // Wait for the component to finish loading
    await waitFor(() => {
      expect(screen.queryByText('読み込み中...')).not.toBeInTheDocument();
    });

    // Click edit button
    const editButtons = screen.getAllByText('編集');
    fireEvent.click(editButtons[0]);

    // Check if edit form is displayed
    expect(screen.getByDisplayValue('Test Sub-Task 1')).toBeInTheDocument();

    // Click cancel button
    const cancelButton = screen.getByText('キャンセル');
    fireEvent.click(cancelButton);

    // Verify we're back to view mode
    await waitFor(() => {
      expect(screen.queryByDisplayValue('Test Sub-Task 1')).not.toBeInTheDocument();
      expect(screen.getByText('Test Sub-Task 1')).toBeInTheDocument();
    });
  });

  it('should handle delete correctly', async () => {
    // Mock sub-task data
    const mockSubTasks: SubTask[] = [
      {
        id: 1,
        task_id: taskId,
        title: 'Test Sub-Task 1',
        description: 'Description 1',
        status: 'PENDING',
        due_date: '2023-01-01',
        created_at: '2023-01-01T00:00:00Z',
        updated_at: '2023-01-01T00:00:00Z'
      }
    ];

    vi.mocked(subTaskService.getSubTasksByTaskId).mockResolvedValue(mockSubTasks);
    vi.mocked(subTaskService.deleteSubTask).mockResolvedValue();

    // Mock window.confirm
    const originalConfirm = window.confirm;
    window.confirm = vi.fn(() => true);

    render(
      <QueryClientProvider client={queryClient}>
        <SubTaskList taskId={taskId} />
      </QueryClientProvider>
    );

    // Wait for the component to finish loading
    await waitFor(() => {
      expect(screen.queryByText('読み込み中...')).not.toBeInTheDocument();
    });

    // Click delete button
    const deleteButtons = screen.getAllByText('削除');
    fireEvent.click(deleteButtons[0]);

    // Verify deleteSubTask was called with correct id
    await waitFor(() => {
      expect(subTaskService.deleteSubTask).toHaveBeenCalledWith(1);
    });

    // Restore original confirm
    window.confirm = originalConfirm;
  });

  it('should not delete when confirm is canceled', async () => {
    // Mock sub-task data
    const mockSubTasks: SubTask[] = [
      {
        id: 1,
        task_id: taskId,
        title: 'Test Sub-Task 1',
        description: 'Description 1',
        status: 'PENDING',
        due_date: '2023-01-01',
        created_at: '2023-01-01T00:00:00Z',
        updated_at: '2023-01-01T00:00:00Z'
      }
    ];

    vi.mocked(subTaskService.getSubTasksByTaskId).mockResolvedValue(mockSubTasks);
    vi.mocked(subTaskService.deleteSubTask).mockResolvedValue();

    // Mock window.confirm to return false
    const originalConfirm = window.confirm;
    window.confirm = vi.fn(() => false);

    render(
      <QueryClientProvider client={queryClient}>
        <SubTaskList taskId={taskId} />
      </QueryClientProvider>
    );

    // Wait for the component to finish loading
    await waitFor(() => {
      expect(screen.queryByText('読み込み中...')).not.toBeInTheDocument();
    });

    // Click delete button
    const deleteButtons = screen.getAllByText('削除');
    fireEvent.click(deleteButtons[0]);

    // Verify deleteSubTask was not called
    expect(subTaskService.deleteSubTask).not.toHaveBeenCalled();

    // Restore original confirm
    window.confirm = originalConfirm;
  });

  it('should display different status badges correctly', async () => {
    // Mock sub-task data with different statuses
    const mockSubTasks: SubTask[] = [
      {
        id: 1,
        task_id: taskId,
        title: 'Pending Task',
        description: 'Description 1',
        status: 'PENDING',
        due_date: null,
        created_at: '2023-01-01T00:00:00Z',
        updated_at: '2023-01-01T00:00:00Z'
      },
      {
        id: 2,
        task_id: taskId,
        title: 'In Progress Task',
        description: 'Description 2',
        status: 'IN_PROGRESS',
        due_date: null,
        created_at: '2023-01-01T00:00:00Z',
        updated_at: '2023-01-01T00:00:00Z'
      },
      {
        id: 3,
        task_id: taskId,
        title: 'Completed Task',
        description: 'Description 3',
        status: 'COMPLETED',
        due_date: null,
        created_at: '2023-01-01T00:00:00Z',
        updated_at: '2023-01-01T00:00:00Z'
      }
    ];

    vi.mocked(subTaskService.getSubTasksByTaskId).mockResolvedValue(mockSubTasks);

    render(
      <QueryClientProvider client={queryClient}>
        <SubTaskList taskId={taskId} />
      </QueryClientProvider>
    );

    // Wait for the component to finish loading
    await waitFor(() => {
      expect(screen.queryByText('読み込み中...')).not.toBeInTheDocument();
    });

    // Check if all tasks are displayed
    expect(screen.getByText('Pending Task')).toBeInTheDocument();
    expect(screen.getByText('In Progress Task')).toBeInTheDocument();
    expect(screen.getByText('Completed Task')).toBeInTheDocument();

    // Check for status badges (we can't easily check the colors, but we can check the text)
    expect(screen.getByText('未着手')).toBeInTheDocument();
    expect(screen.getByText('進行中')).toBeInTheDocument();
    expect(screen.getByText('完了')).toBeInTheDocument();
  });
});
