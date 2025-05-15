import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import SubTaskForm from '@/features/admin/sub-tasks/components/SubTaskForm';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { subTaskService } from '@/features/admin/sub-tasks/services';

// Mock the sub-task service
vi.mock('@/features/admin/sub-tasks/services', () => ({
  subTaskService: {
    createSubTask: vi.fn()
  }
}));

describe('SubTaskForm Component', () => {
  let queryClient: QueryClient;
  const taskId = 1;
  const onCancel = vi.fn();

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
    render(
      <QueryClientProvider client={queryClient}>
        <SubTaskForm taskId={taskId} />
      </QueryClientProvider>
    );

    // Check if the component is defined
    expect(SubTaskForm).toBeDefined();
    expect(typeof SubTaskForm).toBe('function');

    // Check if form elements are rendered
    expect(screen.getByPlaceholderText('タイトル')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('説明')).toBeInTheDocument();
    expect(screen.getByText('追加')).toBeInTheDocument();
  });

  it('should render cancel button when onCancel prop is provided', () => {
    render(
      <QueryClientProvider client={queryClient}>
        <SubTaskForm taskId={taskId} onCancel={onCancel} />
      </QueryClientProvider>
    );

    expect(screen.getByText('キャンセル')).toBeInTheDocument();
  });

  it('should not render cancel button when onCancel prop is not provided', () => {
    render(
      <QueryClientProvider client={queryClient}>
        <SubTaskForm taskId={taskId} />
      </QueryClientProvider>
    );

    expect(screen.queryByText('キャンセル')).not.toBeInTheDocument();
  });

  it('should update form values when inputs change', () => {
    render(
      <QueryClientProvider client={queryClient}>
        <SubTaskForm taskId={taskId} />
      </QueryClientProvider>
    );

    // Get form inputs
    const titleInput = screen.getByPlaceholderText('タイトル');
    const descriptionInput = screen.getByPlaceholderText('説明');
    const statusSelect = screen.getByRole('combobox');
    const dueDateInput = document.getElementById('due_date'); // Date input

    // Change input values
    fireEvent.change(titleInput, { target: { value: 'Test Title' } });
    fireEvent.change(descriptionInput, { target: { value: 'Test Description' } });
    fireEvent.change(statusSelect, { target: { value: 'IN_PROGRESS' } });
    fireEvent.change(dueDateInput, { target: { value: '2023-01-01' } });

    // Check if values are updated
    expect(titleInput).toHaveValue('Test Title');
    expect(descriptionInput).toHaveValue('Test Description');
    expect(statusSelect).toHaveValue('IN_PROGRESS');
    expect(dueDateInput).toHaveValue('2023-01-01');
  });

  it('should submit the form with correct data', async () => {
    // Mock successful response
    vi.mocked(subTaskService.createSubTask).mockResolvedValue({
      id: 1,
      task_id: taskId,
      title: 'Test Title',
      description: 'Test Description',
      status: 'IN_PROGRESS',
      due_date: '2023-01-01',
      created_at: '2023-01-01T00:00:00Z',
      updated_at: '2023-01-01T00:00:00Z'
    });

    render(
      <QueryClientProvider client={queryClient}>
        <SubTaskForm taskId={taskId} />
      </QueryClientProvider>
    );

    // Get form inputs
    const titleInput = screen.getByPlaceholderText('タイトル');
    const descriptionInput = screen.getByPlaceholderText('説明');
    const statusSelect = screen.getByRole('combobox');
    const dueDateInput = document.getElementById('due_date'); // Date input
    const submitButton = screen.getByText('追加');

    // Change input values
    fireEvent.change(titleInput, { target: { value: 'Test Title' } });
    fireEvent.change(descriptionInput, { target: { value: 'Test Description' } });
    fireEvent.change(statusSelect, { target: { value: 'IN_PROGRESS' } });
    fireEvent.change(dueDateInput, { target: { value: '2023-01-01' } });

    // Submit the form
    fireEvent.click(submitButton);

    // Verify createSubTask was called with correct data
    await waitFor(() => {
      expect(subTaskService.createSubTask).toHaveBeenCalledWith({
        title: 'Test Title',
        description: 'Test Description',
        status: 'IN_PROGRESS',
        due_date: '2023-01-01',
        task_id: taskId
      });
    });

    // Check if form was reset
    await waitFor(() => {
      expect(titleInput).toHaveValue('');
      expect(descriptionInput).toHaveValue('');
      expect(statusSelect).toHaveValue('PENDING');
      expect(dueDateInput).toHaveValue('');
    });
  });

  it('should call onCancel when cancel button is clicked', () => {
    render(
      <QueryClientProvider client={queryClient}>
        <SubTaskForm taskId={taskId} onCancel={onCancel} />
      </QueryClientProvider>
    );

    // Click cancel button
    const cancelButton = screen.getByText('キャンセル');
    fireEvent.click(cancelButton);

    // Verify onCancel was called
    expect(onCancel).toHaveBeenCalledTimes(1);
  });

  it('should call onCancel after successful submission when provided', async () => {
    // Mock successful response
    vi.mocked(subTaskService.createSubTask).mockResolvedValue({
      id: 1,
      task_id: taskId,
      title: 'Test Title',
      description: 'Test Description',
      status: 'IN_PROGRESS',
      due_date: '2023-01-01',
      created_at: '2023-01-01T00:00:00Z',
      updated_at: '2023-01-01T00:00:00Z'
    });

    render(
      <QueryClientProvider client={queryClient}>
        <SubTaskForm taskId={taskId} onCancel={onCancel} />
      </QueryClientProvider>
    );

    // Get form inputs
    const titleInput = screen.getByPlaceholderText('タイトル');
    const submitButton = screen.getByText('追加');

    // Change input values (only title is required)
    fireEvent.change(titleInput, { target: { value: 'Test Title' } });

    // Submit the form
    fireEvent.click(submitButton);

    // Verify onCancel was called after successful submission
    await waitFor(() => {
      expect(onCancel).toHaveBeenCalledTimes(1);
    });
  });

  it('should show error message when API call fails', async () => {
    // Mock failed response
    vi.mocked(subTaskService.createSubTask).mockRejectedValue(new Error('API error'));

    render(
      <QueryClientProvider client={queryClient}>
        <SubTaskForm taskId={taskId} />
      </QueryClientProvider>
    );

    // Get form inputs
    const titleInput = screen.getByPlaceholderText('タイトル');
    const submitButton = screen.getByText('追加');

    // Change input values (only title is required)
    fireEvent.change(titleInput, { target: { value: 'Test Title' } });

    // Submit the form
    fireEvent.click(submitButton);

    // Verify error message is displayed
    await waitFor(() => {
      const errorElement = screen.getByText((content) => 
        content.includes('API error')
      );
      expect(errorElement).toBeInTheDocument();
    });
  });

  it('should show generic error message when API error has no message', async () => {
    // Mock failed response with a non-Error object
    vi.mocked(subTaskService.createSubTask).mockRejectedValue('Some error');

    render(
      <QueryClientProvider client={queryClient}>
        <SubTaskForm taskId={taskId} />
      </QueryClientProvider>
    );

    // Get form inputs
    const titleInput = screen.getByPlaceholderText('タイトル');
    const submitButton = screen.getByText('追加');

    // Change input values (only title is required)
    fireEvent.change(titleInput, { target: { value: 'Test Title' } });

    // Submit the form
    fireEvent.click(submitButton);

    // Verify error message is displayed
    await waitFor(() => {
      const errorElement = screen.getByText((content) => 
        content.includes('サブタスクの追加に失敗しました')
      );
      expect(errorElement).toBeInTheDocument();
    });
  });

  it('should show loading state during submission', async () => {
    // Mock delayed response to ensure we see the loading state
    vi.mocked(subTaskService.createSubTask).mockImplementation(
      () => new Promise(resolve => setTimeout(() => resolve({
        id: 1,
        task_id: taskId,
        title: 'Test Title',
        description: '',
        status: 'PENDING',
        due_date: null,
        created_at: '2023-01-01T00:00:00Z',
        updated_at: '2023-01-01T00:00:00Z'
      }), 100))
    );

    render(
      <QueryClientProvider client={queryClient}>
        <SubTaskForm taskId={taskId} />
      </QueryClientProvider>
    );

    // Get form inputs
    const titleInput = screen.getByPlaceholderText('タイトル');
    const submitButton = screen.getByText('追加');

    // Change input values (only title is required)
    fireEvent.change(titleInput, { target: { value: 'Test Title' } });

    // Submit the form
    fireEvent.click(submitButton);

    // Verify loading state is shown
    expect(screen.getByText('送信中...')).toBeInTheDocument();
    expect(submitButton).toBeDisabled();

    // Wait for submission to complete
    await waitFor(() => {
      expect(screen.queryByText('送信中...')).not.toBeInTheDocument();
    });
  });

  it('should validate required fields', async () => {
    render(
      <QueryClientProvider client={queryClient}>
        <SubTaskForm taskId={taskId} />
      </QueryClientProvider>
    );

    // Get submit button
    const submitButton = screen.getByText('追加');

    // Submit the form without filling required fields
    fireEvent.click(submitButton);

    // Verify createSubTask was not called
    expect(subTaskService.createSubTask).not.toHaveBeenCalled();
  });
});
