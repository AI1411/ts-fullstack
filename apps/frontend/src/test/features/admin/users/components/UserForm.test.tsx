import UserForm from '@/features/admin/users/components/UserForm';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

// Simple test to verify the component renders
describe('UserForm Component', () => {
  it('should render the component', () => {
    const queryClient = new QueryClient();

    render(
      <QueryClientProvider client={queryClient}>
        <UserForm />
      </QueryClientProvider>
    );

    // Check if the component is defined
    expect(UserForm).toBeDefined();
    expect(typeof UserForm).toBe('function');

    // Check if the component renders without crashing
    const heading = screen.getByRole('heading', { name: 'ユーザーを追加' });
    expect(heading).toBeInTheDocument();
  });
});
