import ProductList from '@/features/admin/products/components/ProductList';
import type { Product } from '@/features/admin/products/controllers';
import { productService } from '@/features/admin/products/services';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

// Mock the product service
vi.mock('@/features/admin/products/services', () => ({
  productService: {
    getProducts: vi.fn(),
    updateProduct: vi.fn(),
    deleteProduct: vi.fn(),
  },
}));

// Mock the confirm function
vi.spyOn(window, 'confirm').mockImplementation(() => true);

// Mock the Next.js Link component
vi.mock('next/link', () => ({
  default: ({
    children,
    href,
  }: { children: React.ReactNode; href: string }) => (
    <a href={href} data-testid="next-link">
      {children}
    </a>
  ),
}));

describe('ProductList Component', () => {
  let queryClient: QueryClient;

  beforeEach(() => {
    queryClient = new QueryClient({
      defaultOptions: {
        queries: {
          retry: false,
        },
      },
    });
    vi.clearAllMocks();
  });

  it('should render the component', () => {
    // Mock successful response with empty array
    vi.mocked(productService.getProducts).mockResolvedValue([]);

    render(
      <QueryClientProvider client={queryClient}>
        <ProductList />
      </QueryClientProvider>
    );

    // Check if the component is defined
    expect(ProductList).toBeDefined();
    expect(typeof ProductList).toBe('function');
  });

  it('should show loading state initially', () => {
    // Mock a delayed response to ensure we see the loading state
    vi.mocked(productService.getProducts).mockImplementation(
      () => new Promise((resolve) => setTimeout(() => resolve([]), 100))
    );

    render(
      <QueryClientProvider client={queryClient}>
        <ProductList />
      </QueryClientProvider>
    );

    expect(screen.getByText('読み込み中...')).toBeInTheDocument();
  });

  it('should show error state when API call fails', async () => {
    // Mock a failed response
    vi.mocked(productService.getProducts).mockRejectedValue(
      new Error('API error')
    );

    render(
      <QueryClientProvider client={queryClient}>
        <ProductList />
      </QueryClientProvider>
    );

    // Wait for the error message to appear
    await waitFor(() => {
      expect(screen.getByText('エラーが発生しました')).toBeInTheDocument();
    });
  });

  it('should show empty state when no products are available', async () => {
    // Mock successful response with empty array
    vi.mocked(productService.getProducts).mockResolvedValue([]);

    render(
      <QueryClientProvider client={queryClient}>
        <ProductList />
      </QueryClientProvider>
    );

    // Wait for the component to finish loading
    await waitFor(() => {
      expect(screen.queryByText('読み込み中...')).not.toBeInTheDocument();
    });

    expect(screen.getByText('商品がありません')).toBeInTheDocument();
  });

  it('should display product list when data is available', async () => {
    // Mock product data
    const mockProducts: Product[] = [
      {
        id: 1,
        name: 'Test Product 1',
        description: 'Description 1',
        price: 1000,
        stock: 10,
        image_url: 'https://example.com/image1.jpg',
        created_at: '2023-01-01T00:00:00Z',
        updated_at: '2023-01-02T00:00:00Z',
      },
      {
        id: 2,
        name: 'Test Product 2',
        description: 'Description 2',
        price: 2000,
        stock: 20,
        image_url: null,
        created_at: '2023-01-03T00:00:00Z',
        updated_at: '2023-01-04T00:00:00Z',
      },
    ];

    vi.mocked(productService.getProducts).mockResolvedValue(mockProducts);

    render(
      <QueryClientProvider client={queryClient}>
        <ProductList />
      </QueryClientProvider>
    );

    // Wait for the component to finish loading
    await waitFor(() => {
      expect(screen.queryByText('読み込み中...')).not.toBeInTheDocument();
    });

    expect(screen.getByText('Test Product 1')).toBeInTheDocument();
    expect(screen.getByText('Test Product 2')).toBeInTheDocument();
    expect(screen.getByText('¥1,000')).toBeInTheDocument();
    expect(screen.getByText('¥2,000')).toBeInTheDocument();
    expect(screen.getByText('10')).toBeInTheDocument();
    expect(screen.getByText('20')).toBeInTheDocument();
  });

  it('should toggle product details when expand button is clicked', async () => {
    // Mock product data
    const mockProducts: Product[] = [
      {
        id: 1,
        name: 'Test Product 1',
        description: 'Description 1',
        price: 1000,
        stock: 10,
        image_url: 'https://example.com/image1.jpg',
        created_at: '2023-01-01T00:00:00Z',
        updated_at: '2023-01-02T00:00:00Z',
      },
    ];

    vi.mocked(productService.getProducts).mockResolvedValue(mockProducts);

    render(
      <QueryClientProvider client={queryClient}>
        <ProductList />
      </QueryClientProvider>
    );

    // Wait for the component to finish loading
    await waitFor(() => {
      expect(screen.queryByText('読み込み中...')).not.toBeInTheDocument();
    });

    // Initially, the details should not be visible
    expect(screen.queryByText('商品詳細')).not.toBeInTheDocument();

    // Find and click the expand button
    const buttons = screen.getAllByRole('button');
    // The expand button is the first button in each row
    const expandButton = buttons[0];
    fireEvent.click(expandButton);

    // Now the details should be visible
    expect(screen.getByText('商品詳細')).toBeInTheDocument();
    expect(screen.getByText('説明:')).toBeInTheDocument();
    expect(screen.getByText('Description 1')).toBeInTheDocument();
    expect(screen.getByText('画像URL:')).toBeInTheDocument();
    expect(
      screen.getByText('https://example.com/image1.jpg')
    ).toBeInTheDocument();

    // Click again to collapse
    fireEvent.click(expandButton!);

    // Details should be hidden again
    expect(screen.queryByText('商品詳細')).not.toBeInTheDocument();
  });

  it('should enter edit mode when edit button is clicked', async () => {
    // Mock product data
    const mockProducts: Product[] = [
      {
        id: 1,
        name: 'Test Product 1',
        description: 'Description 1',
        price: 1000,
        stock: 10,
        image_url: 'https://example.com/image1.jpg',
        created_at: '2023-01-01T00:00:00Z',
        updated_at: '2023-01-02T00:00:00Z',
      },
    ];

    vi.mocked(productService.getProducts).mockResolvedValue(mockProducts);

    render(
      <QueryClientProvider client={queryClient}>
        <ProductList />
      </QueryClientProvider>
    );

    // Wait for the component to finish loading
    await waitFor(() => {
      expect(screen.queryByText('読み込み中...')).not.toBeInTheDocument();
    });

    // Find and click the edit button
    const editButton = screen.getByText('編集');
    fireEvent.click(editButton);

    // Check if edit form inputs are displayed
    const nameInput = screen.getByDisplayValue('Test Product 1');
    const priceInput = screen.getByDisplayValue('1000');
    const stockInput = screen.getByDisplayValue('10');

    expect(nameInput).toBeInTheDocument();
    expect(priceInput).toBeInTheDocument();
    expect(stockInput).toBeInTheDocument();

    // Check if save and cancel buttons are displayed
    expect(screen.getByText('保存')).toBeInTheDocument();
    expect(screen.getByText('キャンセル')).toBeInTheDocument();
  });

  it('should update product when save button is clicked', async () => {
    // Mock product data
    const mockProducts: Product[] = [
      {
        id: 1,
        name: 'Test Product 1',
        description: 'Description 1',
        price: 1000,
        stock: 10,
        image_url: 'https://example.com/image1.jpg',
        created_at: '2023-01-01T00:00:00Z',
        updated_at: '2023-01-02T00:00:00Z',
      },
    ];

    const updatedProduct: Product = {
      ...mockProducts[0],
      name: 'Updated Product',
      price: 1500,
      stock: 15,
    };

    vi.mocked(productService.getProducts).mockResolvedValue(mockProducts);
    vi.mocked(productService.updateProduct).mockResolvedValue(updatedProduct);

    render(
      <QueryClientProvider client={queryClient}>
        <ProductList />
      </QueryClientProvider>
    );

    // Wait for the component to finish loading
    await waitFor(() => {
      expect(screen.queryByText('読み込み中...')).not.toBeInTheDocument();
    });

    // Find and click the edit button
    const editButton = screen.getByText('編集');
    fireEvent.click(editButton);

    // Update form values
    const nameInput = screen.getByDisplayValue('Test Product 1');
    const priceInput = screen.getByDisplayValue('1000');
    const stockInput = screen.getByDisplayValue('10');

    fireEvent.change(nameInput, { target: { value: 'Updated Product' } });
    fireEvent.change(priceInput, { target: { value: '1500' } });
    fireEvent.change(stockInput, { target: { value: '15' } });

    // Click save button
    const saveButton = screen.getByText('保存');
    fireEvent.click(saveButton);

    // Check if updateProduct was called with correct data
    await waitFor(() => {
      expect(productService.updateProduct).toHaveBeenCalledWith(1, {
        name: 'Updated Product',
        description: 'Description 1',
        price: 1500,
        stock: 15,
        image_url: 'https://example.com/image1.jpg',
      });
    });
  });

  it('should cancel edit when cancel button is clicked', async () => {
    // Mock product data
    const mockProducts: Product[] = [
      {
        id: 1,
        name: 'Test Product 1',
        description: 'Description 1',
        price: 1000,
        stock: 10,
        image_url: 'https://example.com/image1.jpg',
        created_at: '2023-01-01T00:00:00Z',
        updated_at: '2023-01-02T00:00:00Z',
      },
    ];

    vi.mocked(productService.getProducts).mockResolvedValue(mockProducts);

    render(
      <QueryClientProvider client={queryClient}>
        <ProductList />
      </QueryClientProvider>
    );

    // Wait for the component to finish loading
    await waitFor(() => {
      expect(screen.queryByText('読み込み中...')).not.toBeInTheDocument();
    });

    // Find and click the edit button
    const editButton = screen.getByText('編集');
    fireEvent.click(editButton);

    // Update form values
    const nameInput = screen.getByDisplayValue('Test Product 1');
    fireEvent.change(nameInput, { target: { value: 'Updated Product' } });

    // Click cancel button
    const cancelButton = screen.getByText('キャンセル');
    fireEvent.click(cancelButton);

    // Check if we're back to view mode
    expect(screen.getByText('Test Product 1')).toBeInTheDocument();
    expect(
      screen.queryByDisplayValue('Updated Product')
    ).not.toBeInTheDocument();
    expect(screen.getByText('編集')).toBeInTheDocument();
  });

  it('should delete product when delete button is clicked', async () => {
    // Mock product data
    const mockProducts: Product[] = [
      {
        id: 1,
        name: 'Test Product 1',
        description: 'Description 1',
        price: 1000,
        stock: 10,
        image_url: 'https://example.com/image1.jpg',
        created_at: '2023-01-01T00:00:00Z',
        updated_at: '2023-01-02T00:00:00Z',
      },
    ];

    vi.mocked(productService.getProducts).mockResolvedValue(mockProducts);
    vi.mocked(productService.deleteProduct).mockResolvedValue();

    render(
      <QueryClientProvider client={queryClient}>
        <ProductList />
      </QueryClientProvider>
    );

    // Wait for the component to finish loading
    await waitFor(() => {
      expect(screen.queryByText('読み込み中...')).not.toBeInTheDocument();
    });

    // Find and click the delete button
    const deleteButton = screen.getByText('削除');
    fireEvent.click(deleteButton);

    // Check if deleteProduct was called with correct id
    await waitFor(() => {
      expect(productService.deleteProduct).toHaveBeenCalledWith(1);
    });
  });

  it('should handle error when updating product fails', async () => {
    // Mock product data
    const mockProducts: Product[] = [
      {
        id: 1,
        name: 'Test Product 1',
        description: 'Description 1',
        price: 1000,
        stock: 10,
        image_url: 'https://example.com/image1.jpg',
        created_at: '2023-01-01T00:00:00Z',
        updated_at: '2023-01-02T00:00:00Z',
      },
    ];

    vi.mocked(productService.getProducts).mockResolvedValue(mockProducts);
    vi.mocked(productService.updateProduct).mockRejectedValue(
      new Error('Update failed')
    );

    // Mock console.error to prevent test output pollution
    const consoleErrorSpy = vi
      .spyOn(console, 'error')
      .mockImplementation(() => {});
    const alertMock = vi.fn();
    window.alert = alertMock;

    render(
      <QueryClientProvider client={queryClient}>
        <ProductList />
      </QueryClientProvider>
    );

    // Wait for the component to finish loading
    await waitFor(() => {
      expect(screen.queryByText('読み込み中...')).not.toBeInTheDocument();
    });

    // Find and click the edit button
    const editButton = screen.getByText('編集');
    fireEvent.click(editButton);

    // Click save button
    const saveButton = screen.getByText('保存');
    fireEvent.click(saveButton);

    // Check if alert was called with error message
    await waitFor(() => {
      expect(alertMock).toHaveBeenCalledWith('商品の更新に失敗しました');
    });

    // Clean up
    consoleErrorSpy.mockRestore();
  });

  it('should handle error when deleting product fails', async () => {
    // Mock product data
    const mockProducts: Product[] = [
      {
        id: 1,
        name: 'Test Product 1',
        description: 'Description 1',
        price: 1000,
        stock: 10,
        image_url: 'https://example.com/image1.jpg',
        created_at: '2023-01-01T00:00:00Z',
        updated_at: '2023-01-02T00:00:00Z',
      },
    ];

    vi.mocked(productService.getProducts).mockResolvedValue(mockProducts);
    vi.mocked(productService.deleteProduct).mockRejectedValue(
      new Error('Delete failed')
    );

    // Mock console.error to prevent test output pollution
    const consoleErrorSpy = vi
      .spyOn(console, 'error')
      .mockImplementation(() => {});
    const alertMock = vi.fn();
    window.alert = alertMock;

    render(
      <QueryClientProvider client={queryClient}>
        <ProductList />
      </QueryClientProvider>
    );

    // Wait for the component to finish loading
    await waitFor(() => {
      expect(screen.queryByText('読み込み中...')).not.toBeInTheDocument();
    });

    // Find and click the delete button
    const deleteButton = screen.getByText('削除');
    fireEvent.click(deleteButton);

    // Check if alert was called with error message
    await waitFor(() => {
      expect(alertMock).toHaveBeenCalledWith('商品の削除に失敗しました');
    });

    // Clean up
    consoleErrorSpy.mockRestore();
  });
});
