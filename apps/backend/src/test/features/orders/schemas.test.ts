import { describe, it, expect } from 'vitest';
import { 
  orderItemSchema, 
  orderSchema, 
  orderStatusUpdateSchema, 
  orderDetailSchema 
} from '../../../features/orders/schemas';

describe('Order Schemas', () => {
  describe('orderItemSchema', () => {
    it('should validate a valid order item', () => {
      const validOrderItem = {
        product_id: 1,
        quantity: 2,
      };
      
      const result = orderItemSchema.safeParse(validOrderItem);
      expect(result.success).toBe(true);
    });

    it('should reject an order item with non-positive product_id', () => {
      const invalidOrderItem = {
        product_id: 0,
        quantity: 2,
      };
      
      const result = orderItemSchema.safeParse(invalidOrderItem);
      expect(result.success).toBe(false);
    });

    it('should reject an order item with non-positive quantity', () => {
      const invalidOrderItem = {
        product_id: 1,
        quantity: 0,
      };
      
      const result = orderItemSchema.safeParse(invalidOrderItem);
      expect(result.success).toBe(false);
    });

    it('should reject an order item with missing fields', () => {
      const invalidOrderItem = {
        product_id: 1,
      };
      
      const result = orderItemSchema.safeParse(invalidOrderItem);
      expect(result.success).toBe(false);
    });
  });

  describe('orderSchema', () => {
    it('should validate a valid order', () => {
      const validOrder = {
        user_id: 1,
        items: [
          {
            product_id: 1,
            quantity: 2,
          },
        ],
      };
      
      const result = orderSchema.safeParse(validOrder);
      expect(result.success).toBe(true);
    });

    it('should reject an order with non-positive user_id', () => {
      const invalidOrder = {
        user_id: 0,
        items: [
          {
            product_id: 1,
            quantity: 2,
          },
        ],
      };
      
      const result = orderSchema.safeParse(invalidOrder);
      expect(result.success).toBe(false);
    });

    it('should reject an order with empty items array', () => {
      const invalidOrder = {
        user_id: 1,
        items: [],
      };
      
      const result = orderSchema.safeParse(invalidOrder);
      expect(result.success).toBe(false);
    });

    it('should reject an order with invalid items', () => {
      const invalidOrder = {
        user_id: 1,
        items: [
          {
            product_id: 0, // Invalid product_id
            quantity: 2,
          },
        ],
      };
      
      const result = orderSchema.safeParse(invalidOrder);
      expect(result.success).toBe(false);
    });
  });

  describe('orderStatusUpdateSchema', () => {
    it('should validate valid status values', () => {
      const validStatuses = ["PENDING", "PROCESSING", "SHIPPED", "DELIVERED", "CANCELLED"];
      
      validStatuses.forEach(status => {
        const result = orderStatusUpdateSchema.safeParse({ status });
        expect(result.success).toBe(true);
      });
    });

    it('should reject invalid status values', () => {
      const invalidStatus = {
        status: "INVALID_STATUS",
      };
      
      const result = orderStatusUpdateSchema.safeParse(invalidStatus);
      expect(result.success).toBe(false);
    });
  });

  describe('orderDetailSchema', () => {
    it('should validate a valid order detail', () => {
      const validOrderDetail = {
        id: 1,
        user_id: 1,
        total_amount: 100,
        status: "PENDING",
        created_at: "2023-01-01T00:00:00Z",
        updated_at: "2023-01-01T00:00:00Z",
        items: [
          {
            id: 1,
            product_id: 1,
            product_name: "Test Product",
            quantity: 2,
            price: 50,
          },
        ],
      };
      
      const result = orderDetailSchema.safeParse(validOrderDetail);
      expect(result.success).toBe(true);
    });

    it('should reject an order detail with missing fields', () => {
      const invalidOrderDetail = {
        id: 1,
        user_id: 1,
        // Missing total_amount
        status: "PENDING",
        created_at: "2023-01-01T00:00:00Z",
        updated_at: "2023-01-01T00:00:00Z",
        items: [],
      };
      
      const result = orderDetailSchema.safeParse(invalidOrderDetail);
      expect(result.success).toBe(false);
    });

    it('should reject an order detail with invalid item structure', () => {
      const invalidOrderDetail = {
        id: 1,
        user_id: 1,
        total_amount: 100,
        status: "PENDING",
        created_at: "2023-01-01T00:00:00Z",
        updated_at: "2023-01-01T00:00:00Z",
        items: [
          {
            id: 1,
            product_id: 1,
            // Missing product_name
            quantity: 2,
            price: 50,
          },
        ],
      };
      
      const result = orderDetailSchema.safeParse(invalidOrderDetail);
      expect(result.success).toBe(false);
    });
  });
});