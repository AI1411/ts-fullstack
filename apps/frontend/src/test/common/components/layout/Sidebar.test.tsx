import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import Sidebar from '@/common/components/layout/Sidebar';

// Simple test to verify the component renders
describe('Sidebar Component', () => {
  it('should render the component', () => {
    const mockSetSidebarOpen = vi.fn();
    render(<Sidebar sidebarOpen={true} setSidebarOpen={mockSetSidebarOpen} />);

    // Check if the component is defined
    expect(Sidebar).toBeDefined();
    expect(typeof Sidebar).toBe('function');

    // Check if the component renders without crashing
    const sidebar = screen.getByRole('complementary');
    expect(sidebar).toBeInTheDocument();
  });
});
