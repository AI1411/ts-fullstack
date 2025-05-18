import SalePromotion from '@/features/user/home/components/SalePromotion';
import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

// Mock Next.js Link component
vi.mock('next/link', () => ({
  default: ({
    children,
    href,
  }: { children: React.ReactNode; href: string }) => (
    <a href={href} data-testid="link">
      {children}
    </a>
  ),
}));

describe('SalePromotion Component', () => {
  it('should render the component with heading and description', () => {
    render(<SalePromotion />);

    // Check if the component renders without crashing
    expect(screen.getByText('期間限定セール開催中！')).toBeInTheDocument();
    expect(
      screen.getByText('最大50%オフの特別価格でお買い得。お見逃しなく！')
    ).toBeInTheDocument();
  });

  it('should render the call-to-action button with correct link', () => {
    render(<SalePromotion />);

    // Check if the button is rendered
    const button = screen.getByText('セールページへ');
    expect(button).toBeInTheDocument();

    // Check if the link has the correct href
    const link = screen.getByTestId('link');
    expect(link).toHaveAttribute('href', '/sales');
  });

  it('should have the correct styling classes', () => {
    render(<SalePromotion />);

    // Check if the section has the correct background gradient classes
    const section = screen.getByTestId('sale-promotion-section');
    expect(section).toHaveClass('bg-gradient-to-r');
    expect(section).toHaveClass('from-blue-500');
    expect(section).toHaveClass('to-indigo-600');

    // Check if the button exists
    const button = screen.getByText('セールページへ').closest('a');
    expect(button).toBeInTheDocument();
  });

  it('should have centered text content', () => {
    render(<SalePromotion />);

    // Check if the content container has the text-center class
    const container = screen.getByText('期間限定セール開催中！').closest('div');
    expect(container).toHaveClass('text-center');
  });
});
