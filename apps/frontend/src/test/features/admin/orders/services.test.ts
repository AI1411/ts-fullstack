import * as controllers from '@/features/admin/orders/controllers';
import type {
  CreateOrderInput,
  Order,
} from '@/features/admin/orders/controllers';
import { orderService } from '@/features/admin/orders/services';
import { beforeEach, describe, expect, it, vi } from 'vitest';

// Mock the controllers
vi.mock('@/features/admin/orders/controllers', () => ({
  getOrders: vi.fn(),
  createOrder: vi.fn(),
  getOrderById: vi.fn(),
  updateOrder: vi.fn(),
  deleteOrder: vi.fn(),
  updateOrderStatus: vi.fn(),
  // Re-export types
  Order: {},
  CreateOrderInput: {},
}));

describe('Order Service', () => {
  beforeEach(() => {
    vi.clearAllMocks();
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
            price: 2500,
          },
        ],
        created_at: '2023-01-01T00:00:00Z',
        updated_at: '2023-01-01T00:00:00Z',
      },
    ];

    it('should call the controller method', async () => {
      // Mock successful response
      vi.mocked(controllers.getOrders).mockResolvedValue(mockOrders);

      const result = await orderService.getOrders();

      expect(controllers.getOrders).toHaveBeenCalled();
      expect(result).toEqual(mockOrders);
    });
  });

  describe('createOrder', () => {
    const orderData: CreateOrderInput = {
      customer_name: 'Test Customer',
      customer_email: 'customer@example.com',
      items: [
        {
          product_id: 1,
          quantity: 2,
        },
      ],
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
          price: 2500,
        },
      ],
      created_at: '2023-01-01T00:00:00Z',
      updated_at: '2023-01-01T00:00:00Z',
    };

    it('should call the controller method with the correct arguments', async () => {
      // Mock successful response
      vi.mocked(controllers.createOrder).mockResolvedValue(mockOrder);

      const result = await orderService.createOrder(orderData);

      expect(controllers.createOrder).toHaveBeenCalledWith(orderData);
      expect(result).toEqual(mockOrder);
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
          price: 2500,
        },
      ],
      created_at: '2023-01-01T00:00:00Z',
      updated_at: '2023-01-01T00:00:00Z',
    };

    it('should call the controller method with the correct arguments', async () => {
      // Mock successful response
      vi.mocked(controllers.getOrderById).mockResolvedValue(mockOrder);

      const result = await orderService.getOrderById(orderId);

      expect(controllers.getOrderById).toHaveBeenCalledWith(orderId);
      expect(result).toEqual(mockOrder);
    });
  });

  describe('updateOrder', () => {
    const orderId = 1;
    const orderData: Partial<CreateOrderInput> = {
      customer_name: 'Updated Customer',
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
          price: 2500,
        },
      ],
      created_at: '2023-01-01T00:00:00Z',
      updated_at: '2023-01-02T00:00:00Z',
    };

    it('should call the controller method with the correct arguments', async () => {
      // Mock successful response
      vi.mocked(controllers.updateOrder).mockResolvedValue(mockOrder);

      const result = await orderService.updateOrder(orderId, orderData);

      expect(controllers.updateOrder).toHaveBeenCalledWith(orderId, orderData);
      expect(result).toEqual(mockOrder);
    });
  });

  describe('deleteOrder', () => {
    const orderId = 1;

    it('should call the controller method with the correct arguments', async () => {
      // Mock successful response
      vi.mocked(controllers.deleteOrder).mockResolvedValue(undefined);

      await orderService.deleteOrder(orderId);

      expect(controllers.deleteOrder).toHaveBeenCalledWith(orderId);
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
          price: 2500,
        },
      ],
      created_at: '2023-01-01T00:00:00Z',
      updated_at: '2023-01-02T00:00:00Z',
    };

    it('should call the controller method with the correct arguments', async () => {
      // Mock successful response
      vi.mocked(controllers.updateOrderStatus).mockResolvedValue(mockOrder);

      const result = await orderService.updateOrderStatus(orderId, status);

      expect(controllers.updateOrderStatus).toHaveBeenCalledWith(
        orderId,
        status
      );
      expect(result).toEqual(mockOrder);
    });
  });

  describe('getOrdersByStatus', () => {
    const status: Order['status'] = 'pending';
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
            price: 2500,
          },
        ],
        created_at: '2023-01-01T00:00:00Z',
        updated_at: '2023-01-01T00:00:00Z',
      },
    ];

    it('should filter orders by status', async () => {
      // Mock successful response
      vi.mocked(controllers.getOrders).mockResolvedValue([
        ...mockOrders,
        {
          id: 2,
          customer_name: 'Another Customer',
          customer_email: 'another@example.com',
          total_amount: 3000,
          status: 'completed',
          items: [],
          created_at: '2023-01-02T00:00:00Z',
          updated_at: '2023-01-02T00:00:00Z',
        },
      ]);

      const result = await orderService.getOrdersByStatus(status);

      expect(controllers.getOrders).toHaveBeenCalled();
      expect(result).toEqual(mockOrders);
    });
  });

  describe('getRecentOrders', () => {
    const mockOrders: Order[] = [
      {
        id: 2,
        customer_name: 'Recent Customer',
        customer_email: 'recent@example.com',
        total_amount: 3000,
        status: 'pending',
        items: [],
        created_at: '2023-01-02T00:00:00Z',
        updated_at: '2023-01-02T00:00:00Z',
      },
      {
        id: 1,
        customer_name: 'Old Customer',
        customer_email: 'old@example.com',
        total_amount: 5000,
        status: 'completed',
        items: [],
        created_at: '2023-01-01T00:00:00Z',
        updated_at: '2023-01-01T00:00:00Z',
      },
    ];

    it('should return recent orders limited by count', async () => {
      // Mock successful response
      vi.mocked(controllers.getOrders).mockResolvedValue(mockOrders);

      const result = await orderService.getRecentOrders(1);

      expect(controllers.getOrders).toHaveBeenCalled();
      expect(result).toHaveLength(1);
      expect(result[0].id).toBe(2); // The most recent order
    });

    it('should use default limit if not provided', async () => {
      // Mock successful response with more orders
      vi.mocked(controllers.getOrders).mockResolvedValue([
        ...mockOrders,
        {
          id: 3,
          customer_name: 'Another Customer',
          customer_email: 'another@example.com',
          total_amount: 2000,
          status: 'pending',
          items: [],
          created_at: '2023-01-03T00:00:00Z',
          updated_at: '2023-01-03T00:00:00Z',
        },
        {
          id: 4,
          customer_name: 'Yet Another Customer',
          customer_email: 'yet.another@example.com',
          total_amount: 1000,
          status: 'pending',
          items: [],
          created_at: '2023-01-04T00:00:00Z',
          updated_at: '2023-01-04T00:00:00Z',
        },
        {
          id: 5,
          customer_name: 'One More Customer',
          customer_email: 'one.more@example.com',
          total_amount: 500,
          status: 'pending',
          items: [],
          created_at: '2023-01-05T00:00:00Z',
          updated_at: '2023-01-05T00:00:00Z',
        },
        {
          id: 6,
          customer_name: 'Last Customer',
          customer_email: 'last@example.com',
          total_amount: 250,
          status: 'pending',
          items: [],
          created_at: '2023-01-06T00:00:00Z',
          updated_at: '2023-01-06T00:00:00Z',
        },
      ]);

      const result = await orderService.getRecentOrders();

      expect(controllers.getOrders).toHaveBeenCalled();
      expect(result).toHaveLength(5); // Default limit is 5
      expect(result[0].id).toBe(6); // The most recent order
    });
  });

  describe('calculateTotalRevenue', () => {
    const mockOrders: Order[] = [
      {
        id: 1,
        customer_name: 'Customer 1',
        customer_email: 'customer1@example.com',
        total_amount: 5000,
        status: 'completed',
        items: [],
        created_at: '2023-01-01T00:00:00Z',
        updated_at: '2023-01-01T00:00:00Z',
      },
      {
        id: 2,
        customer_name: 'Customer 2',
        customer_email: 'customer2@example.com',
        total_amount: 3000,
        status: 'completed',
        items: [],
        created_at: '2023-01-02T00:00:00Z',
        updated_at: '2023-01-02T00:00:00Z',
      },
    ];

    it('should calculate total revenue from all orders', async () => {
      // Mock successful response
      vi.mocked(controllers.getOrders).mockResolvedValue(mockOrders);

      const result = await orderService.calculateTotalRevenue();

      expect(controllers.getOrders).toHaveBeenCalled();
      expect(result).toBe(8000); // 5000 + 3000
    });
  });
});
