import TodoForm from '@/features/admin/todos/components/TodoForm';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

// Don't mock the React Query hooks, just use the actual implementation
// This is a simpler approach that works for our basic tests

// Simple test to verify the component renders
describe('TodoForm Component', () => {
  it('should render the component', () => {
    const queryClient = new QueryClient();

    render(
      <QueryClientProvider client={queryClient}>
        <TodoForm />
      </QueryClientProvider>
    );

    // Check if the component is defined
    expect(TodoForm).toBeDefined();
    expect(typeof TodoForm).toBe('function');

    // Check if the component renders without crashing
    const heading = screen.getByRole('heading', { name: 'Todoを追加' });
    expect(heading).toBeInTheDocument();
  });
});
