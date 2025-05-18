import ProductForm from '@/features/admin/products/components/ProductForm';
import type { Product } from '@/features/admin/products/controllers';
import { productService } from '@/features/admin/products/services';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

// Mock the product service
vi.mock('@/features/admin/products/services', () => ({
  productService: {
    createProduct: vi.fn(),
  },
}));

describe('ProductForm Component', () => {
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
    render(
      <QueryClientProvider client={queryClient}>
        <ProductForm />
      </QueryClientProvider>
    );

    // Check if the component is defined
    expect(ProductForm).toBeDefined();
    expect(typeof ProductForm).toBe('function');

    // Check if form elements are rendered
    expect(
      screen.getByRole('heading', { name: '商品を追加' })
    ).toBeInTheDocument();
    expect(screen.getByLabelText('商品名')).toBeInTheDocument();
    expect(screen.getByLabelText('説明')).toBeInTheDocument();
    expect(screen.getByLabelText('価格')).toBeInTheDocument();
    expect(screen.getByLabelText('在庫数')).toBeInTheDocument();
    expect(screen.getByLabelText('画像URL')).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: '商品を追加' })
    ).toBeInTheDocument();
  });

  it('should update form values when inputs change', () => {
    render(
      <QueryClientProvider client={queryClient}>
        <ProductForm />
      </QueryClientProvider>
    );

    // Get form inputs
    const nameInput = screen.getByLabelText('商品名');
    const descriptionInput = screen.getByLabelText('説明');
    const priceInput = screen.getByLabelText('価格');
    const stockInput = screen.getByLabelText('在庫数');
    const imageUrlInput = screen.getByLabelText('画像URL');

    // Change input values
    fireEvent.change(nameInput, { target: { value: 'Test Product' } });
    fireEvent.change(descriptionInput, {
      target: { value: 'Test Description' },
    });
    fireEvent.change(priceInput, { target: { value: '1000' } });
    fireEvent.change(stockInput, { target: { value: '10' } });
    fireEvent.change(imageUrlInput, {
      target: { value: 'https://example.com/image.jpg' },
    });

    // Check if input values are updated
    expect(nameInput).toHaveValue('Test Product');
    expect(descriptionInput).toHaveValue('Test Description');
    expect(priceInput).toHaveValue(1000);
    expect(stockInput).toHaveValue(10);
    expect(imageUrlInput).toHaveValue('https://example.com/image.jpg');
  });

  it('should submit the form and create a product', async () => {
    // Mock successful product creation
    const createdProduct: Product = {
      id: 1,
      name: 'Test Product',
      description: 'Test Description',
      price: 1000,
      stock: 10,
      image_url: 'https://example.com/image.jpg',
      created_at: '2023-01-01T00:00:00Z',
      updated_at: '2023-01-01T00:00:00Z',
    };

    vi.mocked(productService.createProduct).mockResolvedValue(createdProduct);

    render(
      <QueryClientProvider client={queryClient}>
        <ProductForm />
      </QueryClientProvider>
    );

    // Get form inputs
    const nameInput = screen.getByLabelText('商品名');
    const descriptionInput = screen.getByLabelText('説明');
    const priceInput = screen.getByLabelText('価格');
    const stockInput = screen.getByLabelText('在庫数');
    const imageUrlInput = screen.getByLabelText('画像URL');
    const submitButton = screen.getByRole('button', { name: '商品を追加' });

    // Fill the form
    fireEvent.change(nameInput, { target: { value: 'Test Product' } });
    fireEvent.change(descriptionInput, {
      target: { value: 'Test Description' },
    });
    fireEvent.change(priceInput, { target: { value: '1000' } });
    fireEvent.change(stockInput, { target: { value: '10' } });
    fireEvent.change(imageUrlInput, {
      target: { value: 'https://example.com/image.jpg' },
    });

    // Submit the form
    fireEvent.click(submitButton);

    // Check if createProduct was called with correct data
    await waitFor(() => {
      expect(productService.createProduct).toHaveBeenCalledWith({
        name: 'Test Product',
        description: 'Test Description',
        price: 1000,
        stock: 10,
        image_url: 'https://example.com/image.jpg',
      });
    });

    // Check if form was reset after successful submission
    await waitFor(() => {
      expect(nameInput).toHaveValue('');
      expect(descriptionInput).toHaveValue('');
      expect(priceInput).toHaveValue(null);
      expect(stockInput).toHaveValue(null);
      expect(imageUrlInput).toHaveValue('');
    });
  });

  it('should show error message when product creation fails', async () => {
    // Mock failed product creation
    vi.mocked(productService.createProduct).mockRejectedValue(
      new Error('Failed to create product')
    );

    // Mock console.error to prevent test output pollution
    const consoleErrorSpy = vi
      .spyOn(console, 'error')
      .mockImplementation(() => {});

    render(
      <QueryClientProvider client={queryClient}>
        <ProductForm />
      </QueryClientProvider>
    );

    // Get form inputs
    const nameInput = screen.getByLabelText('商品名');
    const priceInput = screen.getByLabelText('価格');
    const stockInput = screen.getByLabelText('在庫数');
    const submitButton = screen.getByRole('button', { name: '商品を追加' });

    // Fill required fields
    fireEvent.change(nameInput, { target: { value: 'Test Product' } });
    fireEvent.change(priceInput, { target: { value: '1000' } });
    fireEvent.change(stockInput, { target: { value: '10' } });

    // Submit the form
    fireEvent.click(submitButton);

    // Check if error message is displayed
    await waitFor(() => {
      expect(screen.getByText('Failed to create product')).toBeInTheDocument();
    });

    // Form values should not be reset on error
    expect(nameInput).toHaveValue('Test Product');
    expect(priceInput).toHaveValue(1000);
    expect(stockInput).toHaveValue(10);

    // Clean up
    consoleErrorSpy.mockRestore();
  });

  it('should show submitting state during form submission', async () => {
    // Mock delayed product creation to show loading state
    vi.mocked(productService.createProduct).mockImplementation(
      () =>
        new Promise((resolve) => setTimeout(() => resolve({} as Product), 100))
    );

    render(
      <QueryClientProvider client={queryClient}>
        <ProductForm />
      </QueryClientProvider>
    );

    // Get form inputs
    const nameInput = screen.getByLabelText('商品名');
    const priceInput = screen.getByLabelText('価格');
    const stockInput = screen.getByLabelText('在庫数');
    const submitButton = screen.getByRole('button', { name: '商品を追加' });

    // Fill required fields
    fireEvent.change(nameInput, { target: { value: 'Test Product' } });
    fireEvent.change(priceInput, { target: { value: '1000' } });
    fireEvent.change(stockInput, { target: { value: '10' } });

    // Submit the form
    fireEvent.click(submitButton);

    // Check if button text changes to submitting state
    expect(screen.getByText('送信中...')).toBeInTheDocument();
    expect(submitButton).toBeDisabled();

    // Wait for submission to complete
    await waitFor(() => {
      expect(
        screen.getByRole('button', { name: '商品を追加' })
      ).toBeInTheDocument();
      expect(submitButton).not.toBeDisabled();
    });
  });

  it('should validate required fields', async () => {
    render(
      <QueryClientProvider client={queryClient}>
        <ProductForm />
      </QueryClientProvider>
    );

    // Get submit button
    const submitButton = screen.getByRole('button', { name: '商品を追加' });

    // Submit the form without filling required fields
    fireEvent.click(submitButton);

    // Check if HTML5 validation prevents submission
    expect(productService.createProduct).not.toHaveBeenCalled();
  });

  it('should handle numeric conversions correctly', async () => {
    // Mock successful product creation
    vi.mocked(productService.createProduct).mockResolvedValue({} as Product);

    render(
      <QueryClientProvider client={queryClient}>
        <ProductForm />
      </QueryClientProvider>
    );

    // Get form inputs
    const nameInput = screen.getByLabelText('商品名');
    const priceInput = screen.getByLabelText('価格');
    const stockInput = screen.getByLabelText('在庫数');
    const submitButton = screen.getByRole('button', { name: '商品を追加' });

    // Fill the form with string values that should be converted to numbers
    fireEvent.change(nameInput, { target: { value: 'Test Product' } });
    fireEvent.change(priceInput, { target: { value: '1000.50' } });
    fireEvent.change(stockInput, { target: { value: '10' } });

    // Submit the form
    fireEvent.click(submitButton);

    // Check if createProduct was called with correctly converted numeric values
    await waitFor(() => {
      expect(productService.createProduct).toHaveBeenCalledWith(
        expect.objectContaining({
          price: 1000.5, // Should be converted to a float
          stock: 10, // Should be converted to an integer
        })
      );
    });
  });
});
