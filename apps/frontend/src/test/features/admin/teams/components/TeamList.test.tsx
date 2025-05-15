import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import TeamList from '@/features/admin/teams/components/TeamList';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { teamService } from '@/features/admin/teams/services';
import { Team } from '@/features/admin/teams/controllers';

// Mock the services
vi.mock('@/features/admin/teams/services', () => ({
  teamService: {
    getTeams: vi.fn(),
    updateTeam: vi.fn(),
    deleteTeam: vi.fn()
  }
}));

// Mock window.confirm
const originalConfirm = window.confirm;
beforeEach(() => {
  window.confirm = vi.fn();
});

afterEach(() => {
  window.confirm = originalConfirm;
});

describe('TeamList Component', () => {
  let queryClient: QueryClient;
  const mockTeams: Team[] = [
    {
      id: 1,
      name: 'Team 1',
      description: 'Description 1',
      created_at: '2023-01-01T00:00:00Z'
    },
    {
      id: 2,
      name: 'Team 2',
      description: null,
      created_at: '2023-01-02T00:00:00Z'
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

    // Mock the invalidateQueries method
    queryClient.invalidateQueries = vi.fn();

    vi.clearAllMocks();
  });

  it('should render loading state', () => {
    vi.mocked(teamService.getTeams).mockReturnValue(new Promise(() => {})); // Never resolves

    render(
      <QueryClientProvider client={queryClient}>
        <TeamList />
      </QueryClientProvider>
    );

    expect(screen.getByText('読み込み中...')).toBeInTheDocument();
  });

  it('should render error state', async () => {
    vi.mocked(teamService.getTeams).mockRejectedValue(new Error('Failed to fetch'));

    render(
      <QueryClientProvider client={queryClient}>
        <TeamList />
      </QueryClientProvider>
    );

    await waitFor(() => {
      expect(screen.getByText('エラーが発生しました')).toBeInTheDocument();
    });
  });

  it('should render teams list', async () => {
    vi.mocked(teamService.getTeams).mockResolvedValue(mockTeams);

    render(
      <QueryClientProvider client={queryClient}>
        <TeamList />
      </QueryClientProvider>
    );

    await waitFor(() => {
      expect(screen.getByText('Team 1')).toBeInTheDocument();
      expect(screen.getByText('Team 2')).toBeInTheDocument();
      expect(screen.getByText('Description 1')).toBeInTheDocument();
      expect(screen.getByText('-')).toBeInTheDocument(); // For null description
    });

    // Check if action buttons are rendered
    expect(screen.getAllByText('編集').length).toBe(2);
    expect(screen.getAllByText('削除').length).toBe(2);
  });

  it('should enter edit mode when edit button is clicked', async () => {
    vi.mocked(teamService.getTeams).mockResolvedValue(mockTeams);

    render(
      <QueryClientProvider client={queryClient}>
        <TeamList />
      </QueryClientProvider>
    );

    await waitFor(() => {
      expect(screen.getByText('Team 1')).toBeInTheDocument();
    });

    // Click edit button for the first team
    const editButtons = screen.getAllByText('編集');
    fireEvent.click(editButtons[0]);

    // Check if edit mode is active
    expect(screen.getByText('保存')).toBeInTheDocument();
    expect(screen.getByText('キャンセル')).toBeInTheDocument();

    // Check if form inputs are populated with team data
    const nameInput = screen.getByDisplayValue('Team 1');
    const descriptionInput = screen.getByDisplayValue('Description 1');
    expect(nameInput).toBeInTheDocument();
    expect(descriptionInput).toBeInTheDocument();
  });

  it('should update form data when inputs change in edit mode', async () => {
    vi.mocked(teamService.getTeams).mockResolvedValue(mockTeams);

    render(
      <QueryClientProvider client={queryClient}>
        <TeamList />
      </QueryClientProvider>
    );

    await waitFor(() => {
      expect(screen.getByText('Team 1')).toBeInTheDocument();
    });

    // Click edit button for the first team
    const editButtons = screen.getAllByText('編集');
    fireEvent.click(editButtons[0]);

    // Get form inputs
    const nameInput = screen.getByDisplayValue('Team 1');
    const descriptionInput = screen.getByDisplayValue('Description 1');

    // Change input values
    fireEvent.change(nameInput, { target: { value: 'Updated Team 1' } });
    fireEvent.change(descriptionInput, { target: { value: 'Updated Description 1' } });

    // Check if input values are updated
    expect(nameInput).toHaveValue('Updated Team 1');
    expect(descriptionInput).toHaveValue('Updated Description 1');
  });

  it('should cancel edit mode when cancel button is clicked', async () => {
    vi.mocked(teamService.getTeams).mockResolvedValue(mockTeams);

    render(
      <QueryClientProvider client={queryClient}>
        <TeamList />
      </QueryClientProvider>
    );

    await waitFor(() => {
      expect(screen.getByText('Team 1')).toBeInTheDocument();
    });

    // Click edit button for the first team
    const editButtons = screen.getAllByText('編集');
    fireEvent.click(editButtons[0]);

    // Get form inputs and change values
    const nameInput = screen.getByDisplayValue('Team 1');
    fireEvent.change(nameInput, { target: { value: 'Updated Team 1' } });

    // Click cancel button
    const cancelButton = screen.getByText('キャンセル');
    fireEvent.click(cancelButton);

    // Check if edit mode is exited
    expect(screen.queryByText('保存')).not.toBeInTheDocument();
    expect(screen.queryByText('キャンセル')).not.toBeInTheDocument();

    // Check if original data is displayed
    expect(screen.getByText('Team 1')).toBeInTheDocument();
    expect(screen.queryByText('Updated Team 1')).not.toBeInTheDocument();
  });

  it('should update team when save button is clicked', async () => {
    vi.mocked(teamService.getTeams).mockResolvedValue(mockTeams);
    vi.mocked(teamService.updateTeam).mockResolvedValue({
      id: 1,
      name: 'Updated Team 1',
      description: 'Updated Description 1',
      created_at: '2023-01-01T00:00:00Z'
    });

    render(
      <QueryClientProvider client={queryClient}>
        <TeamList />
      </QueryClientProvider>
    );

    await waitFor(() => {
      expect(screen.getByText('Team 1')).toBeInTheDocument();
    });

    // Click edit button for the first team
    const editButtons = screen.getAllByText('編集');
    fireEvent.click(editButtons[0]);

    // Get form inputs and change values
    const nameInput = screen.getByDisplayValue('Team 1');
    const descriptionInput = screen.getByDisplayValue('Description 1');
    fireEvent.change(nameInput, { target: { value: 'Updated Team 1' } });
    fireEvent.change(descriptionInput, { target: { value: 'Updated Description 1' } });

    // Click save button
    const saveButton = screen.getByText('保存');
    fireEvent.click(saveButton);

    // Check if updateTeam was called with correct data
    await waitFor(() => {
      expect(teamService.updateTeam).toHaveBeenCalledWith(1, {
        name: 'Updated Team 1',
        description: 'Updated Description 1'
      });
    });

    // Check if invalidateQueries was called
    await waitFor(() => {
      expect(queryClient.invalidateQueries).toHaveBeenCalledWith({ queryKey: ['teams'] });
    });
  });

  it('should handle update team error', async () => {
    vi.mocked(teamService.getTeams).mockResolvedValue(mockTeams);
    vi.mocked(teamService.updateTeam).mockRejectedValue(new Error('Update failed'));

    // Mock console.error to prevent test output pollution
    const originalConsoleError = console.error;
    console.error = vi.fn();

    render(
      <QueryClientProvider client={queryClient}>
        <TeamList />
      </QueryClientProvider>
    );

    await waitFor(() => {
      expect(screen.getByText('Team 1')).toBeInTheDocument();
    });

    // Click edit button for the first team
    const editButtons = screen.getAllByText('編集');
    fireEvent.click(editButtons[0]);

    // Click save button without changing values
    const saveButton = screen.getByText('保存');
    fireEvent.click(saveButton);

    // Check if console.error was called
    await waitFor(() => {
      expect(console.error).toHaveBeenCalledWith('Error updating team:', expect.any(Error));
    });

    // Restore console.error
    console.error = originalConsoleError;
  });

  it('should delete team when delete button is clicked and confirmed', async () => {
    vi.mocked(teamService.getTeams).mockResolvedValue(mockTeams);
    vi.mocked(teamService.deleteTeam).mockResolvedValue(undefined);
    vi.mocked(window.confirm).mockReturnValue(true);

    render(
      <QueryClientProvider client={queryClient}>
        <TeamList />
      </QueryClientProvider>
    );

    await waitFor(() => {
      expect(screen.getByText('Team 1')).toBeInTheDocument();
    });

    // Click delete button for the first team
    const deleteButtons = screen.getAllByText('削除');
    fireEvent.click(deleteButtons[0]);

    // Check if confirm was called
    expect(window.confirm).toHaveBeenCalledWith('このチームを削除してもよろしいですか？');

    // Check if deleteTeam was called with correct id
    await waitFor(() => {
      expect(teamService.deleteTeam).toHaveBeenCalledWith(1);
    });

    // Check if invalidateQueries was called
    await waitFor(() => {
      expect(queryClient.invalidateQueries).toHaveBeenCalledWith({ queryKey: ['teams'] });
    });
  });

  it('should not delete team when delete is not confirmed', async () => {
    vi.mocked(teamService.getTeams).mockResolvedValue(mockTeams);
    vi.mocked(window.confirm).mockReturnValue(false);

    render(
      <QueryClientProvider client={queryClient}>
        <TeamList />
      </QueryClientProvider>
    );

    await waitFor(() => {
      expect(screen.getByText('Team 1')).toBeInTheDocument();
    });

    // Click delete button for the first team
    const deleteButtons = screen.getAllByText('削除');
    fireEvent.click(deleteButtons[0]);

    // Check if confirm was called
    expect(window.confirm).toHaveBeenCalledWith('このチームを削除してもよろしいですか？');

    // Check if deleteTeam was not called
    expect(teamService.deleteTeam).not.toHaveBeenCalled();
  });

  it('should handle delete team error', async () => {
    vi.mocked(teamService.getTeams).mockResolvedValue(mockTeams);
    vi.mocked(teamService.deleteTeam).mockRejectedValue(new Error('Delete failed'));
    vi.mocked(window.confirm).mockReturnValue(true);

    // Mock console.error to prevent test output pollution
    const originalConsoleError = console.error;
    console.error = vi.fn();

    render(
      <QueryClientProvider client={queryClient}>
        <TeamList />
      </QueryClientProvider>
    );

    await waitFor(() => {
      expect(screen.getByText('Team 1')).toBeInTheDocument();
    });

    // Click delete button for the first team
    const deleteButtons = screen.getAllByText('削除');
    fireEvent.click(deleteButtons[0]);

    // Check if console.error was called
    await waitFor(() => {
      expect(console.error).toHaveBeenCalledWith('Error deleting team:', expect.any(Error));
    });

    // Restore console.error
    console.error = originalConsoleError;
  });
});
