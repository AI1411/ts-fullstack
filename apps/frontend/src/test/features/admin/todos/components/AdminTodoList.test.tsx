import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import AdminTodoList from '@/features/admin/todos/components/AdminTodoList';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// Don't mock the React Query hooks, just use the actual implementation
// This is a simpler approach that works for our basic tests

// Simple test to verify the component renders
describe('AdminTodoList Component', () => {
  it('should render the component', () => {
    const queryClient = new QueryClient();

    render(
      <QueryClientProvider client={queryClient}>
        <AdminTodoList />
      </QueryClientProvider>
    );

    // Check if the component is defined
    expect(AdminTodoList).toBeDefined();
    expect(typeof AdminTodoList).toBe('function');

    // Check if the component renders without crashing
    // The component might be in a loading state or showing the table
    const component = screen.queryByTestId('loading') || screen.queryByTestId('admin-todo-list') || screen.queryByTestId('admin-todo-table');
    expect(component).toBeInTheDocument();
  });
});
