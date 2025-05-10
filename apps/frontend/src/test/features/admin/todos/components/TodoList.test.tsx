import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import TodoList from '@/features/admin/todos/components/TodoList';
import { todoService } from '@/features/admin/todos/services';

// Mock the todoService
vi.mock('@/features/admin/todos/services', () => ({
  todoService: {
    getTodos: vi.fn()
  }
}));

// Mock the React Query provider
vi.mock('@tanstack/react-query', () => ({
  useQuery: () => {
    return {
      data: [
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
      ],
      isLoading: false,
      error: null
    };
  }
}));

describe('TodoList Component', () => {
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
  });

  it('renders todos correctly', async () => {
    render(<TodoList />);

    // Check if the todos are rendered
    expect(screen.getByText('Test Todo 1')).toBeInTheDocument();
    expect(screen.getByText('This is a test todo')).toBeInTheDocument();
    expect(screen.getByText('Test Todo 2')).toBeInTheDocument();
  });

  it('does not render description when it is null', () => {
    render(<TodoList />);

    // The second todo has a null description, so it shouldn't be rendered
    const todo1Description = screen.getByText('This is a test todo');
    expect(todo1Description).toBeInTheDocument();

    // There should only be one description element
    const descriptions = screen.getAllByText(/This is a test todo/i);
    expect(descriptions.length).toBe(1);
  });
});
