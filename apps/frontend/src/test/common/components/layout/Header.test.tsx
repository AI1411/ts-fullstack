import Header from '@/common/components/layout/Header';
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

// Simple test to verify the component renders
describe('Header Component', () => {
  it('should render the component', () => {
    const mockSetSidebarOpen = vi.fn();
    render(<Header sidebarOpen={false} setSidebarOpen={mockSetSidebarOpen} />);

    // Check if the component is defined
    expect(Header).toBeDefined();
    expect(typeof Header).toBe('function');

    // Check if the component renders without crashing
    const header = screen.getByRole('banner');
    expect(header).toBeInTheDocument();
  });
});
