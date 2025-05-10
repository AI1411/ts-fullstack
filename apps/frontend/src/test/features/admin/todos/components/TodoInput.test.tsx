import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import TodoInput from '@/features/admin/todos/components/TodoInput';
import { todoService } from '@/features/admin/todos/services';

// Mock the todoService
vi.mock('@/features/admin/todos/services', () => ({
  todoService: {
    createTodo: vi.fn()
  }
}));

// Mock React Query
vi.mock('@tanstack/react-query', () => ({
  useQueryClient: () => ({
    invalidateQueries: vi.fn()
  })
}));

// Mock React's useActionState
vi.mock('react', async () => {
  const actual = await vi.importActual('react');
  return {
    ...actual,
    useActionState: (action) => {
      const [error, setError] = actual.useState(null);
      const [isPending, setIsPending] = actual.useState(false);

      const submitAction = async (formData) => {
        setIsPending(true);
        try {
          const result = await action(error, formData);
          setError(result);
        } finally {
          setIsPending(false);
        }
        return null;
      };

      return [error, submitAction, isPending];
    }
  };
});

describe('TodoInput Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(todoService.createTodo).mockResolvedValue({
      id: 1,
      title: 'Test Todo',
      description: 'Test Description',
      user_id: null,
      status: 'PENDING',
      created_at: '2023-01-01T00:00:00.000Z',
      updated_at: '2023-01-01T00:00:00.000Z'
    });
  });

  it('renders the form correctly', () => {
    render(<TodoInput />);

    // Check if form elements are rendered
    expect(screen.getByText('Title')).toBeInTheDocument();
    expect(screen.getByText('Description')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Submit' })).toBeInTheDocument();
  });

  it('submits the form with correct data', async () => {
    const user = userEvent.setup();
    render(<TodoInput />);

    // Fill out the form - find inputs by their name attribute
    const titleInput = screen.getByText('Title').nextElementSibling;
    const descriptionInput = screen.getByText('Description').nextElementSibling;

    await user.type(titleInput, 'Test Todo');
    await user.type(descriptionInput, 'Test Description');

    // Submit the form
    await user.click(screen.getByRole('button', { name: 'Submit' }));

    // Check if createTodo was called with the correct data
    await waitFor(() => {
      expect(todoService.createTodo).toHaveBeenCalledWith({
        title: 'Test Todo',
        description: 'Test Description'
      });
    });
  });

  it('displays error message when submission fails', async () => {
    // Mock createTodo to throw an error
    vi.mocked(todoService.createTodo).mockRejectedValue(new Error('An error occurred'));

    const user = userEvent.setup();
    render(<TodoInput />);

    // Fill out the form
    const titleInput = screen.getByText('Title').nextElementSibling;
    await user.type(titleInput, 'Test Todo');

    // Submit the form
    await user.click(screen.getByRole('button', { name: 'Submit' }));

    // Check if error message is displayed
    await waitFor(() => {
      expect(screen.getByText('An error occurred')).toBeInTheDocument();
    });
  });
});
