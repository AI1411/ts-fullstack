import FeaturedProducts from '@/features/user/home/components/FeaturedProducts';
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

// Mock ProductCard component
vi.mock('@/features/user/products/components/ProductCard', () => ({
  default: vi.fn(({ id, name, price, description, imageUrl }) => (
    <div data-testid={`product-card-${id}`}>
      <div data-testid={`product-name-${id}`}>{name}</div>
      <div data-testid={`product-price-${id}`}>{price}</div>
      <div data-testid={`product-description-${id}`}>{description}</div>
      <div data-testid={`product-image-${id}`}>{imageUrl}</div>
    </div>
  )),
}));

describe('FeaturedProducts Component', () => {
  it('should render the component with heading', () => {
    render(<FeaturedProducts />);

    // Check if the component renders without crashing
    expect(screen.getByText('おすすめ商品')).toBeInTheDocument();
  });

  it('should render the "view all products" link', () => {
    render(<FeaturedProducts />);

    // Check if the link is rendered with correct text and href
    const link = screen.getByText('すべての商品を見る');
    expect(link).toBeInTheDocument();

    const linkElement = screen.getByTestId('link');
    expect(linkElement).toHaveAttribute('href', '/products');
  });

  it('should render all sample products', () => {
    render(<FeaturedProducts />);

    // Check if all product cards are rendered
    expect(screen.getByTestId('product-card-1')).toBeInTheDocument();
    expect(screen.getByTestId('product-card-2')).toBeInTheDocument();
    expect(screen.getByTestId('product-card-3')).toBeInTheDocument();
    expect(screen.getByTestId('product-card-4')).toBeInTheDocument();

    // Check if product details are passed correctly to ProductCard
    expect(screen.getByTestId('product-name-1').textContent).toBe(
      'プレミアムレザーウォレット'
    );
    expect(screen.getByTestId('product-price-1').textContent).toBe('12800');

    expect(screen.getByTestId('product-name-2').textContent).toBe(
      'ワイヤレスノイズキャンセリングヘッドフォン'
    );
    expect(screen.getByTestId('product-price-2').textContent).toBe('32800');

    expect(screen.getByTestId('product-name-3').textContent).toBe(
      'オーガニックコットンTシャツ'
    );
    expect(screen.getByTestId('product-price-3').textContent).toBe('4900');

    expect(screen.getByTestId('product-name-4').textContent).toBe(
      'スマートウォッチ プロ'
    );
    expect(screen.getByTestId('product-price-4').textContent).toBe('42800');
  });

  it('should have the correct grid layout classes', () => {
    render(<FeaturedProducts />);

    // Check if the grid has the correct classes
    const grid = screen.getByTestId('products-grid');
    expect(grid).toHaveClass('grid');
    expect(grid).toHaveClass('grid-cols-1');
    expect(grid).toHaveClass('sm:grid-cols-2');
    expect(grid).toHaveClass('lg:grid-cols-4');
  });
});
