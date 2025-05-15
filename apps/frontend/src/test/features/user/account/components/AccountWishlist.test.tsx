import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import AccountWishlist from '@/features/user/account/components/AccountWishlist';

// Mock the react-icons
vi.mock('react-icons/ri', () => ({
  RiShoppingCartLine: () => <div data-testid="icon-cart" />,
  RiDeleteBinLine: () => <div data-testid="icon-delete" />,
}));

describe('AccountWishlist Component', () => {
  it('should render the component with heading', () => {
    render(<AccountWishlist />);

    // Check if the component renders without crashing
    expect(screen.getByText('お気に入り商品')).toBeInTheDocument();
  });

  it('should render all wishlist items', () => {
    render(<AccountWishlist />);

    // Check if all item names are rendered
    expect(screen.getByText('プレミアムレザーウォレット')).toBeInTheDocument();
    expect(screen.getByText('クラシックデニムジャケット')).toBeInTheDocument();
    expect(screen.getByText('ミニマリストバックパック')).toBeInTheDocument();

    // Check if all item prices are rendered
    expect(screen.getByText('¥12,800')).toBeInTheDocument();
    expect(screen.getByText('¥18,500')).toBeInTheDocument();
    expect(screen.getByText('¥9,800')).toBeInTheDocument();
  });

  it('should render item images', () => {
    render(<AccountWishlist />);

    // Check if all item images are rendered
    const images = screen.getAllByRole('img');
    expect(images.length).toBe(3);

    // Check if images have correct alt text
    expect(images[0]).toHaveAttribute('alt', 'プレミアムレザーウォレット');
    expect(images[1]).toHaveAttribute('alt', 'クラシックデニムジャケット');
    expect(images[2]).toHaveAttribute('alt', 'ミニマリストバックパック');

    // Check if images have correct src
    expect(images[0]).toHaveAttribute('src', expect.stringContaining('unsplash.com'));
    expect(images[1]).toHaveAttribute('src', expect.stringContaining('unsplash.com'));
    expect(images[2]).toHaveAttribute('src', expect.stringContaining('unsplash.com'));
  });

  it('should render "Add to Cart" buttons for each item', () => {
    render(<AccountWishlist />);

    // Check if all "Add to Cart" buttons are rendered
    const addToCartButtons = screen.getAllByText('カートに追加');
    expect(addToCartButtons.length).toBe(3);

    // Check if cart icons are rendered
    const cartIcons = screen.getAllByTestId('icon-cart');
    expect(cartIcons.length).toBe(3);
  });

  it('should render delete buttons for each item', () => {
    render(<AccountWishlist />);

    // Check if all delete buttons are rendered
    const deleteIcons = screen.getAllByTestId('icon-delete');
    expect(deleteIcons.length).toBe(3);
  });

  it('should show "out of stock" overlay for items not in stock', () => {
    render(<AccountWishlist />);

    // Check if the "out of stock" message is rendered for the third item
    expect(screen.getByText('在庫切れ')).toBeInTheDocument();

    // Check if the "Add to Cart" button is disabled for the out of stock item
    const addToCartButtons = screen.getAllByText('カートに追加');
    expect(addToCartButtons[2]).toBeDisabled();
    expect(addToCartButtons[2]).toHaveClass('cursor-not-allowed');
    expect(addToCartButtons[2]).toHaveClass('bg-gray-300');
  });

  it('should not show the empty state message when there are items', () => {
    render(<AccountWishlist />);

    // Check if the empty state message is not rendered
    expect(screen.queryByText('お気に入りに追加された商品はありません。')).not.toBeInTheDocument();
  });

  it('should have the correct grid layout', () => {
    render(<AccountWishlist />);

    // Check if the grid has the correct classes
    const grid = screen.getByTestId('wishlist-grid');
    expect(grid).toHaveClass('grid');
    expect(grid).toHaveClass('grid-cols-1');
    expect(grid).toHaveClass('sm:grid-cols-2');
    expect(grid).toHaveClass('lg:grid-cols-3');
  });
});
