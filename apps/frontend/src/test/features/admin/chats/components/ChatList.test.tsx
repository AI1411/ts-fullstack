import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import ChatList from '@/features/admin/chats/components/ChatList';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// Don't mock the React Query hooks, just use the actual implementation
// This is a simpler approach that works for our basic tests

// Simple test to verify the component renders
describe('ChatList Component', () => {
  it('should render the component', () => {
    const queryClient = new QueryClient();

    render(
      <QueryClientProvider client={queryClient}>
        <ChatList />
      </QueryClientProvider>
    );

    // Check if the component is defined
    expect(ChatList).toBeDefined();
    expect(typeof ChatList).toBe('function');

    // Check if the component renders without crashing
    // The component might be in a loading state or showing the chat list
    const component = screen.queryByTestId('loading') || screen.queryByTestId('chat-list') || screen.queryByTestId('search-input');
    expect(component).toBeInTheDocument();
  });
});
