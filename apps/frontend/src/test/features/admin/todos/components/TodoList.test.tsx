import TodoList from '@/features/admin/todos/components/TodoList';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

// Don't mock the React Query hooks, just use the actual implementation
// This is a simpler approach that works for our basic tests

// Simple test to verify the component renders
describe('TodoList Component', () => {
  it('should render the component', () => {
    const queryClient = new QueryClient();

    render(
      <QueryClientProvider client={queryClient}>
        <TodoList />
      </QueryClientProvider>
    );

    // Check if the component is defined
    expect(TodoList).toBeDefined();
    expect(typeof TodoList).toBe('function');

    // Check if the component renders without crashing
    const component = screen.getByTestId('todo-list');
    expect(component).toBeInTheDocument();
  });
});
