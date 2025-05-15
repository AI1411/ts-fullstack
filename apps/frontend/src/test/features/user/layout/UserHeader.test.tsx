import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import UserHeader from '@/features/user/layout/UserHeader';

// Mock the next/navigation module
vi.mock('next/navigation', () => ({
  usePathname: vi.fn(() => '/'),
}));

// Mock the next/link component
vi.mock('next/link', () => {
  return {
    __esModule: true,
    default: ({ href, children, className, onClick }: { href: string; children: React.ReactNode; className?: string; onClick?: () => void }) => {
      return (
        <a href={href} className={className} data-testid="next-link" onClick={onClick}>
          {children}
        </a>
      );
    },
  };
});

// Mock localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: vi.fn((key: string) => store[key] || null),
    setItem: vi.fn((key: string, value: string) => {
      store[key] = value;
    }),
    clear: vi.fn(() => {
      store = {};
    }),
    removeItem: vi.fn((key: string) => {
      delete store[key];
    }),
    key: vi.fn((index: number) => Object.keys(store)[index] || null),
    get length() {
      return Object.keys(store).length;
    }
  };
})();

Object.defineProperty(window, 'localStorage', { value: localStorageMock });

// Mock the document classList

describe('UserHeader', () => {
  beforeEach(() => {
    localStorageMock.clear();
    vi.clearAllMocks();
  });

  it('renders the header with logo', () => {
    render(<UserHeader />);
    expect(screen.getByText('ECサイト')).toBeInTheDocument();
  });

  it('renders all navigation links', () => {
    render(<UserHeader />);
    expect(screen.getByText('ホーム')).toBeInTheDocument();
    expect(screen.getByText('商品一覧')).toBeInTheDocument();
    expect(screen.getByText('カテゴリー')).toBeInTheDocument();
    expect(screen.getByText('セール')).toBeInTheDocument();
    expect(screen.getByText('お問い合わせ')).toBeInTheDocument();
  });

  it('toggles dark mode when the dark mode button is clicked', () => {
    render(<UserHeader />);

    // Mock the document.documentElement.classList methods directly
    vi.spyOn(document.documentElement.classList, 'add');
    vi.spyOn(document.documentElement.classList, 'remove');

    // Find the dark mode button using data-testid
    const darkModeButton = screen.getByTestId('dark-mode-button');

    expect(darkModeButton).toBeInTheDocument();

    // Click the button to enable dark mode
    if (darkModeButton) {
      fireEvent.click(darkModeButton);
    }

    // Check that the dark mode class was added to the document
    expect(document.documentElement.classList.add).toHaveBeenCalledWith('dark');
    expect(localStorage.getItem('darkMode')).toBe('true');

    // Click the button again to disable dark mode
    if (darkModeButton) {
      fireEvent.click(darkModeButton);
    }

    // Check that the dark mode class was removed from the document
    expect(document.documentElement.classList.remove).toHaveBeenCalledWith('dark');
    expect(localStorage.getItem('darkMode')).toBe('false');
  });

  it('toggles mobile menu when the menu button is clicked', () => {
    render(<UserHeader />);

    // Mobile menu should be hidden initially
    expect(screen.queryByText('ホーム', { selector: '.block' })).not.toBeInTheDocument();

    // Find the mobile menu button using data-testid
    const menuButton = screen.getByTestId('mobile-menu-button');

    expect(menuButton).toBeInTheDocument();

    // Click the button to open the menu
    if (menuButton) {
      fireEvent.click(menuButton);
    }

    // Mobile menu should now be visible
    expect(screen.getByText('ホーム', { selector: '.block' })).toBeInTheDocument();

    // Click the button again to close the menu
    if (menuButton) {
      fireEvent.click(menuButton);
    }

    // Mobile menu should be hidden again
    expect(screen.queryByText('ホーム', { selector: '.block' })).not.toBeInTheDocument();
  });

  it('has correct links for navigation items', () => {
    render(<UserHeader />);

    // Check that the home link has the correct href
    const homeLink = screen.getByText('ホーム').closest('a');
    expect(homeLink).toHaveAttribute('href', '/');

    // Check that the products link has the correct href
    const productsLink = screen.getByText('商品一覧').closest('a');
    expect(productsLink).toHaveAttribute('href', '/products');

    // Check that the cart link has the correct href
    const cartLink = screen.getByRole('link', { name: /3/i });
    expect(cartLink).toHaveAttribute('href', '/cart');

    // Check that the account link has the correct href
    const links = screen.getAllByRole('link');
    const accountLink = links.find(link => link.getAttribute('href') === '/account');
    expect(accountLink).toBeDefined();
    expect(accountLink).toHaveAttribute('href', '/account');
  });

  it('closes mobile menu when a navigation link is clicked', () => {
    render(<UserHeader />);

    // Find the mobile menu button using data-testid
    const menuButton = screen.getByTestId('mobile-menu-button');

    expect(menuButton).toBeInTheDocument();

    // Open the mobile menu
    if (menuButton) {
      fireEvent.click(menuButton);
    }

    // Mobile menu should be visible
    expect(screen.getByText('ホーム', { selector: '.block' })).toBeInTheDocument();

    // Click a navigation link
    const homeLink = screen.getByText('ホーム', { selector: '.block' });
    fireEvent.click(homeLink);

    // Mobile menu should be hidden again
    expect(screen.queryByText('ホーム', { selector: '.block' })).not.toBeInTheDocument();
  });
});
