import Categories from '@/features/user/home/components/Categories';
import { render, screen, waitFor } from '@testing-library/react';
import type React from 'react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

// Mock Next.js Link component
vi.mock('next/link', () => ({
  default: ({
    children,
    href,
    'data-testid': dataTestId,
  }: { children: React.ReactNode; href: string; 'data-testid'?: string }) => (
    <a href={href} data-testid={dataTestId || 'link'}>
      {children}
    </a>
  ),
}));

// Mock fetch API
const mockFetch = vi.fn();
global.fetch = mockFetch;

// Mock window.location.reload
const mockReload = vi.fn();
Object.defineProperty(window, 'location', {
  value: {
    reload: mockReload,
  },
  writable: true,
});

describe('Categories Component', () => {
  const mockCategories = {
    categories: [
      {
        id: 1,
        name: 'Test Category 1',
        description: 'Test Description 1',
        created_at: '2023-01-01T00:00:00.000Z',
        updated_at: '2023-01-01T00:00:00.000Z',
      },
      {
        id: 2,
        name: 'Test Category 2',
        description: null,
        created_at: '2023-01-01T00:00:00.000Z',
        updated_at: '2023-01-01T00:00:00.000Z',
      },
      {
        id: 3,
        name: 'Test Category with Spaces',
        description: 'Test Description 3',
        created_at: '2023-01-01T00:00:00.000Z',
        updated_at: '2023-01-01T00:00:00.000Z',
      },
    ],
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  it('should render loading state initially', () => {
    // Mock fetch to not resolve immediately
    mockFetch.mockImplementation(() => new Promise(() => {}));

    render(<Categories />);

    // Check if loading spinner is displayed
    expect(screen.getByRole('status')).toBeInTheDocument();
  });

  it('should render categories when fetch is successful', async () => {
    // Mock successful fetch
    mockFetch.mockResolvedValue({
      ok: true,
      headers: {
        get: (name: string) =>
          name.toLowerCase() === 'content-type' ? 'application/json' : null,
      },
      text: () => Promise.resolve(JSON.stringify(mockCategories)),
    });

    render(<Categories />);

    // Wait for categories to be displayed
    await waitFor(() => {
      expect(screen.getByText('Test Category 1')).toBeInTheDocument();
    });

    // Check if all categories are rendered
    expect(screen.getByText('Test Category 1')).toBeInTheDocument();
    expect(screen.getByText('Test Category 2')).toBeInTheDocument();
    expect(screen.getByText('Test Category with Spaces')).toBeInTheDocument();

    // Check if descriptions are rendered correctly
    expect(screen.getByText('Test Description 1')).toBeInTheDocument();
    expect(screen.getByText('Test Description 3')).toBeInTheDocument();

    // Check if links have correct hrefs
    const links = screen.getAllByRole('link');
    // First link is "すべてのカテゴリーを見る", then category links
    expect(links[1]).toHaveAttribute('href', '/categories/test-category-1');
    expect(links[2]).toHaveAttribute('href', '/categories/test-category-2');
    expect(links[3]).toHaveAttribute(
      'href',
      '/categories/test-category-with-spaces'
    );

    // Check if images are rendered with correct URLs
    const images = screen.getAllByRole('img');
    expect(images[0]).toHaveAttribute(
      'src',
      expect.stringContaining('unsplash.com')
    );
    expect(images[1]).toHaveAttribute(
      'src',
      expect.stringContaining('unsplash.com')
    );
    expect(images[2]).toHaveAttribute(
      'src',
      expect.stringContaining('unsplash.com')
    );
  });

  it('should render error state when fetch fails', async () => {
    // Mock fetch with network error
    mockFetch.mockRejectedValue(new Error('Network error'));

    render(<Categories />);

    // Wait for error message to be displayed
    await waitFor(() => {
      expect(
        screen.getByText('カテゴリデータの取得に失敗しました')
      ).toBeInTheDocument();
    });

    // Check if reload button is displayed
    expect(screen.getByText('再読み込み')).toBeInTheDocument();
  });

  it('should render error state when response is not ok', async () => {
    // Mock fetch with not ok response
    mockFetch.mockResolvedValue({
      ok: false,
      status: 500,
      statusText: 'Internal Server Error',
    });

    render(<Categories />);

    // Wait for error message to be displayed
    await waitFor(() => {
      expect(
        screen.getByText('カテゴリデータの取得に失敗しました')
      ).toBeInTheDocument();
    });
  });

  it('should render error state when content type is HTML', async () => {
    // Mock fetch with HTML content type
    mockFetch.mockResolvedValue({
      ok: true,
      headers: {
        get: (name: string) =>
          name.toLowerCase() === 'content-type' ? 'text/html' : null,
      },
      text: () => Promise.resolve(JSON.stringify(mockCategories)),
    });

    render(<Categories />);

    // Wait for error message to be displayed
    await waitFor(() => {
      expect(
        screen.getByText('カテゴリデータの取得に失敗しました')
      ).toBeInTheDocument();
    });
  });

  it('should render error state when response is invalid JSON', async () => {
    // Mock fetch with invalid JSON response
    mockFetch.mockResolvedValue({
      ok: true,
      headers: {
        get: (name: string) =>
          name.toLowerCase() === 'content-type' ? 'application/json' : null,
      },
      text: () =>
        Promise.resolve('<!DOCTYPE html><html><body>Error</body></html>'),
    });

    render(<Categories />);

    // Wait for error message to be displayed
    await waitFor(() => {
      expect(
        screen.getByText('カテゴリデータの取得に失敗しました')
      ).toBeInTheDocument();
    });
  });

  it('should render empty state when no categories are available', async () => {
    // Mock successful fetch with empty categories array
    mockFetch.mockResolvedValue({
      ok: true,
      headers: {
        get: (name: string) =>
          name.toLowerCase() === 'content-type' ? 'application/json' : null,
      },
      text: () => Promise.resolve(JSON.stringify({ categories: [] })),
    });

    render(<Categories />);

    // Wait for loading to finish
    await waitFor(() => {
      expect(screen.queryByRole('status')).not.toBeInTheDocument();
    });

    // Check for the heading and subheading
    expect(screen.getByText('カテゴリーから探す')).toBeInTheDocument();
    expect(
      screen.getByText('お探しの商品カテゴリーを選択してください')
    ).toBeInTheDocument();

    // Check for the "view all categories" link
    expect(screen.getByText('すべてのカテゴリーを見る')).toBeInTheDocument();

    // Check that the grid container exists
    const gridContainer = screen.getAllByRole('link')[0].closest('section');
    expect(gridContainer).toBeInTheDocument();

    // Verify no category items are rendered
    expect(screen.queryByRole('img')).not.toBeInTheDocument();
  });

  it('should handle reload button click', async () => {
    // Mock fetch with network error
    mockFetch.mockRejectedValue(new Error('Network error'));

    render(<Categories />);

    // Wait for error message to be displayed
    await waitFor(() => {
      expect(
        screen.getByText('カテゴリデータの取得に失敗しました')
      ).toBeInTheDocument();
    });

    // Click reload button
    const reloadButton = screen.getByText('再読み込み');
    reloadButton.click();

    // Check if reload was called
    expect(mockReload).toHaveBeenCalledTimes(1);
  });

  it('should handle response with undefined categories array', async () => {
    // Mock successful fetch with undefined categories array
    mockFetch.mockResolvedValue({
      ok: true,
      headers: {
        get: (name: string) =>
          name.toLowerCase() === 'content-type' ? 'application/json' : null,
      },
      text: () =>
        Promise.resolve(
          JSON.stringify({
            /* no categories property */
          })
        ),
    });

    render(<Categories />);

    // Wait for loading to finish
    await waitFor(() => {
      expect(screen.queryByRole('status')).not.toBeInTheDocument();
    });

    // Check for the heading and subheading
    expect(screen.getByText('カテゴリーから探す')).toBeInTheDocument();

    // Verify no category items are rendered
    expect(screen.queryByRole('img')).not.toBeInTheDocument();
  });

  it('should handle category with undefined href', async () => {
    // Create a mock category without href
    const mockCategoriesWithoutHref = {
      categories: [
        {
          id: 1,
          name: 'Test Category Without Href',
          description: 'Test Description',
          created_at: '2023-01-01T00:00:00.000Z',
          updated_at: '2023-01-01T00:00:00.000Z',
        },
      ],
    };

    // Mock successful fetch
    mockFetch.mockResolvedValue({
      ok: true,
      headers: {
        get: (name: string) =>
          name.toLowerCase() === 'content-type' ? 'application/json' : null,
      },
      text: () => Promise.resolve(JSON.stringify(mockCategoriesWithoutHref)),
    });

    render(<Categories />);

    // Wait for categories to be displayed
    await waitFor(() => {
      expect(
        screen.getByText('Test Category Without Href')
      ).toBeInTheDocument();
    });

    // The component should generate href based on the name
    const links = screen.getAllByRole('link');
    // First link is "すべてのカテゴリーを見る", then category links
    expect(links[1]).toHaveAttribute(
      'href',
      '/categories/test-category-without-href'
    );
  });

  it('should use fallback # when href is undefined', async () => {
    // Create a mock category without href property
    const mockCategoryWithoutHref = {
      categories: [
        {
          id: 999,
          name: 'Test Category',
          description: 'Test Description',
          created_at: '2023-01-01T00:00:00.000Z',
          updated_at: '2023-01-01T00:00:00.000Z',
          // No href property
        },
      ],
    };

    // Mock successful fetch
    mockFetch.mockResolvedValue({
      ok: true,
      headers: {
        get: (name: string) =>
          name.toLowerCase() === 'content-type' ? 'application/json' : null,
      },
      text: () => Promise.resolve(JSON.stringify(mockCategoryWithoutHref)),
    });

    render(<Categories />);

    // Wait for the category to be displayed
    await waitFor(() => {
      expect(screen.getByText('Test Category')).toBeInTheDocument();
    });

    // The component should generate an href for the category
    // We can check the href attribute to see if it's using a generated href
    const links = screen.getAllByRole('link');
    // First link is "すべてのカテゴリーを見る", then category links
    expect(links[1]).toHaveAttribute('href', '/categories/test-category');

    // Now let's create a test that will trigger the fallback
    // We'll create a category with an undefined href property
    const mockCategoryWithUndefinedHref = {
      categories: [
        {
          id: 999,
          name: 'Test Category',
          description: 'Test Description',
          created_at: '2023-01-01T00:00:00.000Z',
          updated_at: '2023-01-01T00:00:00.000Z',
          href: null, // Use null instead of undefined for JSON serialization
        },
      ],
    };

    // Mock successful fetch
    mockFetch.mockResolvedValue({
      ok: true,
      headers: {
        get: (name: string) =>
          name.toLowerCase() === 'content-type' ? 'application/json' : null,
      },
      text: () =>
        Promise.resolve(JSON.stringify(mockCategoryWithUndefinedHref)),
    });

    // Re-render the component
    const { unmount } = render(<Categories />);
    unmount(); // Unmount the previous render
    render(<Categories />);

    // Wait for the category to be displayed
    await waitFor(() => {
      expect(screen.getByText('Test Category')).toBeInTheDocument();
    });

    // Now the component should use the fallback '#'
    // We can check if the component correctly identified this as a category with null href
    expect(screen.getByTestId('category-with-null-href')).toBeInTheDocument();

    // Now check the href attribute
    expect(screen.getByTestId('category-with-null-href')).toHaveAttribute(
      'href',
      '#'
    );
  });

  it('should generate correct slugs from category names', async () => {
    // Mock successful fetch
    mockFetch.mockResolvedValue({
      ok: true,
      headers: {
        get: (name: string) =>
          name.toLowerCase() === 'content-type' ? 'application/json' : null,
      },
      text: () => Promise.resolve(JSON.stringify(mockCategories)),
    });

    render(<Categories />);

    // Wait for categories to be displayed
    await waitFor(() => {
      expect(screen.getByText('Test Category 1')).toBeInTheDocument();
    });

    // Check if links have correct hrefs with slugs
    const links = screen.getAllByRole('link');
    // First link is "すべてのカテゴリーを見る", then category links
    expect(links[1]).toHaveAttribute('href', '/categories/test-category-1');
    expect(links[2]).toHaveAttribute('href', '/categories/test-category-2');
    expect(links[3]).toHaveAttribute(
      'href',
      '/categories/test-category-with-spaces'
    );
  });
});
