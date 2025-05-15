import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import CartItem from '@/features/user/cart/components/CartItem';

// Mock Next.js Image component
vi.mock('next/image', () => ({
  default: ({ src, alt }: { src: string; alt: string }) => (
    <img src={src} alt={alt} data-testid="product-image" />
  ),
}));

// Mock react-icons
vi.mock('react-icons/ri', () => ({
  RiDeleteBinLine: () => <div data-testid="delete-icon" />,
}));

describe('CartItem Component', () => {
  const mockProps = {
    id: 1,
    name: 'Test Product',
    price: 1000,
    quantity: 2,
    image: 'test-image.jpg',
    onRemove: vi.fn(),
    onUpdateQuantity: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render the component with correct values', () => {
    render(<CartItem {...mockProps} />);
    
    // Check if the component renders without crashing
    expect(screen.getByText('Test Product')).toBeInTheDocument();
    expect(screen.getByText('¥1,000')).toBeInTheDocument();
    expect(screen.getByText('2')).toBeInTheDocument();
    
    // Check if the image is rendered with correct props
    const image = screen.getByTestId('product-image');
    expect(image).toHaveAttribute('src', 'test-image.jpg');
    expect(image).toHaveAttribute('alt', 'Test Product');
    
    // Check if the total price is calculated and displayed correctly
    expect(screen.getByText('¥2,000')).toBeInTheDocument();
  });

  it('should call onRemove when delete button is clicked', () => {
    render(<CartItem {...mockProps} />);
    
    // Find and click the delete button
    const deleteButton = screen.getByTestId('delete-icon').closest('button');
    fireEvent.click(deleteButton!);
    
    // Check if onRemove was called with the correct ID
    expect(mockProps.onRemove).toHaveBeenCalledWith(1);
  });

  it('should call onUpdateQuantity to decrease quantity when - button is clicked', () => {
    render(<CartItem {...mockProps} />);
    
    // Find and click the decrease button
    const decreaseButton = screen.getByText('-');
    fireEvent.click(decreaseButton);
    
    // Check if onUpdateQuantity was called with the correct ID and quantity
    expect(mockProps.onUpdateQuantity).toHaveBeenCalledWith(1, 1);
  });

  it('should call onUpdateQuantity to increase quantity when + button is clicked', () => {
    render(<CartItem {...mockProps} />);
    
    // Find and click the increase button
    const increaseButton = screen.getByText('+');
    fireEvent.click(increaseButton);
    
    // Check if onUpdateQuantity was called with the correct ID and quantity
    expect(mockProps.onUpdateQuantity).toHaveBeenCalledWith(1, 3);
  });

  it('should not decrease quantity below 1', () => {
    const propsWithMinQuantity = {
      ...mockProps,
      quantity: 1,
    };
    
    render(<CartItem {...propsWithMinQuantity} />);
    
    // Find and click the decrease button
    const decreaseButton = screen.getByText('-');
    fireEvent.click(decreaseButton);
    
    // Check if onUpdateQuantity was called with the correct ID and quantity (still 1)
    expect(mockProps.onUpdateQuantity).toHaveBeenCalledWith(1, 1);
  });
});