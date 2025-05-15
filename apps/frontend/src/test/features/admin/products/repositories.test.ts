import { describe, it, expect, vi, beforeEach } from 'vitest';
import { productRepository } from '@/features/admin/products/repositories';
import { client } from '@/common/utils/client';
import { CreateProductInput } from '@/features/admin/products/controllers';

// Mock the client
vi.mock('@/common/utils/client', () => ({
  client: {
    products: {
      $get: vi.fn(),
      $post: vi.fn(),
      ':id': {
        $get: vi.fn(),
        $put: vi.fn(),
        $delete: vi.fn()
      }
    }
  }
}));

describe('Product Repository', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('getProducts', () => {
    it('should call client.products.$get', async () => {
      // Mock response
      const mockResponse = { ok: true };
      vi.mocked(client.products.$get).mockResolvedValue(mockResponse as Response);

      const result = await productRepository.getProducts();

      expect(client.products.$get).toHaveBeenCalledTimes(1);
      expect(result).toBe(mockResponse);
    });
  });

  describe('createProduct', () => {
    it('should call client.products.$post with correct parameters', async () => {
      // Mock input data
      const productData: CreateProductInput = {
        name: 'Test Product',
        description: 'Test Description',
        price: 1000,
        stock: 10,
        image_url: 'https://example.com/image.jpg'
      };

      // Mock response
      const mockResponse = { ok: true };
      vi.mocked(client.products.$post).mockResolvedValue(mockResponse as Response);

      const result = await productRepository.createProduct(productData);

      expect(client.products.$post).toHaveBeenCalledWith({
        json: productData
      });
      expect(result).toBe(mockResponse);
    });
  });

  describe('getProductById', () => {
    it('should call client.products[":id"].$get with correct parameters', async () => {
      // Mock response
      const mockResponse = { ok: true };
      vi.mocked(client.products[':id'].$get).mockResolvedValue(mockResponse as Response);

      const result = await productRepository.getProductById(1);

      expect(client.products[':id'].$get).toHaveBeenCalledWith({
        param: { id: '1' }
      });
      expect(result).toBe(mockResponse);
    });
  });

  describe('updateProduct', () => {
    it('should call client.products[":id"].$put with correct parameters', async () => {
      // Mock update data
      const updateData: Partial<CreateProductInput> = {
        name: 'Updated Product',
        price: 2000
      };

      // Mock response
      const mockResponse = { ok: true };
      vi.mocked(client.products[':id'].$put).mockResolvedValue(mockResponse as Response);

      const result = await productRepository.updateProduct(1, updateData);

      expect(client.products[':id'].$put).toHaveBeenCalledWith({
        param: { id: '1' },
        json: updateData
      });
      expect(result).toBe(mockResponse);
    });
  });

  describe('deleteProduct', () => {
    it('should call client.products[":id"].$delete with correct parameters', async () => {
      // Mock response
      const mockResponse = { ok: true };
      vi.mocked(client.products[':id'].$delete).mockResolvedValue(mockResponse as Response);

      const result = await productRepository.deleteProduct(1);

      expect(client.products[':id'].$delete).toHaveBeenCalledWith({
        param: { id: '1' }
      });
      expect(result).toBe(mockResponse);
    });
  });
});