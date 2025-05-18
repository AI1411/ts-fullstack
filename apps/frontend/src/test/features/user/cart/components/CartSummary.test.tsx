import CartSummary from '@/features/user/cart/components/CartSummary';
import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

// Mock Next.js Link component
vi.mock('next/link', () => ({
  default: ({
    children,
    href,
  }: { children: React.ReactNode; href: string }) => (
    <a href={href} data-testid="continue-shopping-link">
      {children}
    </a>
  ),
}));

describe('CartSummary Component', () => {
  const mockProps = {
    subtotal: 59600,
    tax: 5960,
    shipping: 800,
    total: 66360,
  };

  it('should render the component with correct values', () => {
    render(<CartSummary {...mockProps} />);

    // Check if the component renders without crashing
    expect(screen.getByText('注文サマリー')).toBeInTheDocument();

    // Check if the values are displayed correctly
    expect(screen.getByText('¥59,600')).toBeInTheDocument();
    expect(screen.getByText('¥5,960')).toBeInTheDocument();
    expect(screen.getByText('¥800')).toBeInTheDocument();
    expect(screen.getByText('¥66,360')).toBeInTheDocument();
  });

  it('should render the checkout button', () => {
    render(<CartSummary {...mockProps} />);

    // Check if the checkout button is rendered
    const checkoutButton = screen.getByText('レジに進む');
    expect(checkoutButton).toBeInTheDocument();
    expect(checkoutButton.tagName).toBe('BUTTON');
  });

  it('should render the continue shopping link', () => {
    render(<CartSummary {...mockProps} />);

    // Check if the continue shopping link is rendered
    const continueShoppingLink = screen.getByText('買い物を続ける');
    expect(continueShoppingLink).toBeInTheDocument();

    // Check if the link has the correct href
    const linkElement = screen.getByTestId('continue-shopping-link');
    expect(linkElement).toHaveAttribute('href', '/');
  });

  it('should handle zero values correctly', () => {
    const zeroProps = {
      subtotal: 0,
      tax: 0,
      shipping: 0,
      total: 0,
    };

    render(<CartSummary {...zeroProps} />);

    // Check if zero values are displayed correctly
    expect(screen.getByTestId('subtotal').textContent).toBe('¥0');
    expect(screen.getByTestId('tax').textContent).toBe('¥0');
    expect(screen.getByTestId('shipping').textContent).toBe('¥0');
    expect(screen.getByTestId('total').textContent).toBe('¥0');
  });
});
