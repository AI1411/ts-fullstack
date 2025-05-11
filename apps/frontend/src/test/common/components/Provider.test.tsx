import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import Provider from '@/common/components/Provider';

// Simple test to verify the component renders
describe('Provider Component', () => {
  it('should render the component', () => {
    render(
      <Provider>
        <div>Test Child</div>
      </Provider>
    );

    // Check if the component is defined
    expect(Provider).toBeDefined();
    expect(typeof Provider).toBe('function');

    // Check if the component renders without crashing
    const child = screen.getByText('Test Child');
    expect(child).toBeInTheDocument();
  });
});
