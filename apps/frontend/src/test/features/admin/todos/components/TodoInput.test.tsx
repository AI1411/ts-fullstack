import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import TodoInput from '@/features/admin/todos/components/TodoInput';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// Don't mock React hooks, just use the actual implementation
// This is a simpler approach that works for our basic tests

// Simple test to verify the component renders
describe('TodoInput Component', () => {
  it('should render the component', () => {
    const queryClient = new QueryClient();

    render(
      <QueryClientProvider client={queryClient}>
        <TodoInput />
      </QueryClientProvider>
    );

    // Check if the component is defined
    expect(TodoInput).toBeDefined();
    expect(typeof TodoInput).toBe('function');

    // Check if the component renders without crashing
    const titleLabel = screen.getByText('Title');
    expect(titleLabel).toBeInTheDocument();
  });
});
