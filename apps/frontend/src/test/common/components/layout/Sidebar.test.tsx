import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import Sidebar from '@/common/components/layout/Sidebar';

// Mock Next.js hooks
vi.mock('next/navigation', () => ({
  usePathname: vi.fn(() => '/admin')
}));

// Mock Next.js Link component
vi.mock('next/link', () => {
  return {
    __esModule: true,
    default: ({ href, children, className }: { href: string; children: React.ReactNode; className?: string }) => {
      return (
        <a href={href} className={className}>
          {children}
        </a>
      );
    }
  };
});

describe('Sidebar Component', () => {
  it('renders without crashing', () => {
    const mockSetSidebarOpen = vi.fn();
    render(<Sidebar sidebarOpen={true} setSidebarOpen={mockSetSidebarOpen} />);
    
    // Check if the sidebar is rendered
    expect(screen.getByRole('complementary')).toBeInTheDocument();
  });
  
  it('displays all navigation links', () => {
    const mockSetSidebarOpen = vi.fn();
    render(<Sidebar sidebarOpen={true} setSidebarOpen={mockSetSidebarOpen} />);
    
    // Check if all menu items are rendered
    expect(screen.getByText('ダッシュボード')).toBeInTheDocument();
    expect(screen.getByText('商品管理')).toBeInTheDocument();
    expect(screen.getByText('注文管理')).toBeInTheDocument();
    expect(screen.getByText('Todo管理')).toBeInTheDocument();
    expect(screen.getByText('ユーザー管理')).toBeInTheDocument();
    expect(screen.getByText('タスク管理')).toBeInTheDocument();
    expect(screen.getByText('チーム管理')).toBeInTheDocument();
    expect(screen.getByText('通知管理')).toBeInTheDocument();
    expect(screen.getByText('チャット管理')).toBeInTheDocument();
    expect(screen.getByText('トップページに戻る')).toBeInTheDocument();
  });
  
  it('has correct links for navigation items', () => {
    const mockSetSidebarOpen = vi.fn();
    render(<Sidebar sidebarOpen={true} setSidebarOpen={mockSetSidebarOpen} />);
    
    // Check if links have correct href attributes
    expect(screen.getByText('ダッシュボード').closest('a')).toHaveAttribute('href', '/admin');
    expect(screen.getByText('商品管理').closest('a')).toHaveAttribute('href', '/admin/products');
    expect(screen.getByText('Todo管理').closest('a')).toHaveAttribute('href', '/admin/todos');
    expect(screen.getByText('ユーザー管理').closest('a')).toHaveAttribute('href', '/admin/users');
    expect(screen.getByText('トップページに戻る').closest('a')).toHaveAttribute('href', '/');
  });
});