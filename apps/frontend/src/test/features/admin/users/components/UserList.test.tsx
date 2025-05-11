import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import UserList from '@/features/admin/users/components/UserList';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// Don't mock the React Query hooks, just use the actual implementation
// This is a simpler approach that works for our basic tests

// Simple test to verify the component renders
describe('UserList Component', () => {
  it('should render the component', () => {
    const queryClient = new QueryClient();

    render(
      <QueryClientProvider client={queryClient}>
        <UserList />
      </QueryClientProvider>
    );

    // Check if the component is defined
    expect(UserList).toBeDefined();
    expect(typeof UserList).toBe('function');

    // Check if the component renders without crashing
    // The component might be in a loading state or showing the table
    const component = screen.queryByTestId('loading') || screen.queryByTestId('user-list') || screen.queryByTestId('user-table');
    expect(component).toBeInTheDocument();
  });
});
