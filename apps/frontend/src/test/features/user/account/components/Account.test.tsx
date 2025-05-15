import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import Account from '@/features/user/account/components/Account';

// Mock the child components
vi.mock('@/features/user/account/components/AccountProfile', () => ({
  default: vi.fn(({ user }) => (
    <div data-testid="account-profile">
      <div data-testid="profile-name">{user.name}</div>
      <div data-testid="profile-email">{user.email}</div>
    </div>
  )),
}));

vi.mock('@/features/user/account/components/AccountOrders', () => ({
  default: vi.fn(() => <div data-testid="account-orders">Orders Content</div>),
}));

vi.mock('@/features/user/account/components/AccountWishlist', () => ({
  default: vi.fn(() => <div data-testid="account-wishlist">Wishlist Content</div>),
}));

vi.mock('@/features/user/account/components/AccountSettings', () => ({
  default: vi.fn(({ user }) => (
    <div data-testid="account-settings">
      <div data-testid="settings-email">{user.email}</div>
    </div>
  )),
}));

// Mock the react-icons
vi.mock('react-icons/ri', () => ({
  RiUser3Line: () => <div data-testid="icon-user" />,
  RiShoppingBag3Line: () => <div data-testid="icon-shopping-bag" />,
  RiHeartLine: () => <div data-testid="icon-heart" />,
  RiSettings4Line: () => <div data-testid="icon-settings" />,
  RiLogoutBoxRLine: () => <div data-testid="icon-logout" />,
}));

describe('Account Component', () => {
  it('should render the component with user information', () => {
    render(<Account />);

    // Check if the component renders without crashing
    expect(screen.getByText('マイアカウント')).toBeInTheDocument();

    // Check if user information is displayed
    expect(screen.getByTestId('profile-name')).toHaveTextContent('山田 太郎');
    expect(screen.getByTestId('profile-email')).toHaveTextContent('yamada.taro@example.com');

    // Check if the avatar is displayed
    const avatar = screen.getByAltText('山田 太郎');
    expect(avatar).toBeInTheDocument();
    expect(avatar).toHaveAttribute('src', expect.stringContaining('unsplash.com'));
  });

  it('should render all navigation tabs', () => {
    render(<Account />);

    // Check if all tabs are rendered
    expect(screen.getByText('プロフィール')).toBeInTheDocument();
    expect(screen.getByText('注文履歴')).toBeInTheDocument();
    expect(screen.getByText('お気に入り')).toBeInTheDocument();
    expect(screen.getByText('設定')).toBeInTheDocument();
    expect(screen.getByText('ログアウト')).toBeInTheDocument();

    // Check if all icons are rendered
    expect(screen.getByTestId('icon-user')).toBeInTheDocument();
    expect(screen.getByTestId('icon-shopping-bag')).toBeInTheDocument();
    expect(screen.getByTestId('icon-heart')).toBeInTheDocument();
    expect(screen.getByTestId('icon-settings')).toBeInTheDocument();
    expect(screen.getByTestId('icon-logout')).toBeInTheDocument();
  });

  it('should show profile tab by default', () => {
    render(<Account />);

    // Check if the profile tab is active by default
    expect(screen.getByTestId('account-profile')).toBeInTheDocument();
    expect(screen.queryByTestId('account-orders')).not.toBeInTheDocument();
    expect(screen.queryByTestId('account-wishlist')).not.toBeInTheDocument();
    expect(screen.queryByTestId('account-settings')).not.toBeInTheDocument();

    // Check if the profile tab button has the active class
    const profileButton = screen.getByText('プロフィール').closest('button');
    expect(profileButton).toHaveClass('bg-blue-50');
    expect(profileButton).toHaveClass('text-blue-600');
  });

  it('should switch tabs when clicking on tab buttons', () => {
    render(<Account />);

    // Initially, profile tab should be active
    expect(screen.getByTestId('account-profile')).toBeInTheDocument();

    // Click on orders tab
    fireEvent.click(screen.getByText('注文履歴'));

    // Now orders tab should be active
    expect(screen.queryByTestId('account-profile')).not.toBeInTheDocument();
    expect(screen.getByTestId('account-orders')).toBeInTheDocument();
    expect(screen.queryByTestId('account-wishlist')).not.toBeInTheDocument();
    expect(screen.queryByTestId('account-settings')).not.toBeInTheDocument();

    // Click on wishlist tab
    fireEvent.click(screen.getByText('お気に入り'));

    // Now wishlist tab should be active
    expect(screen.queryByTestId('account-profile')).not.toBeInTheDocument();
    expect(screen.queryByTestId('account-orders')).not.toBeInTheDocument();
    expect(screen.getByTestId('account-wishlist')).toBeInTheDocument();
    expect(screen.queryByTestId('account-settings')).not.toBeInTheDocument();

    // Click on settings tab
    fireEvent.click(screen.getByText('設定'));

    // Now settings tab should be active
    expect(screen.queryByTestId('account-profile')).not.toBeInTheDocument();
    expect(screen.queryByTestId('account-orders')).not.toBeInTheDocument();
    expect(screen.queryByTestId('account-wishlist')).not.toBeInTheDocument();
    expect(screen.getByTestId('account-settings')).toBeInTheDocument();

    // Click back on profile tab
    fireEvent.click(screen.getByText('プロフィール'));

    // Now profile tab should be active again
    expect(screen.getByTestId('account-profile')).toBeInTheDocument();
    expect(screen.queryByTestId('account-orders')).not.toBeInTheDocument();
    expect(screen.queryByTestId('account-wishlist')).not.toBeInTheDocument();
    expect(screen.queryByTestId('account-settings')).not.toBeInTheDocument();
  });

  it('should pass the correct user data to child components', () => {
    render(<Account />);

    // Check if the profile component receives the correct user data
    expect(screen.getByTestId('profile-name').textContent).toBe('山田 太郎');
    expect(screen.getByTestId('profile-email').textContent).toBe('yamada.taro@example.com');

    // Switch to settings tab and check if it receives the correct user data
    fireEvent.click(screen.getByText('設定'));
    expect(screen.getByTestId('settings-email').textContent).toBe('yamada.taro@example.com');
  });
});
