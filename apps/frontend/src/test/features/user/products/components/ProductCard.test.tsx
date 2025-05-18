import ProductCard from '@/features/user/products/components/ProductCard';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

// Mock Next.js Link component
vi.mock('next/link', () => ({
  default: ({
    children,
    href,
  }: { children: React.ReactNode; href: string }) => (
    <a href={href} data-testid="product-link">
      {children}
    </a>
  ),
}));

// Mock the CartContext
const mockAddItem = vi.fn();

vi.mock('@/contexts/CartContext', () => ({
  useCart: () => ({
    items: [],
    addItem: mockAddItem,
    removeItem: vi.fn(),
    updateQuantity: vi.fn(),
    clearCart: vi.fn(),
    itemCount: 0,
    subtotal: 0,
    tax: 0,
    shipping: 0,
    total: 0,
  }),
}));

describe('ProductCard Component', () => {
  const mockProps = {
    id: 1,
    name: 'Test Product',
    price: 1000,
    description: 'This is a test product description',
    imageUrl: 'test-image.jpg',
  };

  it('should render the component with correct values', () => {
    render(<ProductCard {...mockProps} />);

    // Check if the component renders without crashing
    expect(screen.getByText('Test Product')).toBeInTheDocument();
    expect(
      screen.getByText('This is a test product description')
    ).toBeInTheDocument();
    expect(screen.getByText('¥1,000')).toBeInTheDocument();

    // Check if the image is rendered with correct props
    const image = screen.getByAltText('Test Product');
    expect(image).toHaveAttribute('src', 'test-image.jpg');

    // Check if the link has the correct href
    const link = screen.getByTestId('product-link');
    expect(link).toHaveAttribute('href', '/products/1');

    // Check if the add to cart button is rendered
    const addToCartButton = screen.getByText('カートに追加');
    expect(addToCartButton).toBeInTheDocument();
  });

  it('should format the price correctly', () => {
    const propsWithLargePrice = {
      ...mockProps,
      price: 1234567,
    };

    render(<ProductCard {...propsWithLargePrice} />);

    // Check if the price is formatted correctly
    expect(screen.getByText('¥1,234,567')).toBeInTheDocument();
  });

  it('should truncate long descriptions', () => {
    const propsWithLongDescription = {
      ...mockProps,
      description:
        'This is a very long product description that should be truncated in the UI. It contains a lot of text that will not be fully displayed.',
    };

    render(<ProductCard {...propsWithLongDescription} />);

    // Check if the description is rendered
    const description = screen.getByText(
      /This is a very long product description/
    );
    expect(description).toBeInTheDocument();

    // Check if the description has the line-clamp-2 class
    expect(description).toHaveClass('line-clamp-2');
  });

  it('should handle click on add to cart button', async () => {
    // Reset the mock before the test
    mockAddItem.mockClear();

    const user = userEvent.setup();
    render(<ProductCard {...mockProps} />);

    // Find and click the add to cart button
    const addToCartButton = screen.getByText('カートに追加');
    await user.click(addToCartButton);

    // Verify that addItem was called with the correct product information
    expect(mockAddItem).toHaveBeenCalledWith({
      id: mockProps.id,
      name: mockProps.name,
      price: mockProps.price,
      image: mockProps.imageUrl,
    });
  });
});
