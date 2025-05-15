import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import SalesProducts from '@/features/user/sales/components/SalesProducts';
import ProductCard from '@/features/user/products/components/ProductCard';

// Mock the ProductCard component
vi.mock('@/features/user/products/components/ProductCard', () => ({
  default: vi.fn(() => <div data-testid="product-card">Mocked Product Card</div>)
}));

describe('SalesProducts Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });
  it('should render the component', () => {
    render(<SalesProducts />);

    // Check if the component is defined
    expect(SalesProducts).toBeDefined();
    expect(typeof SalesProducts).toBe('function');

    // Check if heading is rendered
    expect(screen.getByText('セール商品')).toBeInTheDocument();

    // Check if "view all products" link is rendered
    const viewAllLink = screen.getByText('すべての商品を見る');
    expect(viewAllLink).toBeInTheDocument();
    expect(viewAllLink.closest('a')).toHaveAttribute('href', '/products');
  });

  it('should render product cards for each sale product', () => {
    render(<SalesProducts />);

    // Check if ProductCard components are rendered
    const productCards = screen.getAllByTestId('product-card');

    // There should be 6 products in the hardcoded saleProducts array
    expect(productCards).toHaveLength(6);

    // Verify ProductCard was called with correct props for each product
    expect(ProductCard).toHaveBeenCalledTimes(6);

    // Check first product props (first call)
    expect(ProductCard.mock.calls[0][0]).toEqual(
      expect.objectContaining({
        id: 101,
        name: 'プレミアムレザーウォレット【セール】',
        price: 8980,
        description: '高品質な本革を使用した長財布。耐久性と美しさを兼ね備えたデザイン。期間限定30%オフ！',
        imageUrl: expect.any(String)
      })
    );

    // Check last product props (sixth call)
    expect(ProductCard.mock.calls[5][0]).toEqual(
      expect.objectContaining({
        id: 106,
        name: 'ステンレスウォーターボトル【セール】',
        price: 1980,
        description: '真空断熱構造で温かい飲み物も冷たい飲み物も長時間保温・保冷。環境に優しいエコボトル。期間限定30%オフ！',
        imageUrl: expect.any(String)
      })
    );
  });

  it('should render the correct number of products in a grid layout', () => {
    render(<SalesProducts />);

    // Check if the grid container exists
    const gridContainer = screen.getByText('セール商品').closest('div')?.nextElementSibling;
    expect(gridContainer).toHaveClass('grid');

    // Check if there are 6 product cards
    const productCards = screen.getAllByTestId('product-card');
    expect(productCards).toHaveLength(6);
  });
});
