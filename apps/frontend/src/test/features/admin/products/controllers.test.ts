import {
  type CreateProductInput,
  type Product,
  createProduct,
  deleteProduct,
  getProductById,
  getProducts,
  updateProduct,
} from '@/features/admin/products/controllers';
import { productRepository } from '@/features/admin/products/repositories';
import { beforeEach, describe, expect, it, vi } from 'vitest';

// Mock the product repository
vi.mock('@/features/admin/products/repositories', () => ({
  productRepository: {
    getProducts: vi.fn(),
    createProduct: vi.fn(),
    getProductById: vi.fn(),
    updateProduct: vi.fn(),
    deleteProduct: vi.fn(),
  },
}));

describe('Product Controllers', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('getProducts', () => {
    it('should return products when API call is successful', async () => {
      // Mock successful response
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

      vi.mocked(productRepository.getProducts).mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({ products: mockProducts }),
      } as Response);

      const result = await getProducts();

      expect(productRepository.getProducts).toHaveBeenCalledTimes(1);
      expect(result).toEqual(mockProducts);
    });

    it('should throw error when API call fails', async () => {
      // Mock failed response
      vi.mocked(productRepository.getProducts).mockRejectedValue(
        new Error('API error')
      );

      // Mock console.error to prevent test output pollution
      const consoleErrorSpy = vi
        .spyOn(console, 'error')
        .mockImplementation(() => {});

      await expect(getProducts()).rejects.toThrow('API error');
      expect(productRepository.getProducts).toHaveBeenCalledTimes(1);
      expect(consoleErrorSpy).toHaveBeenCalled();

      // Clean up
      consoleErrorSpy.mockRestore();
    });
  });

  describe('createProduct', () => {
    it('should create and return a product when API call is successful', async () => {
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

      vi.mocked(productRepository.createProduct).mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({ product: createdProduct }),
      } as Response);

      const result = await createProduct(productData);

      expect(productRepository.createProduct).toHaveBeenCalledWith(productData);
      expect(result).toEqual(createdProduct);
    });

    it('should throw error when API call returns non-ok response', async () => {
      // Mock input data
      const productData: CreateProductInput = {
        name: 'New Product',
        description: 'New Description',
        price: 1500,
        stock: 15,
        image_url: 'https://example.com/new-image.jpg',
      };

      // Mock failed response
      vi.mocked(productRepository.createProduct).mockResolvedValue({
        ok: false,
        text: () => Promise.resolve('Invalid product data'),
      } as Response);

      // Mock console.error to prevent test output pollution
      const consoleErrorSpy = vi
        .spyOn(console, 'error')
        .mockImplementation(() => {});

      await expect(createProduct(productData)).rejects.toThrow(
        'Invalid product data'
      );
      expect(productRepository.createProduct).toHaveBeenCalledWith(productData);
      expect(consoleErrorSpy).toHaveBeenCalled();

      // Clean up
      consoleErrorSpy.mockRestore();
    });

    it('should throw error when API call fails', async () => {
      // Mock input data
      const productData: CreateProductInput = {
        name: 'New Product',
        description: 'New Description',
        price: 1500,
        stock: 15,
        image_url: 'https://example.com/new-image.jpg',
      };

      // Mock failed response
      vi.mocked(productRepository.createProduct).mockRejectedValue(
        new Error('Network error')
      );

      // Mock console.error to prevent test output pollution
      const consoleErrorSpy = vi
        .spyOn(console, 'error')
        .mockImplementation(() => {});

      await expect(createProduct(productData)).rejects.toThrow('Network error');
      expect(productRepository.createProduct).toHaveBeenCalledWith(productData);
      expect(consoleErrorSpy).toHaveBeenCalled();

      // Clean up
      consoleErrorSpy.mockRestore();
    });
  });

  describe('getProductById', () => {
    it('should return a product when API call is successful', async () => {
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

      vi.mocked(productRepository.getProductById).mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({ product }),
      } as Response);

      const result = await getProductById(1);

      expect(productRepository.getProductById).toHaveBeenCalledWith(1);
      expect(result).toEqual(product);
    });

    it('should throw error when API call returns non-ok response', async () => {
      // Mock failed response
      vi.mocked(productRepository.getProductById).mockResolvedValue({
        ok: false,
      } as Response);

      // Mock console.error to prevent test output pollution
      const consoleErrorSpy = vi
        .spyOn(console, 'error')
        .mockImplementation(() => {});

      await expect(getProductById(999)).rejects.toThrow('Product not found');
      expect(productRepository.getProductById).toHaveBeenCalledWith(999);
      expect(consoleErrorSpy).toHaveBeenCalled();

      // Clean up
      consoleErrorSpy.mockRestore();
    });

    it('should throw error when API call fails', async () => {
      // Mock failed response
      vi.mocked(productRepository.getProductById).mockRejectedValue(
        new Error('Network error')
      );

      // Mock console.error to prevent test output pollution
      const consoleErrorSpy = vi
        .spyOn(console, 'error')
        .mockImplementation(() => {});

      await expect(getProductById(1)).rejects.toThrow('Network error');
      expect(productRepository.getProductById).toHaveBeenCalledWith(1);
      expect(consoleErrorSpy).toHaveBeenCalled();

      // Clean up
      consoleErrorSpy.mockRestore();
    });
  });

  describe('updateProduct', () => {
    it('should update and return a product when API call is successful', async () => {
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

      vi.mocked(productRepository.updateProduct).mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({ product: updatedProduct }),
      } as Response);

      const result = await updateProduct(1, updateData);

      expect(productRepository.updateProduct).toHaveBeenCalledWith(
        1,
        updateData
      );
      expect(result).toEqual(updatedProduct);
    });

    it('should throw error when API call returns non-ok response', async () => {
      // Mock update data
      const updateData: Partial<CreateProductInput> = {
        name: 'Updated Product',
        price: 2000,
      };

      // Mock failed response
      vi.mocked(productRepository.updateProduct).mockResolvedValue({
        ok: false,
        text: () => Promise.resolve('Invalid update data'),
      } as Response);

      // Mock console.error to prevent test output pollution
      const consoleErrorSpy = vi
        .spyOn(console, 'error')
        .mockImplementation(() => {});

      await expect(updateProduct(1, updateData)).rejects.toThrow(
        'Invalid update data'
      );
      expect(productRepository.updateProduct).toHaveBeenCalledWith(
        1,
        updateData
      );
      expect(consoleErrorSpy).toHaveBeenCalled();

      // Clean up
      consoleErrorSpy.mockRestore();
    });

    it('should throw error when API call fails', async () => {
      // Mock update data
      const updateData: Partial<CreateProductInput> = {
        name: 'Updated Product',
        price: 2000,
      };

      // Mock failed response
      vi.mocked(productRepository.updateProduct).mockRejectedValue(
        new Error('Network error')
      );

      // Mock console.error to prevent test output pollution
      const consoleErrorSpy = vi
        .spyOn(console, 'error')
        .mockImplementation(() => {});

      await expect(updateProduct(1, updateData)).rejects.toThrow(
        'Network error'
      );
      expect(productRepository.updateProduct).toHaveBeenCalledWith(
        1,
        updateData
      );
      expect(consoleErrorSpy).toHaveBeenCalled();

      // Clean up
      consoleErrorSpy.mockRestore();
    });
  });

  describe('deleteProduct', () => {
    it('should delete a product when API call is successful', async () => {
      vi.mocked(productRepository.deleteProduct).mockResolvedValue({
        ok: true,
      } as Response);

      await deleteProduct(1);

      expect(productRepository.deleteProduct).toHaveBeenCalledWith(1);
    });

    it('should throw error when API call returns non-ok response', async () => {
      // Mock failed response
      vi.mocked(productRepository.deleteProduct).mockResolvedValue({
        ok: false,
        text: () => Promise.resolve('Product not found'),
      } as Response);

      // Mock console.error to prevent test output pollution
      const consoleErrorSpy = vi
        .spyOn(console, 'error')
        .mockImplementation(() => {});

      await expect(deleteProduct(999)).rejects.toThrow('Product not found');
      expect(productRepository.deleteProduct).toHaveBeenCalledWith(999);
      expect(consoleErrorSpy).toHaveBeenCalled();

      // Clean up
      consoleErrorSpy.mockRestore();
    });

    it('should throw error when API call fails', async () => {
      // Mock failed response
      vi.mocked(productRepository.deleteProduct).mockRejectedValue(
        new Error('Network error')
      );

      // Mock console.error to prevent test output pollution
      const consoleErrorSpy = vi
        .spyOn(console, 'error')
        .mockImplementation(() => {});

      await expect(deleteProduct(1)).rejects.toThrow('Network error');
      expect(productRepository.deleteProduct).toHaveBeenCalledWith(1);
      expect(consoleErrorSpy).toHaveBeenCalled();

      // Clean up
      consoleErrorSpy.mockRestore();
    });
  });
});
