import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import AccountOrders from '@/features/user/account/components/AccountOrders';

// Mock the react-icons
vi.mock('react-icons/ri', () => ({
  RiEyeLine: () => <div data-testid="icon-eye" />,
  RiFileDownloadLine: () => <div data-testid="icon-download" />,
}));

describe('AccountOrders Component', () => {
  it('should render the component with heading', () => {
    render(<AccountOrders />);
    
    // Check if the component renders without crashing
    expect(screen.getByText('注文履歴')).toBeInTheDocument();
  });

  it('should render the table headers', () => {
    render(<AccountOrders />);
    
    // Check if all table headers are rendered
    expect(screen.getByText('注文番号')).toBeInTheDocument();
    expect(screen.getByText('注文日')).toBeInTheDocument();
    expect(screen.getByText('ステータス')).toBeInTheDocument();
    expect(screen.getByText('商品数')).toBeInTheDocument();
    expect(screen.getByText('合計')).toBeInTheDocument();
    expect(screen.getByText('アクション')).toBeInTheDocument();
  });

  it('should render all mock orders', () => {
    render(<AccountOrders />);
    
    // Check if all order IDs are rendered
    expect(screen.getByText('ORD-2023-0001')).toBeInTheDocument();
    expect(screen.getByText('ORD-2023-0002')).toBeInTheDocument();
    expect(screen.getByText('ORD-2023-0003')).toBeInTheDocument();
    
    // Check if all order dates are rendered
    expect(screen.getByText('2023年12月15日')).toBeInTheDocument();
    expect(screen.getByText('2023年11月28日')).toBeInTheDocument();
    expect(screen.getByText('2023年10月10日')).toBeInTheDocument();
    
    // Check if all order statuses are rendered
    const statuses = screen.getAllByText('配送済み');
    expect(statuses.length).toBe(3);
    
    // Check if all order item counts are rendered
    expect(screen.getByText('3点')).toBeInTheDocument();
    expect(screen.getByText('2点')).toBeInTheDocument();
    expect(screen.getByText('1点')).toBeInTheDocument();
    
    // Check if all order totals are rendered
    expect(screen.getByText('¥32,800')).toBeInTheDocument();
    expect(screen.getByText('¥15,600')).toBeInTheDocument();
    expect(screen.getByText('¥9,800')).toBeInTheDocument();
  });

  it('should render action buttons for each order', () => {
    render(<AccountOrders />);
    
    // Check if all view and download icons are rendered
    const viewIcons = screen.getAllByTestId('icon-eye');
    const downloadIcons = screen.getAllByTestId('icon-download');
    
    expect(viewIcons.length).toBe(3);
    expect(downloadIcons.length).toBe(3);
  });

  it('should not show the empty state message when there are orders', () => {
    render(<AccountOrders />);
    
    // Check if the empty state message is not rendered
    expect(screen.queryByText('注文履歴がありません。')).not.toBeInTheDocument();
  });

  it('should have the correct styling for the status badges', () => {
    render(<AccountOrders />);
    
    // Check if the status badges have the correct classes
    const statusBadges = screen.getAllByText('配送済み');
    statusBadges.forEach(badge => {
      expect(badge).toHaveClass('bg-green-100');
      expect(badge).toHaveClass('text-green-800');
      expect(badge).toHaveClass('rounded-full');
    });
  });
});