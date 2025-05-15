import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import TeamForm from '@/features/admin/teams/components/TeamForm';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { teamService } from '@/features/admin/teams/services';

// Mock the services
vi.mock('@/features/admin/teams/services', () => ({
  teamService: {
    createTeam: vi.fn()
  }
}));

describe('TeamForm Component', () => {
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
    render(
      <QueryClientProvider client={queryClient}>
        <TeamForm />
      </QueryClientProvider>
    );

    // Check if the component is defined
    expect(TeamForm).toBeDefined();
    expect(typeof TeamForm).toBe('function');

    // Check if form elements are rendered
    expect(screen.getByRole('heading', { name: 'チームを追加' })).toBeInTheDocument();
    expect(screen.getByLabelText(/チーム名/)).toBeInTheDocument();
    expect(screen.getByLabelText(/説明/)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'チームを追加' })).toBeInTheDocument();
  });

  it('should update form data when inputs change', () => {
    render(
      <QueryClientProvider client={queryClient}>
        <TeamForm />
      </QueryClientProvider>
    );

    // Get form inputs
    const nameInput = screen.getByLabelText(/チーム名/);
    const descriptionInput = screen.getByLabelText(/説明/);

    // Change input values
    fireEvent.change(nameInput, { target: { value: 'Test Team' } });
    fireEvent.change(descriptionInput, { target: { value: 'Test Description' } });

    // Check if input values are updated
    expect(nameInput).toHaveValue('Test Team');
    expect(descriptionInput).toHaveValue('Test Description');
  });

  it('should submit the form with correct data', async () => {
    // Mock successful team creation
    vi.mocked(teamService.createTeam).mockResolvedValue({
      id: 1,
      name: 'Test Team',
      description: 'Test Description',
      created_at: '2023-01-01T00:00:00Z'
    });

    render(
      <QueryClientProvider client={queryClient}>
        <TeamForm />
      </QueryClientProvider>
    );

    // Fill form data
    const nameInput = screen.getByLabelText(/チーム名/);
    const descriptionInput = screen.getByLabelText(/説明/);
    fireEvent.change(nameInput, { target: { value: 'Test Team' } });
    fireEvent.change(descriptionInput, { target: { value: 'Test Description' } });

    // Submit the form
    const submitButton = screen.getByRole('button', { name: 'チームを追加' });
    fireEvent.click(submitButton);

    // Check if createTeam was called with correct data
    await waitFor(() => {
      expect(teamService.createTeam).toHaveBeenCalledWith({
        name: 'Test Team',
        description: 'Test Description'
      });
    });

    // Form should be reset after successful submission
    await waitFor(() => {
      expect(nameInput).toHaveValue('');
      expect(descriptionInput).toHaveValue('');
    });
  });

  it('should show error message when team creation fails', async () => {
    // Mock failed team creation
    vi.mocked(teamService.createTeam).mockRejectedValue(new Error('API error'));

    render(
      <QueryClientProvider client={queryClient}>
        <TeamForm />
      </QueryClientProvider>
    );

    // Fill form data
    const nameInput = screen.getByLabelText(/チーム名/);
    const descriptionInput = screen.getByLabelText(/説明/);
    fireEvent.change(nameInput, { target: { value: 'Test Team' } });
    fireEvent.change(descriptionInput, { target: { value: 'Test Description' } });

    // Submit the form
    const submitButton = screen.getByRole('button', { name: 'チームを追加' });
    fireEvent.click(submitButton);

    // Check if error message is displayed
    await waitFor(() => {
      expect(screen.getByText('API error')).toBeInTheDocument();
    });

    // Form should not be reset
    expect(nameInput).toHaveValue('Test Team');
    expect(descriptionInput).toHaveValue('Test Description');
  });

  it('should disable submit button while submitting', async () => {
    // Mock a delayed response to ensure we see the submitting state
    vi.mocked(teamService.createTeam).mockImplementation(
      () => new Promise(resolve => setTimeout(() => resolve({
        id: 1,
        name: 'Test Team',
        description: 'Test Description',
        created_at: '2023-01-01T00:00:00Z'
      }), 100))
    );

    render(
      <QueryClientProvider client={queryClient}>
        <TeamForm />
      </QueryClientProvider>
    );

    // Fill form data
    const nameInput = screen.getByLabelText(/チーム名/);
    const descriptionInput = screen.getByLabelText(/説明/);
    fireEvent.change(nameInput, { target: { value: 'Test Team' } });
    fireEvent.change(descriptionInput, { target: { value: 'Test Description' } });

    // Submit the form
    const submitButton = screen.getByRole('button', { name: 'チームを追加' });
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
    expect(screen.getByRole('button', { name: 'チームを追加' })).toBeEnabled();
  });

  it('should validate required fields', async () => {
    render(
      <QueryClientProvider client={queryClient}>
        <TeamForm />
      </QueryClientProvider>
    );

    // Submit the form without filling required fields
    const submitButton = screen.getByRole('button', { name: 'チームを追加' });
    fireEvent.click(submitButton);

    // Verify createTeam was not called, indicating validation prevented submission
    await waitFor(() => {
      expect(teamService.createTeam).not.toHaveBeenCalled();
    });
  });
});
