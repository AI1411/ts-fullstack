import CartList from '@/features/user/cart/components/CartList';
import type { CartItemType } from '@/features/user/cart/components/CartList';
import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

// Mock the CartItem component
vi.mock('@/features/user/cart/components/CartItem', () => ({
  default: vi.fn(
    ({ id, name, price, quantity, image, onRemove, onUpdateQuantity }) => (
      <div data-testid={`cart-item-${id}`}>
        <div data-testid={`item-name-${id}`}>{name}</div>
        <div data-testid={`item-price-${id}`}>{price}</div>
        <div data-testid={`item-quantity-${id}`}>{quantity}</div>
        <div data-testid={`item-image-${id}`}>{image}</div>
        <button
          data-testid={`remove-button-${id}`}
          onClick={() => onRemove(id)}
        >
          Remove
        </button>
        <button
          data-testid={`increase-button-${id}`}
          onClick={() => onUpdateQuantity(id, quantity + 1)}
        >
          Increase
        </button>
      </div>
    )
  ),
}));

describe('CartList Component', () => {
  const mockItems: CartItemType[] = [
    {
      id: 1,
      name: 'Test Product 1',
      price: 1000,
      quantity: 1,
      image: 'test-image-1.jpg',
    },
    {
      id: 2,
      name: 'Test Product 2',
      price: 2000,
      quantity: 2,
      image: 'test-image-2.jpg',
    },
  ];

  const mockOnRemoveItem = vi.fn();
  const mockOnUpdateQuantity = vi.fn();

  it('should render the component with items', () => {
    render(
      <CartList
        items={mockItems}
        onRemoveItem={mockOnRemoveItem}
        onUpdateQuantity={mockOnUpdateQuantity}
      />
    );

    // Check if the component renders without crashing
    expect(screen.getByText('ショッピングカート')).toBeInTheDocument();

    // Check if all items are rendered
    expect(screen.getByTestId('cart-item-1')).toBeInTheDocument();
    expect(screen.getByTestId('cart-item-2')).toBeInTheDocument();

    // Check if item details are passed correctly
    expect(screen.getByTestId('item-name-1').textContent).toBe(
      'Test Product 1'
    );
    expect(screen.getByTestId('item-price-1').textContent).toBe('1000');
    expect(screen.getByTestId('item-quantity-1').textContent).toBe('1');
    expect(screen.getByTestId('item-image-1').textContent).toBe(
      'test-image-1.jpg'
    );

    expect(screen.getByTestId('item-name-2').textContent).toBe(
      'Test Product 2'
    );
    expect(screen.getByTestId('item-price-2').textContent).toBe('2000');
    expect(screen.getByTestId('item-quantity-2').textContent).toBe('2');
    expect(screen.getByTestId('item-image-2').textContent).toBe(
      'test-image-2.jpg'
    );
  });

  it('should display a message when there are no items', () => {
    render(
      <CartList
        items={[]}
        onRemoveItem={mockOnRemoveItem}
        onUpdateQuantity={mockOnUpdateQuantity}
      />
    );

    // Check if the empty cart message is displayed
    expect(screen.getByText('カートに商品がありません')).toBeInTheDocument();
    expect(screen.getByText('商品を追加してください')).toBeInTheDocument();
  });

  it('should call onRemoveItem when remove button is clicked', () => {
    render(
      <CartList
        items={mockItems}
        onRemoveItem={mockOnRemoveItem}
        onUpdateQuantity={mockOnUpdateQuantity}
      />
    );

    // Click the remove button for the first item
    screen.getByTestId('remove-button-1').click();

    // Check if onRemoveItem was called with the correct ID
    expect(mockOnRemoveItem).toHaveBeenCalledWith(1);
  });

  it('should call onUpdateQuantity when increase button is clicked', () => {
    render(
      <CartList
        items={mockItems}
        onRemoveItem={mockOnRemoveItem}
        onUpdateQuantity={mockOnUpdateQuantity}
      />
    );

    // Click the increase button for the second item
    screen.getByTestId('increase-button-2').click();

    // Check if onUpdateQuantity was called with the correct ID and quantity
    expect(mockOnUpdateQuantity).toHaveBeenCalledWith(2, 3);
  });
});
