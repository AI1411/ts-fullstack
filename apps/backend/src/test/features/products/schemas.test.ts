import { describe, it, expect } from 'vitest';
import { productSchema, productUpdateSchema } from '../../../features/products/schemas';

describe('Product Schemas', () => {
  describe('productSchema', () => {
    it('should validate a valid product object with required fields', () => {
      const validProduct = {
        name: 'Test Product',
        price: 100,
      };

      const result = productSchema.safeParse(validProduct);
      expect(result.success).toBe(true);
    });

    it('should validate a valid product object with all fields', () => {
      const validProduct = {
        id: 1,
        name: 'Test Product',
        description: 'This is a test product',
        price: 100,
        stock: 10,
        image_url: 'https://example.com/image.jpg',
      };

      const result = productSchema.safeParse(validProduct);
      expect(result.success).toBe(true);
    });

    it('should reject a product with empty name', () => {
      const invalidProduct = {
        name: '',
        price: 100,
      };

      const result = productSchema.safeParse(invalidProduct);
      expect(result.success).toBe(false);

      if (!result.success) {
        expect(result.error.issues[0].message).toBe('商品名は必須です');
      }
    });

    it('should reject a product with negative price', () => {
      const invalidProduct = {
        name: 'Test Product',
        price: -10,
      };

      const result = productSchema.safeParse(invalidProduct);
      expect(result.success).toBe(false);

      if (!result.success) {
        expect(result.error.issues[0].message).toBe('価格は0以上である必要があります');
      }
    });

    it('should reject a product with negative stock', () => {
      const invalidProduct = {
        name: 'Test Product',
        price: 100,
        stock: -5,
      };

      const result = productSchema.safeParse(invalidProduct);
      expect(result.success).toBe(false);

      if (!result.success) {
        expect(result.error.issues[0].message).toBe('在庫数は0以上である必要があります');
      }
    });

    it('should reject a product with invalid image URL', () => {
      const invalidProduct = {
        name: 'Test Product',
        price: 100,
        image_url: 'not-a-url',
      };

      const result = productSchema.safeParse(invalidProduct);
      expect(result.success).toBe(false);

      if (!result.success) {
        expect(result.error.issues[0].message).toBe('有効なURLを入力してください');
      }
    });

    it('should reject a product with missing required fields', () => {
      const invalidProduct = {
        description: 'Missing required fields',
      };

      const result = productSchema.safeParse(invalidProduct);
      expect(result.success).toBe(false);
    });
  });

  describe('productUpdateSchema', () => {
    it('should validate a valid partial product update', () => {
      const validUpdate = {
        name: 'Updated Product',
      };

      const result = productUpdateSchema.safeParse(validUpdate);
      expect(result.success).toBe(true);
    });

    it('should validate an empty update object', () => {
      const emptyUpdate = {};

      const result = productUpdateSchema.safeParse(emptyUpdate);
      expect(result.success).toBe(true);
    });

    it('should validate a complete product update without id', () => {
      const validUpdate = {
        name: 'Updated Product',
        description: 'Updated description',
        price: 200,
        stock: 20,
        image_url: 'https://example.com/updated.jpg',
      };

      const result = productUpdateSchema.safeParse(validUpdate);
      expect(result.success).toBe(true);
    });

    it('should ignore id field in update', () => {
      const updateWithId = {
        id: 1,
        name: 'Updated Product',
      };

      const result = productUpdateSchema.safeParse(updateWithId);
      expect(result.success).toBe(true);

      // Verify that the id field is stripped from the parsed data
      if (result.success) {
        expect('id' in result.data).toBe(false);
        expect(result.data).toEqual({ name: 'Updated Product' });
      }
    });

    it('should still validate fields according to rules', () => {
      const invalidUpdate = {
        price: -10,
      };

      const result = productUpdateSchema.safeParse(invalidUpdate);
      expect(result.success).toBe(false);

      if (!result.success) {
        expect(result.error.issues[0].message).toBe('価格は0以上である必要があります');
      }
    });
  });
});
