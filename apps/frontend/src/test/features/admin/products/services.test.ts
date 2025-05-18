import * as controllers from '@/features/admin/products/controllers';
import type {
  CreateProductInput,
  Product,
} from '@/features/admin/products/controllers';
import { productService } from '@/features/admin/products/services';
import { beforeEach, describe, expect, it, vi } from 'vitest';

// Mock the controllers
vi.mock('@/features/admin/products/controllers', () => ({
  getProducts: vi.fn(),
  createProduct: vi.fn(),
  getProductById: vi.fn(),
  updateProduct: vi.fn(),
  deleteProduct: vi.fn(),
}));

describe('Product Service', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('getProducts', () => {
    it('should call the controller getProducts method', async () => {
      // Mock products data
      const mockProducts: Product[] = [
        {
          id: 1,
          name: 'Test Product 1',
          description: 'Description 1',
          price: 1000,
          stock: 10,
          image_url: 'https://example.com/image1.jpg',
          created_at: '2023-01-01T00:00:00Z',
          updated_at: '2023-01-02T00:00:00Z',
        },
      ];

      vi.mocked(controllers.getProducts).mockResolvedValue(mockProducts);

      const result = await productService.getProducts();

      expect(controllers.getProducts).toHaveBeenCalledTimes(1);
      expect(result).toEqual(mockProducts);
    });
  });

  describe('createProduct', () => {
    it('should call the controller createProduct method with correct parameters', async () => {
      // Mock input data
      const productData: CreateProductInput = {
        name: 'New Product',
        description: 'New Description',
        price: 1500,
        stock: 15,
        image_url: 'https://example.com/new-image.jpg',
      };

      // Mock created product
      const createdProduct: Product = {
        id: 1,
        name: 'New Product',
        description: 'New Description',
        price: 1500,
        stock: 15,
        image_url: 'https://example.com/new-image.jpg',
        created_at: '2023-01-01T00:00:00Z',
        updated_at: '2023-01-01T00:00:00Z',
      };

      vi.mocked(controllers.createProduct).mockResolvedValue(createdProduct);

      const result = await productService.createProduct(productData);

      expect(controllers.createProduct).toHaveBeenCalledWith(productData);
      expect(result).toEqual(createdProduct);
    });
  });

  describe('getProductById', () => {
    it('should call the controller getProductById method with correct parameters', async () => {
      // Mock product
      const product: Product = {
        id: 1,
        name: 'Test Product',
        description: 'Description',
        price: 1000,
        stock: 10,
        image_url: 'https://example.com/image.jpg',
        created_at: '2023-01-01T00:00:00Z',
        updated_at: '2023-01-02T00:00:00Z',
      };

      vi.mocked(controllers.getProductById).mockResolvedValue(product);

      const result = await productService.getProductById(1);

      expect(controllers.getProductById).toHaveBeenCalledWith(1);
      expect(result).toEqual(product);
    });
  });

  describe('updateProduct', () => {
    it('should call the controller updateProduct method with correct parameters', async () => {
      // Mock update data
      const updateData: Partial<CreateProductInput> = {
        name: 'Updated Product',
        price: 2000,
      };

      // Mock updated product
      const updatedProduct: Product = {
        id: 1,
        name: 'Updated Product',
        description: 'Description',
        price: 2000,
        stock: 10,
        image_url: 'https://example.com/image.jpg',
        created_at: '2023-01-01T00:00:00Z',
        updated_at: '2023-01-03T00:00:00Z',
      };

      vi.mocked(controllers.updateProduct).mockResolvedValue(updatedProduct);

      const result = await productService.updateProduct(1, updateData);

      expect(controllers.updateProduct).toHaveBeenCalledWith(1, updateData);
      expect(result).toEqual(updatedProduct);
    });
  });

  describe('deleteProduct', () => {
    it('should call the controller deleteProduct method with correct parameters', async () => {
      vi.mocked(controllers.deleteProduct).mockResolvedValue();

      await productService.deleteProduct(1);

      expect(controllers.deleteProduct).toHaveBeenCalledWith(1);
    });
  });

  describe('getLowStockProducts', () => {
    it('should return products with stock below the threshold', async () => {
      // Mock products data
      const mockProducts: Product[] = [
        {
          id: 1,
          name: 'Low Stock Product',
          description: 'Description 1',
          price: 1000,
          stock: 5,
          image_url: 'https://example.com/image1.jpg',
          created_at: '2023-01-01T00:00:00Z',
          updated_at: '2023-01-02T00:00:00Z',
        },
        {
          id: 2,
          name: 'High Stock Product',
          description: 'Description 2',
          price: 2000,
          stock: 20,
          image_url: 'https://example.com/image2.jpg',
          created_at: '2023-01-03T00:00:00Z',
          updated_at: '2023-01-04T00:00:00Z',
        },
      ];

      vi.mocked(controllers.getProducts).mockResolvedValue(mockProducts);

      // Test with default threshold (10)
      const result1 = await productService.getLowStockProducts();
      expect(controllers.getProducts).toHaveBeenCalledTimes(1);
      expect(result1).toEqual([mockProducts[0]]);

      // Test with custom threshold
      const result2 = await productService.getLowStockProducts(30);
      expect(controllers.getProducts).toHaveBeenCalledTimes(2);
      expect(result2).toEqual(mockProducts);
    });
  });

  describe('getProductsByPriceRange', () => {
    it('should return products within the specified price range', async () => {
      // Mock products data
      const mockProducts: Product[] = [
        {
          id: 1,
          name: 'Cheap Product',
          description: 'Description 1',
          price: 500,
          stock: 10,
          image_url: 'https://example.com/image1.jpg',
          created_at: '2023-01-01T00:00:00Z',
          updated_at: '2023-01-02T00:00:00Z',
        },
        {
          id: 2,
          name: 'Medium Product',
          description: 'Description 2',
          price: 1500,
          stock: 20,
          image_url: 'https://example.com/image2.jpg',
          created_at: '2023-01-03T00:00:00Z',
          updated_at: '2023-01-04T00:00:00Z',
        },
        {
          id: 3,
          name: 'Expensive Product',
          description: 'Description 3',
          price: 3000,
          stock: 5,
          image_url: 'https://example.com/image3.jpg',
          created_at: '2023-01-05T00:00:00Z',
          updated_at: '2023-01-06T00:00:00Z',
        },
      ];

      vi.mocked(controllers.getProducts).mockResolvedValue(mockProducts);

      const result = await productService.getProductsByPriceRange(1000, 2000);

      expect(controllers.getProducts).toHaveBeenCalledTimes(1);
      expect(result).toEqual([mockProducts[1]]);
    });
  });
});
