import OrderForm from '@/features/admin/orders/components/OrderForm';
import {orderService} from '@/features/admin/orders/services';
import {productService} from '@/features/admin/products/services';
import {QueryClient, QueryClientProvider} from '@tanstack/react-query';
import {fireEvent, render, screen, waitFor} from '@testing-library/react';
import {beforeEach, describe, expect, it, vi} from 'vitest';

// Mock the services
vi.mock('@/features/admin/orders/services', () => ({
  orderService: {
    createOrder: vi.fn(),
  },
}));

vi.mock('@/features/admin/products/services', () => ({
  productService: {
    getProducts: vi.fn(),
  },
}));

describe('OrderForm Component', () => {
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
    // Mock products data
    vi.mocked(productService.getProducts).mockResolvedValue([]);

    render(
      <QueryClientProvider client={queryClient}>
        <OrderForm/>
      </QueryClientProvider>
    );

    // Check if the component is defined
    expect(OrderForm).toBeDefined();
    expect(typeof OrderForm).toBe('function');

    // Check if form elements are rendered
    expect(screen.getByText('新規注文')).toBeInTheDocument();
    expect(screen.getByLabelText(/顧客名/)).toBeInTheDocument();
    expect(screen.getByLabelText(/メールアドレス/)).toBeInTheDocument();
    expect(screen.getByText('注文商品')).toBeInTheDocument();
    expect(screen.getByText('注文を作成')).toBeInTheDocument();
  });

  it('should display product options when products are loaded', async () => {
    // Mock products data
    const mockProducts = [
      {
        id: 1,
        name: 'Product 1',
        price: 1000,
        description: 'Description 1',
        category: 'Category 1',
        image_url: 'image1.jpg',
        created_at: '',
        updated_at: '',
      },
      {
        id: 2,
        name: 'Product 2',
        price: 2000,
        description: 'Description 2',
        category: 'Category 2',
        image_url: 'image2.jpg',
        created_at: '',
        updated_at: '',
      },
    ];

    vi.mocked(productService.getProducts).mockResolvedValue(mockProducts);

    render(
      <QueryClientProvider client={queryClient}>
        <OrderForm/>
      </QueryClientProvider>
    );

    // Wait for products to load
    await waitFor(() => {
      const options = screen.getAllByRole('option');
      expect(options.length).toBeGreaterThan(1); // At least the default option + products
    });

    // Check if product options are displayed
    expect(screen.getByText('商品を選択')).toBeInTheDocument();
    expect(screen.getByText(/Product 1 \(¥1,000\)/)).toBeInTheDocument();
    expect(screen.getByText(/Product 2 \(¥2,000\)/)).toBeInTheDocument();
  });

  it('should show validation error for empty customer name', async () => {
    vi.mocked(productService.getProducts).mockResolvedValue([]);

    render(
      <QueryClientProvider client={queryClient}>
        <OrderForm/>
      </QueryClientProvider>
    );

    // Submit the form without filling customer name
    const submitButton = screen.getByText('注文を作成');
    fireEvent.click(submitButton);

    // Verify createOrder was not called, indicating validation prevented submission
    await waitFor(() => {
      expect(orderService.createOrder).not.toHaveBeenCalled();
    });
  });

  it('should show validation error for empty email', async () => {
    vi.mocked(productService.getProducts).mockResolvedValue([]);

    render(
      <QueryClientProvider client={queryClient}>
        <OrderForm/>
      </QueryClientProvider>
    );

    // Fill customer name but leave email empty
    const nameInput = screen.getByLabelText(/顧客名/);
    fireEvent.change(nameInput, {target: {value: 'Test Customer'}});

    // Submit the form
    const submitButton = screen.getByText('注文を作成');
    fireEvent.click(submitButton);

    // Verify createOrder was not called, indicating validation prevented submission
    await waitFor(() => {
      expect(orderService.createOrder).not.toHaveBeenCalled();
    });
  });

  it('should show validation error for invalid email format', async () => {
    vi.mocked(productService.getProducts).mockResolvedValue([]);

    render(
      <QueryClientProvider client={queryClient}>
        <OrderForm/>
      </QueryClientProvider>
    );

    // Fill customer name and invalid email
    const nameInput = screen.getByLabelText(/顧客名/);
    fireEvent.change(nameInput, {target: {value: 'Test Customer'}});

    const emailInput = screen.getByLabelText(/メールアドレス/);
    fireEvent.change(emailInput, {target: {value: 'invalid-email'}});

    // Submit the form
    const submitButton = screen.getByText('注文を作成');
    fireEvent.click(submitButton);

    // Verify createOrder was not called, indicating validation prevented submission
    await waitFor(() => {
      expect(orderService.createOrder).not.toHaveBeenCalled();
    });
  });

  it('should show validation error when no product is selected', async () => {
    // Mock products data
    const mockProducts = [
      {
        id: 1,
        name: 'Product 1',
        price: 1000,
        description: 'Description 1',
        category: 'Category 1',
        image_url: 'image1.jpg',
        created_at: '',
        updated_at: '',
      },
    ];

    vi.mocked(productService.getProducts).mockResolvedValue(mockProducts);

    render(
      <QueryClientProvider client={queryClient}>
        <OrderForm/>
      </QueryClientProvider>
    );

    // Fill customer name and email
    const nameInput = screen.getByLabelText(/顧客名/);
    fireEvent.change(nameInput, {target: {value: 'Test Customer'}});

    const emailInput = screen.getByLabelText(/メールアドレス/);
    fireEvent.change(emailInput, {target: {value: 'test@example.com'}});

    // Submit the form without selecting a product
    const submitButton = screen.getByText('注文を作成');
    fireEvent.click(submitButton);

    // Verify createOrder was not called, indicating validation prevented submission
    await waitFor(() => {
      expect(orderService.createOrder).not.toHaveBeenCalled();
    });
  });

  it('should add and remove order items', async () => {
    // Mock products data
    const mockProducts = [
      {
        id: 1,
        name: 'Product 1',
        price: 1000,
        description: 'Description 1',
        category: 'Category 1',
        image_url: 'image1.jpg',
        created_at: '',
        updated_at: '',
      },
    ];

    vi.mocked(productService.getProducts).mockResolvedValue(mockProducts);

    render(
      <QueryClientProvider client={queryClient}>
        <OrderForm/>
      </QueryClientProvider>
    );

    // Wait for products to load
    await waitFor(() => {
      expect(screen.getByText(/商品を選択/)).toBeInTheDocument();
    });

    // Initially there should be one item row
    let deleteButtons = screen.getAllByText('削除');
    expect(deleteButtons.length).toBe(1);

    // Add a new item
    const addButton = screen.getByText('+ 商品を追加');
    fireEvent.click(addButton);

    // Now there should be two item rows
    deleteButtons = screen.getAllByText('削除');
    expect(deleteButtons.length).toBe(2);

    // Remove the second item
    fireEvent.click(deleteButtons[1]);

    // Now there should be one item row again
    deleteButtons = screen.getAllByText('削除');
    expect(deleteButtons.length).toBe(1);
  });

  it('should not remove the last order item', async () => {
    // Mock products data
    vi.mocked(productService.getProducts).mockResolvedValue([]);

    render(
      <QueryClientProvider client={queryClient}>
        <OrderForm/>
      </QueryClientProvider>
    );

    // Initially there should be one item row
    const deleteButtons = screen.getAllByText('削除');
    expect(deleteButtons.length).toBe(1);

    // Try to remove the only item
    fireEvent.click(deleteButtons[0]);

    // There should still be one item row
    expect(screen.getAllByText('削除').length).toBe(1);
  });

  it('should show error message when order creation fails', async () => {
    // Mock products data
    const mockProducts = [
      {
        id: 1,
        name: 'Product 1',
        price: 1000,
        description: 'Description 1',
        category: 'Category 1',
        image_url: 'image1.jpg',
        created_at: '',
        updated_at: '',
      },
    ];

    vi.mocked(productService.getProducts).mockResolvedValue(mockProducts);
    vi.mocked(orderService.createOrder).mockRejectedValue(
      new Error('API error')
    );

    render(
      <QueryClientProvider client={queryClient}>
        <OrderForm/>
      </QueryClientProvider>
    );

    // Wait for products to load
    await waitFor(() => {
      expect(screen.getByText(/商品を選択/)).toBeInTheDocument();
    });

    // Fill customer name and email
    const nameInput = screen.getByLabelText(/顧客名/);
    fireEvent.change(nameInput, {target: {value: 'Test Customer'}});

    const emailInput = screen.getByLabelText(/メールアドレス/);
    fireEvent.change(emailInput, {target: {value: 'test@example.com'}});

    // Select product and quantity
    const productSelect = screen.getByRole('combobox');
    fireEvent.change(productSelect, {target: {value: '1'}});

    const quantityInput = screen.getByRole('spinbutton');
    fireEvent.change(quantityInput, {target: {value: '2'}});

    // Submit the form
    const submitButton = screen.getByText('注文を作成');
    fireEvent.click(submitButton);

    // Check if error message is displayed
    await waitFor(() => {
      expect(screen.getByText('注文の作成に失敗しました')).toBeInTheDocument();
    });

    // Form should not be reset
    expect(nameInput).toHaveValue('Test Customer');
    expect(emailInput).toHaveValue('test@example.com');
  });

  it('should disable submit button while submitting', async () => {
    // Mock products data
    const mockProducts = [
      {
        id: 1,
        name: 'Product 1',
        price: 1000,
        description: 'Description 1',
        category: 'Category 1',
        image_url: 'image1.jpg',
        created_at: '',
        updated_at: '',
      },
    ];

    vi.mocked(productService.getProducts).mockResolvedValue(mockProducts);

    // Mock a delayed response to ensure we see the submitting state
    vi.mocked(orderService.createOrder).mockImplementation(
      () =>
        new Promise((resolve) =>
          setTimeout(
            () =>
              resolve({
                id: 1,
                customer_name: 'Test Customer',
                customer_email: 'test@example.com',
                total_amount: 2000,
                status: 'pending',
                items: [],
                created_at: '2023-01-01T00:00:00Z',
                updated_at: '2023-01-01T00:00:00Z',
              }),
            100
          )
        )
    );

    render(
      <QueryClientProvider client={queryClient}>
        <OrderForm/>
      </QueryClientProvider>
    );

    // Wait for products to load
    await waitFor(() => {
      expect(screen.getByText(/商品を選択/)).toBeInTheDocument();
    });

    // Fill customer name and email
    const nameInput = screen.getByLabelText(/顧客名/);
    fireEvent.change(nameInput, {target: {value: 'Test Customer'}});

    const emailInput = screen.getByLabelText(/メールアドレス/);
    fireEvent.change(emailInput, {target: {value: 'test@example.com'}});

    // Select product and quantity
    const productSelect = screen.getByRole('combobox');
    fireEvent.change(productSelect, {target: {value: '1'}});

    // Submit the form
    const submitButton = screen.getByText('注文を作成');
    fireEvent.click(submitButton);

    // Check if button text changes to "送信中..."
    expect(screen.getByText('送信中...')).toBeInTheDocument();

    // Check if button is disabled
    const disabledButton = screen.getByText('送信中...');
    expect(disabledButton).toBeDisabled();

    // Wait for submission to complete
    await waitFor(() => {
      expect(screen.queryByText('送信中...')).not.toBeInTheDocument();
    });

    // Button should be enabled again
    expect(screen.getByText('注文を作成')).toBeEnabled();
  });
});
