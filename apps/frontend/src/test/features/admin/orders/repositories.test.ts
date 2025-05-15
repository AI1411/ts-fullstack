import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { orderRepository } from '@/features/admin/orders/repositories';
import { CreateOrderInput } from '@/features/admin/orders/controllers';

// Mock global fetch
const originalFetch = global.fetch;
const mockFetch = vi.fn();

describe('Order Repository', () => {
  beforeEach(() => {
    global.fetch = mockFetch;
    vi.clearAllMocks();
  });

  afterEach(() => {
    global.fetch = originalFetch;
  });

  describe('getOrders', () => {
    it('should call the correct API endpoint', async () => {
      // Mock successful response
      mockFetch.mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({ orders: [] })
      });

      await orderRepository.getOrders();

      expect(mockFetch).toHaveBeenCalledWith('http://localhost:8080/orders');
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

    it('should call the correct API endpoint with the right data', async () => {
      // Mock successful response
      mockFetch.mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({ order: {} })
      });

      await orderRepository.createOrder(orderData);

      expect(mockFetch).toHaveBeenCalledWith('http://localhost:8080/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderData),
      });
    });
  });

  describe('getOrderById', () => {
    const orderId = 1;

    it('should call the correct API endpoint', async () => {
      // Mock successful response
      mockFetch.mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({ order: {} })
      });

      await orderRepository.getOrderById(orderId);

      expect(mockFetch).toHaveBeenCalledWith(`http://localhost:8080/orders/${orderId}`);
    });
  });

  describe('updateOrder', () => {
    const orderId = 1;
    const orderData: Partial<CreateOrderInput> = {
      customer_name: 'Updated Customer'
    };

    it('should call the correct API endpoint with the right data', async () => {
      // Mock successful response
      mockFetch.mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({ order: {} })
      });

      await orderRepository.updateOrder(orderId, orderData);

      expect(mockFetch).toHaveBeenCalledWith(`http://localhost:8080/orders/${orderId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderData),
      });
    });
  });

  describe('deleteOrder', () => {
    const orderId = 1;

    it('should call the correct API endpoint', async () => {
      // Mock successful response
      mockFetch.mockResolvedValue({
        ok: true
      });

      await orderRepository.deleteOrder(orderId);

      expect(mockFetch).toHaveBeenCalledWith(`http://localhost:8080/orders/${orderId}`, {
        method: 'DELETE',
      });
    });
  });

  describe('updateOrderStatus', () => {
    const orderId = 1;
    const status = 'completed';

    it('should call the correct API endpoint with the right data', async () => {
      // Mock successful response
      mockFetch.mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({ order: {} })
      });

      await orderRepository.updateOrderStatus(orderId, status);

      expect(mockFetch).toHaveBeenCalledWith(`http://localhost:8080/orders/${orderId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status }),
      });
    });
  });
});