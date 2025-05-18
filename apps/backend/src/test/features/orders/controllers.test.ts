import { sql } from 'drizzle-orm';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import * as dbModule from '../../../common/utils/db';
import {
  orderItemsTable,
  ordersTable,
  productsTable,
} from '../../../db/schema';
import {
  cancelOrder,
  createOrder,
  getOrderById,
  getOrders,
  getUserOrders,
  updateOrderStatus,
} from '../../../features/orders/controllers';

// Mock order data
const mockOrder = {
  id: 1,
  user_id: 1,
  total_amount: 100,
  status: 'PENDING',
  created_at: new Date(),
  updated_at: new Date(),
};

const mockOrderItem = {
  id: 1,
  order_id: 1,
  product_id: 1,
  quantity: 2,
  price: 50,
  created_at: new Date(),
  updated_at: new Date(),
};

const mockProduct = {
  id: 1,
  name: 'Test Product',
  description: 'Test Description',
  price: 50,
  stock: 10,
  created_at: new Date(),
  updated_at: new Date(),
};

// Mock the database module
vi.mock('../../../common/utils/db', () => ({
  getDB: vi.fn(),
}));

// Mock context
const createMockContext = (body = {}, params = {}) => ({
  req: {
    valid: vi.fn().mockReturnValue(body),
    param: vi.fn((key) => params[key]),
  },
  json: vi.fn().mockImplementation((data, status) => ({ data, status })),
  env: {
    DATABASE_URL: 'postgres://test:test@localhost:5432/test',
  },
});

// Mock DB client
const mockDbClient = {
  select: vi.fn().mockReturnThis(),
  from: vi.fn().mockReturnThis(),
  where: vi.fn().mockReturnThis(),
  leftJoin: vi.fn().mockReturnThis(),
  insert: vi.fn().mockReturnThis(),
  values: vi.fn().mockReturnThis(),
  update: vi.fn().mockReturnThis(),
  set: vi.fn().mockReturnThis(),
  delete: vi.fn().mockReturnThis(),
  returning: vi.fn().mockResolvedValue([mockOrder]),
  transaction: vi.fn().mockImplementation(async (callback) => {
    return await callback(mockDbClient);
  }),
};

describe('Order Controllers', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(dbModule.getDB).mockReturnValue(mockDbClient);
  });

  describe('getOrders', () => {
    it('should return all orders', async () => {
      const mockContext = createMockContext();
      mockDbClient.select.mockReturnThis();
      mockDbClient.from.mockReturnThis();
      mockDbClient.from.mockResolvedValueOnce([mockOrder]);

      const result = await getOrders(mockContext);

      expect(mockContext.json).toHaveBeenCalledWith({ orders: [mockOrder] });
    });

    it('should handle errors', async () => {
      const mockContext = createMockContext();
      mockDbClient.select.mockReturnThis();
      mockDbClient.from.mockRejectedValueOnce(new Error('Database error'));

      const result = await getOrders(mockContext);

      expect(mockContext.json).toHaveBeenCalledWith(
        { error: 'Database error' },
        500
      );
    });
  });

  describe('getOrderById', () => {
    it('should return an order by id with its items', async () => {
      const mockParams = { id: '1' };
      const mockContext = createMockContext({}, mockParams);

      // Mock the first query for order
      mockDbClient.select.mockReturnThis();
      mockDbClient.from.mockReturnThis();
      mockDbClient.where.mockResolvedValueOnce([mockOrder]);

      // Mock the second query for order items
      mockDbClient.select.mockReturnThis();
      mockDbClient.from.mockReturnThis();
      mockDbClient.leftJoin.mockReturnThis();
      mockDbClient.where.mockResolvedValueOnce([
        {
          ...mockOrderItem,
          product_name: mockProduct.name,
        },
      ]);

      const result = await getOrderById(mockContext);

      expect(mockContext.req.param).toHaveBeenCalledWith('id');
      expect(mockContext.json).toHaveBeenCalledWith({
        order: {
          ...mockOrder,
          items: [
            {
              ...mockOrderItem,
              product_name: mockProduct.name,
            },
          ],
        },
      });
    });

    it('should return 404 if order not found', async () => {
      const mockParams = { id: '999' };
      const mockContext = createMockContext({}, mockParams);
      mockDbClient.select.mockReturnThis();
      mockDbClient.from.mockReturnThis();
      mockDbClient.where.mockResolvedValueOnce([]);

      const result = await getOrderById(mockContext);

      expect(mockContext.json).toHaveBeenCalledWith(
        { error: '注文が見つかりません' },
        404
      );
    });

    it('should handle errors', async () => {
      const mockParams = { id: '1' };
      const mockContext = createMockContext({}, mockParams);
      mockDbClient.select.mockReturnThis();
      mockDbClient.from.mockReturnThis();
      mockDbClient.where.mockRejectedValueOnce(new Error('Database error'));

      const result = await getOrderById(mockContext);

      expect(mockContext.json).toHaveBeenCalledWith(
        { error: 'Database error' },
        500
      );
    });
  });

  describe('getUserOrders', () => {
    it('should return orders for a specific user', async () => {
      const mockParams = { userId: '1' };
      const mockContext = createMockContext({}, mockParams);
      mockDbClient.select.mockReturnThis();
      mockDbClient.from.mockReturnThis();
      mockDbClient.where.mockResolvedValueOnce([mockOrder]);

      const result = await getUserOrders(mockContext);

      expect(mockContext.req.param).toHaveBeenCalledWith('userId');
      expect(mockContext.json).toHaveBeenCalledWith({ orders: [mockOrder] });
    });

    it('should handle errors', async () => {
      const mockParams = { userId: '1' };
      const mockContext = createMockContext({}, mockParams);
      mockDbClient.select.mockReturnThis();
      mockDbClient.from.mockReturnThis();
      mockDbClient.where.mockRejectedValueOnce(new Error('Database error'));

      const result = await getUserOrders(mockContext);

      expect(mockContext.json).toHaveBeenCalledWith(
        { error: 'Database error' },
        500
      );
    });
  });

  describe('createOrder', () => {
    it('should create a new order with items', async () => {
      const mockBody = {
        user_id: 1,
        items: [{ product_id: 1, quantity: 2 }],
      };
      const mockContext = createMockContext(mockBody);

      // Mock product query
      mockDbClient.select.mockReturnThis();
      mockDbClient.from.mockReturnThis();
      mockDbClient.where.mockResolvedValueOnce([mockProduct]);

      // Mock order insert
      mockDbClient.insert.mockReturnThis();
      mockDbClient.values.mockReturnThis();
      mockDbClient.returning.mockResolvedValueOnce([mockOrder]);

      // Mock order item insert
      mockDbClient.insert.mockReturnThis();
      mockDbClient.values.mockReturnThis();
      mockDbClient.returning.mockResolvedValueOnce([mockOrderItem]);

      // Mock product update
      mockDbClient.update.mockReturnThis();
      mockDbClient.set.mockReturnThis();
      mockDbClient.where.mockResolvedValueOnce([{ ...mockProduct, stock: 8 }]);

      const result = await createOrder(mockContext);

      expect(mockContext.req.valid).toHaveBeenCalledWith('json');
      expect(mockContext.json).toHaveBeenCalledWith(
        {
          order: mockOrder,
          items: [mockOrderItem],
        },
        201
      );
    });

    it('should handle product not found', async () => {
      const mockBody = {
        user_id: 1,
        items: [{ product_id: 999, quantity: 2 }],
      };
      const mockContext = createMockContext(mockBody);

      // Mock product query with empty result
      mockDbClient.select.mockReturnThis();
      mockDbClient.from.mockReturnThis();
      mockDbClient.where.mockResolvedValueOnce([]);

      const result = await createOrder(mockContext);

      expect(mockContext.json).toHaveBeenCalledWith(
        { error: `商品ID 999 が見つかりません` },
        404
      );
    });

    it('should handle insufficient stock', async () => {
      const mockBody = {
        user_id: 1,
        items: [
          { product_id: 1, quantity: 20 }, // More than available stock
        ],
      };
      const mockContext = createMockContext(mockBody);

      // Mock product query
      mockDbClient.select.mockReturnThis();
      mockDbClient.from.mockReturnThis();
      mockDbClient.where.mockResolvedValueOnce([mockProduct]); // Stock is 10

      const result = await createOrder(mockContext);

      expect(mockContext.json).toHaveBeenCalledWith(
        {
          error: `商品「${mockProduct.name}」の在庫が不足しています。在庫: ${mockProduct.stock}, 注文数: 20`,
        },
        400
      );
    });

    it('should handle errors', async () => {
      const mockBody = {
        user_id: 1,
        items: [{ product_id: 1, quantity: 2 }],
      };
      const mockContext = createMockContext(mockBody);

      // Mock transaction to throw error
      mockDbClient.transaction.mockRejectedValueOnce(
        new Error('Database error')
      );

      const result = await createOrder(mockContext);

      expect(mockContext.json).toHaveBeenCalledWith(
        { error: 'Database error' },
        500
      );
    });
  });

  describe('updateOrderStatus', () => {
    it('should update an order status', async () => {
      const mockParams = { id: '1' };
      const mockBody = { status: 'PROCESSING' };
      const mockContext = createMockContext(mockBody, mockParams);

      // Mock order query
      mockDbClient.select.mockReturnThis();
      mockDbClient.from.mockReturnThis();
      mockDbClient.where.mockResolvedValueOnce([mockOrder]);

      // Mock order update
      mockDbClient.update.mockReturnThis();
      mockDbClient.set.mockReturnThis();
      mockDbClient.where.mockReturnThis();
      mockDbClient.returning.mockResolvedValueOnce([
        { ...mockOrder, status: 'PROCESSING' },
      ]);

      const result = await updateOrderStatus(mockContext);

      expect(mockContext.req.param).toHaveBeenCalledWith('id');
      expect(mockContext.req.valid).toHaveBeenCalledWith('json');
      expect(mockContext.json).toHaveBeenCalledWith({
        order: { ...mockOrder, status: 'PROCESSING' },
      });
    });

    it('should return 404 if order not found', async () => {
      const mockParams = { id: '999' };
      const mockBody = { status: 'PROCESSING' };
      const mockContext = createMockContext(mockBody, mockParams);

      // Mock order query with empty result
      mockDbClient.select.mockReturnThis();
      mockDbClient.from.mockReturnThis();
      mockDbClient.where.mockResolvedValueOnce([]);

      const result = await updateOrderStatus(mockContext);

      expect(mockContext.json).toHaveBeenCalledWith(
        { error: '注文が見つかりません' },
        404
      );
    });

    it('should handle errors', async () => {
      const mockParams = { id: '1' };
      const mockBody = { status: 'PROCESSING' };
      const mockContext = createMockContext(mockBody, mockParams);

      // Mock order query to throw error
      mockDbClient.select.mockReturnThis();
      mockDbClient.from.mockReturnThis();
      mockDbClient.where.mockRejectedValueOnce(new Error('Database error'));

      const result = await updateOrderStatus(mockContext);

      expect(mockContext.json).toHaveBeenCalledWith(
        { error: 'Database error' },
        500
      );
    });
  });

  describe('cancelOrder', () => {
    it('should cancel an order and restore product stock', async () => {
      const mockParams = { id: '1' };
      const mockContext = createMockContext({}, mockParams);

      // Mock order query
      mockDbClient.select.mockReturnThis();
      mockDbClient.from.mockReturnThis();
      mockDbClient.where.mockResolvedValueOnce([mockOrder]);

      // Mock order items query
      mockDbClient.select.mockReturnThis();
      mockDbClient.from.mockReturnThis();
      mockDbClient.where.mockResolvedValueOnce([mockOrderItem]);

      // Mock product update
      mockDbClient.update.mockReturnThis();
      mockDbClient.set.mockReturnThis();
      mockDbClient.where.mockResolvedValueOnce([{ ...mockProduct, stock: 12 }]);

      // Mock order update
      mockDbClient.update.mockReturnThis();
      mockDbClient.set.mockReturnThis();
      mockDbClient.where.mockReturnThis();
      mockDbClient.returning.mockResolvedValueOnce([
        { ...mockOrder, status: 'CANCELLED' },
      ]);

      const result = await cancelOrder(mockContext);

      expect(mockContext.req.param).toHaveBeenCalledWith('id');
      expect(mockContext.json).toHaveBeenCalledWith({
        order: { ...mockOrder, status: 'CANCELLED' },
        message: '注文がキャンセルされました',
      });
    });

    it('should return 404 if order not found', async () => {
      const mockParams = { id: '999' };
      const mockContext = createMockContext({}, mockParams);

      // Mock order query with empty result
      mockDbClient.select.mockReturnThis();
      mockDbClient.from.mockReturnThis();
      mockDbClient.where.mockResolvedValueOnce([]);

      const result = await cancelOrder(mockContext);

      expect(mockContext.json).toHaveBeenCalledWith(
        { error: '注文が見つかりません' },
        404
      );
    });

    it('should return 400 if order is already cancelled', async () => {
      const mockParams = { id: '1' };
      const mockContext = createMockContext({}, mockParams);

      // Mock order query with cancelled status
      mockDbClient.select.mockReturnThis();
      mockDbClient.from.mockReturnThis();
      mockDbClient.where.mockResolvedValueOnce([
        { ...mockOrder, status: 'CANCELLED' },
      ]);

      const result = await cancelOrder(mockContext);

      expect(mockContext.json).toHaveBeenCalledWith(
        { error: 'この注文は既にキャンセルされています' },
        400
      );
    });

    it('should return 400 if order is already shipped or delivered', async () => {
      const mockParams = { id: '1' };
      const mockContext = createMockContext({}, mockParams);

      // Mock order query with shipped status
      mockDbClient.select.mockReturnThis();
      mockDbClient.from.mockReturnThis();
      mockDbClient.where.mockResolvedValueOnce([
        { ...mockOrder, status: 'SHIPPED' },
      ]);

      const result = await cancelOrder(mockContext);

      expect(mockContext.json).toHaveBeenCalledWith(
        { error: '発送済みまたは配達済みの注文はキャンセルできません' },
        400
      );
    });

    it('should handle errors', async () => {
      const mockParams = { id: '1' };
      const mockContext = createMockContext({}, mockParams);

      // Mock transaction to throw error
      mockDbClient.transaction.mockRejectedValueOnce(
        new Error('Database error')
      );

      const result = await cancelOrder(mockContext);

      expect(mockContext.json).toHaveBeenCalledWith(
        { error: 'Database error' },
        500
      );
    });
  });
});
