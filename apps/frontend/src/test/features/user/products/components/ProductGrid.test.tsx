import ProductGrid from '@/features/user/products/components/ProductGrid';
import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

// Mock the ProductCard component
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

describe('ProductGrid Component', () => {
  const mockProducts = [
    {
      id: 1,
      name: 'Test Product 1',
      price: 1000,
      description: 'Test Description 1',
      imageUrl: 'test-image-1.jpg',
    },
    {
      id: 2,
      name: 'Test Product 2',
      price: 2000,
      description: 'Test Description 2',
      imageUrl: 'test-image-2.jpg',
    },
    {
      id: 3,
      name: 'Test Product 3',
      price: 3000,
      description: 'Test Description 3',
      imageUrl: 'test-image-3.jpg',
    },
  ];

  it('should render the component with products', () => {
    render(<ProductGrid products={mockProducts} />);

    // Check if all product cards are rendered
    expect(screen.getByTestId('product-card-1')).toBeInTheDocument();
    expect(screen.getByTestId('product-card-2')).toBeInTheDocument();
    expect(screen.getByTestId('product-card-3')).toBeInTheDocument();

    // Check if product details are passed correctly to ProductCard
    expect(screen.getByTestId('product-name-1').textContent).toBe(
      'Test Product 1'
    );
    expect(screen.getByTestId('product-price-1').textContent).toBe('1000');
    expect(screen.getByTestId('product-description-1').textContent).toBe(
      'Test Description 1'
    );
    expect(screen.getByTestId('product-image-1').textContent).toBe(
      'test-image-1.jpg'
    );

    expect(screen.getByTestId('product-name-2').textContent).toBe(
      'Test Product 2'
    );
    expect(screen.getByTestId('product-price-2').textContent).toBe('2000');
    expect(screen.getByTestId('product-description-2').textContent).toBe(
      'Test Description 2'
    );
    expect(screen.getByTestId('product-image-2').textContent).toBe(
      'test-image-2.jpg'
    );

    expect(screen.getByTestId('product-name-3').textContent).toBe(
      'Test Product 3'
    );
    expect(screen.getByTestId('product-price-3').textContent).toBe('3000');
    expect(screen.getByTestId('product-description-3').textContent).toBe(
      'Test Description 3'
    );
    expect(screen.getByTestId('product-image-3').textContent).toBe(
      'test-image-3.jpg'
    );
  });

  it('should render an empty grid when no products are provided', () => {
    const { container } = render(<ProductGrid products={[]} />);

    // Check if the grid is rendered but empty
    const grid = container.firstChild;
    expect(grid).toBeInTheDocument();
    expect(grid.childNodes.length).toBe(0);
  });

  it('should apply the correct grid classes', () => {
    const { container } = render(<ProductGrid products={mockProducts} />);

    // Check if the grid has the correct classes
    const grid = container.firstChild;
    expect(grid).toHaveClass('grid');
    expect(grid).toHaveClass('grid-cols-1');
    expect(grid).toHaveClass('sm:grid-cols-2');
    expect(grid).toHaveClass('lg:grid-cols-3');
    expect(grid).toHaveClass('xl:grid-cols-4');
  });
});
