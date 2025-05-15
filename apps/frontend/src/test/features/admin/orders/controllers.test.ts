import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import {
  getOrders,
  createOrder,
  getOrderById,
  updateOrder,
  deleteOrder,
  updateOrderStatus,
  Order,
  CreateOrderInput
} from '@/features/admin/orders/controllers';
import { orderRepository } from '@/features/admin/orders/repositories';

// Mock the order repository
vi.mock('@/features/admin/orders/repositories', () => ({
  orderRepository: {
    getOrders: vi.fn(),
    createOrder: vi.fn(),
    getOrderById: vi.fn(),
    updateOrder: vi.fn(),
    deleteOrder: vi.fn(),
    updateOrderStatus: vi.fn()
  }
}));

describe('Order Controllers', () => {
  // Spy on console.error to prevent actual console output during tests
  let consoleErrorSpy: vi.SpyInstance;

  beforeEach(() => {
    consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    vi.clearAllMocks();
    consoleErrorSpy.mockRestore();
  });

  describe('getOrders', () => {
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

    it('should return orders when API call is successful', async () => {
      // Mock successful response
      vi.mocked(orderRepository.getOrders).mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({ orders: mockOrders }),
        text: () => Promise.resolve(JSON.stringify({ orders: mockOrders })),
        headers: new Headers({ 'content-type': 'application/json' })
      } as unknown as Response);

      const result = await getOrders();
      expect(result).toEqual(mockOrders);
      expect(orderRepository.getOrders).toHaveBeenCalled();
    });

    it('should throw an error when API call fails', async () => {
      // Mock failed response
      vi.mocked(orderRepository.getOrders).mockResolvedValue({
        ok: false,
        status: 500,
        statusText: 'Internal Server Error'
      } as Response);

      await expect(getOrders()).rejects.toThrow('Error fetching orders');
      expect(orderRepository.getOrders).toHaveBeenCalled();
      expect(consoleErrorSpy).toHaveBeenCalled();
    });

    it('should handle HTML response instead of JSON', async () => {
      // Mock HTML response
      vi.mocked(orderRepository.getOrders).mockResolvedValue({
        ok: true,
        headers: new Headers({ 'content-type': 'text/html' }),
        text: () => Promise.resolve('<!DOCTYPE html><html><body>Error</body></html>')
      } as unknown as Response);

      await expect(getOrders()).rejects.toThrow();
      expect(orderRepository.getOrders).toHaveBeenCalled();
      expect(consoleErrorSpy).toHaveBeenCalled();
    });

    it('should handle invalid JSON response', async () => {
      // Mock invalid JSON response
      vi.mocked(orderRepository.getOrders).mockResolvedValue({
        ok: true,
        headers: new Headers({ 'content-type': 'application/json' }),
        text: () => Promise.resolve('Not valid JSON')
      } as unknown as Response);

      await expect(getOrders()).rejects.toThrow();
      expect(orderRepository.getOrders).toHaveBeenCalled();
      expect(consoleErrorSpy).toHaveBeenCalled();
    });
  });

  describe('createOrder', () => {
    const orderData: CreateOrderInput = {
      customer_name: 'Test Customer',
      customer_email: 'customer@example.com',
      items: [
        {
          product_id: 1,
          quantity: 2
        }
      ]
    };
    const mockOrder: Order = {
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
    };

    it('should return an order when API call is successful', async () => {
      // Mock successful response
      vi.mocked(orderRepository.createOrder).mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({ order: mockOrder })
      } as unknown as Response);

      const result = await createOrder(orderData);
      expect(result).toEqual(mockOrder);
      expect(orderRepository.createOrder).toHaveBeenCalledWith(orderData);
    });

    it('should throw an error when API call fails', async () => {
      // Mock failed response
      const errorMessage = 'Failed to create order';
      vi.mocked(orderRepository.createOrder).mockResolvedValue({
        ok: false,
        text: () => Promise.resolve(errorMessage)
      } as unknown as Response);

      await expect(createOrder(orderData)).rejects.toThrow(errorMessage);
      expect(orderRepository.createOrder).toHaveBeenCalledWith(orderData);
      expect(consoleErrorSpy).toHaveBeenCalled();
    });
  });

  describe('getOrderById', () => {
    const orderId = 1;
    const mockOrder: Order = {
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
    };

    it('should return an order when API call is successful', async () => {
      // Mock successful response
      vi.mocked(orderRepository.getOrderById).mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({ order: mockOrder })
      } as unknown as Response);

      const result = await getOrderById(orderId);
      expect(result).toEqual(mockOrder);
      expect(orderRepository.getOrderById).toHaveBeenCalledWith(orderId);
    });

    it('should throw an error when API call fails', async () => {
      // Mock failed response
      vi.mocked(orderRepository.getOrderById).mockResolvedValue({
        ok: false
      } as unknown as Response);

      await expect(getOrderById(orderId)).rejects.toThrow('Order not found');
      expect(orderRepository.getOrderById).toHaveBeenCalledWith(orderId);
      expect(consoleErrorSpy).toHaveBeenCalled();
    });
  });

  describe('updateOrder', () => {
    const orderId = 1;
    const orderData: Partial<CreateOrderInput> = {
      customer_name: 'Updated Customer'
    };
    const mockOrder: Order = {
      id: 1,
      customer_name: 'Updated Customer',
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
      updated_at: '2023-01-02T00:00:00Z'
    };

    it('should return an updated order when API call is successful', async () => {
      // Mock successful response
      vi.mocked(orderRepository.updateOrder).mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({ order: mockOrder })
      } as unknown as Response);

      const result = await updateOrder(orderId, orderData);
      expect(result).toEqual(mockOrder);
      expect(orderRepository.updateOrder).toHaveBeenCalledWith(orderId, orderData);
    });

    it('should throw an error when API call fails', async () => {
      // Mock failed response
      const errorMessage = 'Failed to update order';
      vi.mocked(orderRepository.updateOrder).mockResolvedValue({
        ok: false,
        text: () => Promise.resolve(errorMessage)
      } as unknown as Response);

      await expect(updateOrder(orderId, orderData)).rejects.toThrow(errorMessage);
      expect(orderRepository.updateOrder).toHaveBeenCalledWith(orderId, orderData);
      expect(consoleErrorSpy).toHaveBeenCalled();
    });
  });

  describe('deleteOrder', () => {
    const orderId = 1;

    it('should complete successfully when API call is successful', async () => {
      // Mock successful response
      vi.mocked(orderRepository.deleteOrder).mockResolvedValue({
        ok: true
      } as unknown as Response);

      await expect(deleteOrder(orderId)).resolves.not.toThrow();
      expect(orderRepository.deleteOrder).toHaveBeenCalledWith(orderId);
    });

    it('should throw an error when API call fails', async () => {
      // Mock failed response
      const errorMessage = 'Failed to delete order';
      vi.mocked(orderRepository.deleteOrder).mockResolvedValue({
        ok: false,
        text: () => Promise.resolve(errorMessage)
      } as unknown as Response);

      await expect(deleteOrder(orderId)).rejects.toThrow(errorMessage);
      expect(orderRepository.deleteOrder).toHaveBeenCalledWith(orderId);
      expect(consoleErrorSpy).toHaveBeenCalled();
    });
  });

  describe('updateOrderStatus', () => {
    const orderId = 1;
    const status: Order['status'] = 'completed';
    const mockOrder: Order = {
      id: 1,
      customer_name: 'Test Customer',
      customer_email: 'customer@example.com',
      total_amount: 5000,
      status: 'completed',
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
      updated_at: '2023-01-02T00:00:00Z'
    };

    it('should return an updated order when API call is successful', async () => {
      // Mock successful response
      vi.mocked(orderRepository.updateOrderStatus).mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({ order: mockOrder })
      } as unknown as Response);

      const result = await updateOrderStatus(orderId, status);
      expect(result).toEqual(mockOrder);
      expect(orderRepository.updateOrderStatus).toHaveBeenCalledWith(orderId, status);
    });

    it('should throw an error when API call fails', async () => {
      // Mock failed response
      const errorMessage = 'Failed to update order status';
      vi.mocked(orderRepository.updateOrderStatus).mockResolvedValue({
        ok: false,
        text: () => Promise.resolve(errorMessage)
      } as unknown as Response);

      await expect(updateOrderStatus(orderId, status)).rejects.toThrow(errorMessage);
      expect(orderRepository.updateOrderStatus).toHaveBeenCalledWith(orderId, status);
      expect(consoleErrorSpy).toHaveBeenCalled();
    });
  });
});