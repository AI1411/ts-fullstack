import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import Provider from '@/common/components/Provider';

// Mock React Query
vi.mock('@tanstack/react-query', () => {
  const QueryClient = vi.fn();
  const QueryClientProvider = ({ children }: { children: React.ReactNode }) => <div data-testid="query-provider">{children}</div>;
  
  return {
    QueryClient,
    QueryClientProvider
  };
});

describe('Provider Component', () => {
  it('renders without crashing', () => {
    render(
      <Provider>
        <div>Test Child</div>
      </Provider>
    );
    
    // Check if the provider renders its children
    expect(screen.getByText('Test Child')).toBeInTheDocument();
  });
  
  it('wraps children in QueryClientProvider', () => {
    render(
      <Provider>
        <div>Test Child</div>
      </Provider>
    );
    
    // Check if the QueryClientProvider is used
    expect(screen.getByTestId('query-provider')).toBeInTheDocument();
    
    // Check if the children are rendered inside the provider
    const queryProvider = screen.getByTestId('query-provider');
    expect(queryProvider.textContent).toBe('Test Child');
  });
});