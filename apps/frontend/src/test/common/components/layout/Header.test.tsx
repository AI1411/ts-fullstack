import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import Header from '@/common/components/layout/Header';

// Mock Next.js hooks
vi.mock('next/navigation', () => ({
  usePathname: vi.fn(() => '/admin')
}));

// Mock localStorage
vi.mock('localStorage', () => ({
  getItem: vi.fn(),
  setItem: vi.fn()
}), { virtual: true });

// Mock document methods
document.documentElement.classList = {
  add: vi.fn(),
  remove: vi.fn()
} as any;

describe('Header Component', () => {
  it('renders without crashing', () => {
    const mockSetSidebarOpen = vi.fn();
    render(<Header sidebarOpen={false} setSidebarOpen={mockSetSidebarOpen} />);

    // Just check if the component renders without errors
    expect(screen.getByRole('banner')).toBeInTheDocument();
  });
});
