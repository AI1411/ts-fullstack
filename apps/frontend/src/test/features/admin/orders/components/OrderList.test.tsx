import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import OrderList from '@/features/admin/orders/components/OrderList';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { orderService } from '@/features/admin/orders/services';
import { Order } from '@/features/admin/orders/controllers';

// Mock the order service
vi.mock('@/features/admin/orders/services', () => ({
  orderService: {
    getOrders: vi.fn(),
    updateOrderStatus: vi.fn(),
    deleteOrder: vi.fn()
  }
}));

describe('OrderList Component', () => {
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
    vi.mocked(orderService.getOrders).mockResolvedValue([]);

    render(
      <QueryClientProvider client={queryClient}>
        <OrderList />
      </QueryClientProvider>
    );

    // Check if the component is defined
    expect(OrderList).toBeDefined();
    expect(typeof OrderList).toBe('function');
  });

  it('should show loading state initially', () => {
    // Mock a delayed response to ensure we see the loading state
    vi.mocked(orderService.getOrders).mockImplementation(
      () => new Promise(resolve => setTimeout(() => resolve([]), 100))
    );

    render(
      <QueryClientProvider client={queryClient}>
        <OrderList />
      </QueryClientProvider>
    );

    expect(screen.getByText('読み込み中...')).toBeInTheDocument();
  });

  it('should show error state when API call fails', async () => {
    // Mock a failed response
    vi.mocked(orderService.getOrders).mockRejectedValue(new Error('API error'));

    render(
      <QueryClientProvider client={queryClient}>
        <OrderList />
      </QueryClientProvider>
    );

    // Wait for the error message to appear
    await waitFor(() => {
      expect(screen.getByText('エラーが発生しました')).toBeInTheDocument();
    });
  });

  it('should show empty state when no orders are available', async () => {
    // Mock successful response with empty array
    vi.mocked(orderService.getOrders).mockResolvedValue([]);

    render(
      <QueryClientProvider client={queryClient}>
        <OrderList />
      </QueryClientProvider>
    );

    // Wait for the component to finish loading
    await waitFor(() => {
      expect(screen.queryByText('読み込み中...')).not.toBeInTheDocument();
    });

    expect(screen.getByText('注文がありません')).toBeInTheDocument();
  });

  it('should display order list when data is available', async () => {
    // Mock order data
    const mockOrders: Order[] = [
      {
        id: 1,
        customer_name: 'Test Customer 1',
        customer_email: 'customer1@example.com',
        total_amount: 5000,
        status: 'pending',
        items: [
          {
            id: 1,
            order_id: 1,
            product_id: 1,
            product_name: 'Product 1',
            quantity: 2,
            price: 2500
          }
        ],
        created_at: '2023-01-01T00:00:00Z',
        updated_at: '2023-01-01T00:00:00Z'
      },
      {
        id: 2,
        customer_name: 'Test Customer 2',
        customer_email: 'customer2@example.com',
        total_amount: 3000,
        status: 'completed',
        items: [
          {
            id: 2,
            order_id: 2,
            product_id: 2,
            product_name: 'Product 2',
            quantity: 1,
            price: 3000
          }
        ],
        created_at: '2023-01-02T00:00:00Z',
        updated_at: '2023-01-02T00:00:00Z'
      }
    ];

    vi.mocked(orderService.getOrders).mockResolvedValue(mockOrders);

    render(
      <QueryClientProvider client={queryClient}>
        <OrderList />
      </QueryClientProvider>
    );

    // Wait for the component to finish loading
    await waitFor(() => {
      expect(screen.queryByText('読み込み中...')).not.toBeInTheDocument();
    });

    // Check if customer names are displayed
    expect(screen.getByText('Test Customer 1')).toBeInTheDocument();
    expect(screen.getByText('Test Customer 2')).toBeInTheDocument();

    // Check if amounts are displayed
    expect(screen.getByText('¥5,000')).toBeInTheDocument();
    expect(screen.getByText('¥3,000')).toBeInTheDocument();

    // Check if statuses are displayed
    expect(screen.getAllByText('保留中').length).toBeGreaterThan(0);
    expect(screen.getAllByText('完了').length).toBeGreaterThan(0);
  });

  it('should toggle order details when expand button is clicked', async () => {
    // Mock order data with items
    const mockOrders: Order[] = [
      {
        id: 1,
        customer_name: 'Test Customer',
        customer_email: 'customer@example.com',
        total_amount: 5000,
        status: 'pending',
        items: [
          {
            id: 1,
            order_id: 1,
            product_id: 1,
            product_name: 'Product 1',
            quantity: 2,
            price: 2500
          }
        ],
        created_at: '2023-01-01T00:00:00Z',
        updated_at: '2023-01-01T00:00:00Z'
      }
    ];

    vi.mocked(orderService.getOrders).mockResolvedValue(mockOrders);

    render(
      <QueryClientProvider client={queryClient}>
        <OrderList />
      </QueryClientProvider>
    );

    // Wait for the component to finish loading
    await waitFor(() => {
      expect(screen.queryByText('読み込み中...')).not.toBeInTheDocument();
    });

    // Initially, order details should not be visible
    expect(screen.queryByText('注文詳細')).not.toBeInTheDocument();

    // Find and click the expand button
    const expandButtons = screen.getAllByRole('button');
    const expandButton = expandButtons.find(button => 
      button.parentElement?.classList.contains('flex') && 
      button.parentElement?.classList.contains('items-center')
    );

    if (expandButton) {
      fireEvent.click(expandButton);
    }

    // After clicking, order details should be visible
    expect(screen.getByText('注文詳細')).toBeInTheDocument();
    expect(screen.getByText('顧客メール:')).toBeInTheDocument();
    expect(screen.getByText('customer@example.com')).toBeInTheDocument();
    expect(screen.getByText('Product 1')).toBeInTheDocument();

    // Click again to collapse
    if (expandButton) {
      fireEvent.click(expandButton);
    }

    // After clicking again, order details should not be visible
    await waitFor(() => {
      expect(screen.queryByText('注文詳細')).not.toBeInTheDocument();
    });
  });

  it('should call updateOrderStatus when status is changed', async () => {
    // Mock order data
    const mockOrders: Order[] = [
      {
        id: 1,
        customer_name: 'Test Customer',
        customer_email: 'customer@example.com',
        total_amount: 5000,
        status: 'pending',
        items: [],
        created_at: '2023-01-01T00:00:00Z',
        updated_at: '2023-01-01T00:00:00Z'
      }
    ];

    vi.mocked(orderService.getOrders).mockResolvedValue(mockOrders);
    vi.mocked(orderService.updateOrderStatus).mockResolvedValue({...mockOrders[0], status: 'completed'});

    render(
      <QueryClientProvider client={queryClient}>
        <OrderList />
      </QueryClientProvider>
    );

    // Wait for the component to finish loading
    await waitFor(() => {
      expect(screen.queryByText('読み込み中...')).not.toBeInTheDocument();
    });

    // Find the status select element and change its value
    const statusSelect = screen.getByRole('combobox');
    fireEvent.change(statusSelect, { target: { value: 'completed' } });

    // Check if updateOrderStatus was called with correct arguments
    await waitFor(() => {
      expect(orderService.updateOrderStatus).toHaveBeenCalledWith(1, 'completed');
    });
  });

  it('should call deleteOrder when delete button is clicked and confirmed', async () => {
    // Mock order data
    const mockOrders: Order[] = [
      {
        id: 1,
        customer_name: 'Test Customer',
        customer_email: 'customer@example.com',
        total_amount: 5000,
        status: 'pending',
        items: [],
        created_at: '2023-01-01T00:00:00Z',
        updated_at: '2023-01-01T00:00:00Z'
      }
    ];

    vi.mocked(orderService.getOrders).mockResolvedValue(mockOrders);
    vi.mocked(orderService.deleteOrder).mockResolvedValue(undefined);

    // Mock window.confirm to return true
    const confirmSpy = vi.spyOn(window, 'confirm');
    confirmSpy.mockImplementation(() => true);

    render(
      <QueryClientProvider client={queryClient}>
        <OrderList />
      </QueryClientProvider>
    );

    // Wait for the component to finish loading
    await waitFor(() => {
      expect(screen.queryByText('読み込み中...')).not.toBeInTheDocument();
    });

    // Find and click the delete button
    const deleteButton = screen.getByText('削除');
    fireEvent.click(deleteButton);

    // Check if confirm was called
    expect(confirmSpy).toHaveBeenCalled();

    // Check if deleteOrder was called with correct argument
    await waitFor(() => {
      expect(orderService.deleteOrder).toHaveBeenCalledWith(1);
    });

    confirmSpy.mockRestore();
  });

  it('should not call deleteOrder when delete is cancelled', async () => {
    // Mock order data
    const mockOrders: Order[] = [
      {
        id: 1,
        customer_name: 'Test Customer',
        customer_email: 'customer@example.com',
        total_amount: 5000,
        status: 'pending',
        items: [],
        created_at: '2023-01-01T00:00:00Z',
        updated_at: '2023-01-01T00:00:00Z'
      }
    ];

    vi.mocked(orderService.getOrders).mockResolvedValue(mockOrders);

    // Mock window.confirm to return false
    const confirmSpy = vi.spyOn(window, 'confirm');
    confirmSpy.mockImplementation(() => false);

    render(
      <QueryClientProvider client={queryClient}>
        <OrderList />
      </QueryClientProvider>
    );

    // Wait for the component to finish loading
    await waitFor(() => {
      expect(screen.queryByText('読み込み中...')).not.toBeInTheDocument();
    });

    // Find and click the delete button
    const deleteButton = screen.getByText('削除');
    fireEvent.click(deleteButton);

    // Check if confirm was called
    expect(confirmSpy).toHaveBeenCalled();

    // Check that deleteOrder was not called
    expect(orderService.deleteOrder).not.toHaveBeenCalled();

    confirmSpy.mockRestore();
  });
});
