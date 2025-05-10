import { describe, it, expect, vi, beforeEach } from 'vitest';
import { createProduct, getProducts, getProductById, updateProduct, deleteProduct } from '../../../features/products/controllers';
import { productsTable } from '../../../db/schema';
import * as dbModule from '../../../common/utils/db';

// Mock product data
const mockProduct = {
  id: 1,
  name: 'Test Product',
  description: 'Test Description',
  price: 1000,
  stock: 10,
  image_url: 'https://example.com/image.jpg',
  created_at: new Date(),
  updated_at: new Date()
};

// Mock the database module
vi.mock('../../../common/utils/db', () => ({
  getDB: vi.fn()
}));

// Mock context
const createMockContext = (body = {}, params = {}) => ({
  req: {
    valid: vi.fn().mockReturnValue(body),
    param: vi.fn((key) => params[key])
  },
  json: vi.fn().mockImplementation((data, status) => ({ data, status })),
  env: {
    DATABASE_URL: 'postgres://test:test@localhost:5432/test'
  }
});

// Mock DB client
const mockDbClient = {
  select: vi.fn().mockReturnThis(),
  from: vi.fn().mockReturnThis(),
  where: vi.fn().mockReturnThis(),
  insert: vi.fn().mockReturnThis(),
  values: vi.fn().mockReturnThis(),
  update: vi.fn().mockReturnThis(),
  set: vi.fn().mockReturnThis(),
  delete: vi.fn().mockReturnThis(),
  returning: vi.fn().mockResolvedValue([mockProduct])
};

describe('Product Controllers', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(dbModule.getDB).mockReturnValue(mockDbClient);
  });

  describe('createProduct', () => {
    it('should create a new product and return it', async () => {
      const mockBody = {
        name: 'Test Product',
        description: 'Test Description',
        price: 1000,
        stock: 10,
        image_url: 'https://example.com/image.jpg'
      };
      const mockContext = createMockContext(mockBody);

      const result = await createProduct(mockContext);

      expect(mockContext.req.valid).toHaveBeenCalledWith('json');
      expect(mockContext.json).toHaveBeenCalledWith({ product: mockProduct }, 201);
    });

    it('should handle errors', async () => {
      const mockBody = {
        name: 'Test Product',
        description: 'Test Description',
        price: 1000,
        stock: 10,
        image_url: 'https://example.com/image.jpg'
      };
      const mockContext = createMockContext(mockBody);

      // Override the mock to throw an error
      mockDbClient.returning.mockRejectedValueOnce(new Error('Database error'));

      const result = await createProduct(mockContext);

      expect(mockContext.json).toHaveBeenCalledWith({ error: 'Database error' }, 500);
    });
  });

  describe('getProducts', () => {
    it('should return all products', async () => {
      const mockContext = createMockContext();
      mockDbClient.select.mockReturnThis();
      mockDbClient.from.mockReturnThis();
      mockDbClient.from.mockResolvedValueOnce([mockProduct]);

      const result = await getProducts(mockContext);

      expect(mockContext.json).toHaveBeenCalledWith({ products: [mockProduct] });
    });

    it('should handle errors', async () => {
      const mockContext = createMockContext();
      mockDbClient.select.mockReturnThis();
      mockDbClient.from.mockRejectedValueOnce(new Error('Database error'));

      const result = await getProducts(mockContext);

      expect(mockContext.json).toHaveBeenCalledWith({ error: 'Database error' }, 500);
    });
  });

  describe('getProductById', () => {
    it('should return a product by id', async () => {
      const mockContext = createMockContext({}, { id: '1' });
      mockDbClient.select.mockReturnThis();
      mockDbClient.from.mockReturnThis();
      mockDbClient.where.mockReturnThis();
      mockDbClient.where.mockResolvedValueOnce([mockProduct]);

      const result = await getProductById(mockContext);

      expect(mockContext.req.param).toHaveBeenCalledWith('id');
      expect(mockContext.json).toHaveBeenCalledWith({ product: mockProduct });
    });

    it('should return 404 if product not found', async () => {
      const mockContext = createMockContext({}, { id: '999' });
      mockDbClient.select.mockReturnThis();
      mockDbClient.from.mockReturnThis();
      mockDbClient.where.mockReturnThis();
      mockDbClient.where.mockResolvedValueOnce([]);

      const result = await getProductById(mockContext);

      expect(mockContext.json).toHaveBeenCalledWith({ error: '商品が見つかりません' }, 404);
    });

    it('should handle errors', async () => {
      const mockContext = createMockContext({}, { id: '1' });
      mockDbClient.select.mockReturnThis();
      mockDbClient.from.mockReturnThis();
      mockDbClient.where.mockReturnThis();
      mockDbClient.where.mockRejectedValueOnce(new Error('Database error'));

      const result = await getProductById(mockContext);

      expect(mockContext.json).toHaveBeenCalledWith({ error: 'Database error' }, 500);
    });
  });

  describe('updateProduct', () => {
    it('should update a product and return it', async () => {
      const mockBody = {
        name: 'Updated Product',
        description: 'Updated Description',
        price: 2000,
        stock: 20,
        image_url: 'https://example.com/updated.jpg'
      };
      const mockContext = createMockContext(mockBody, { id: '1' });
      
      // Mock the existence check
      mockDbClient.select.mockReturnThis();
      mockDbClient.from.mockReturnThis();
      mockDbClient.where.mockReturnThis();
      mockDbClient.where.mockResolvedValueOnce([mockProduct]);
      
      // Mock the update
      mockDbClient.update.mockReturnThis();
      mockDbClient.set.mockReturnThis();
      mockDbClient.where.mockReturnThis();
      mockDbClient.returning.mockResolvedValueOnce([{...mockProduct, ...mockBody}]);

      const result = await updateProduct(mockContext);

      expect(mockContext.req.valid).toHaveBeenCalledWith('json');
      expect(mockContext.req.param).toHaveBeenCalledWith('id');
      expect(mockContext.json).toHaveBeenCalledWith({ product: expect.objectContaining({...mockProduct, ...mockBody}) });
    });

    it('should return 404 if product not found', async () => {
      const mockBody = {
        name: 'Updated Product',
        price: 2000
      };
      const mockContext = createMockContext(mockBody, { id: '999' });
      
      // Mock the existence check to return empty array
      mockDbClient.select.mockReturnThis();
      mockDbClient.from.mockReturnThis();
      mockDbClient.where.mockReturnThis();
      mockDbClient.where.mockResolvedValueOnce([]);

      const result = await updateProduct(mockContext);

      expect(mockContext.json).toHaveBeenCalledWith({ error: '商品が見つかりません' }, 404);
    });

    it('should handle errors', async () => {
      const mockBody = {
        name: 'Updated Product',
        price: 2000
      };
      const mockContext = createMockContext(mockBody, { id: '1' });
      
      // Mock the existence check to throw error
      mockDbClient.select.mockReturnThis();
      mockDbClient.from.mockReturnThis();
      mockDbClient.where.mockReturnThis();
      mockDbClient.where.mockRejectedValueOnce(new Error('Database error'));

      const result = await updateProduct(mockContext);

      expect(mockContext.json).toHaveBeenCalledWith({ error: 'Database error' }, 500);
    });
  });

  describe('deleteProduct', () => {
    it('should delete a product and return success message', async () => {
      const mockContext = createMockContext({}, { id: '1' });
      
      // Mock the existence check
      mockDbClient.select.mockReturnThis();
      mockDbClient.from.mockReturnThis();
      mockDbClient.where.mockReturnThis();
      mockDbClient.where.mockResolvedValueOnce([mockProduct]);
      
      // Mock the delete
      mockDbClient.delete.mockReturnThis();
      mockDbClient.where.mockReturnThis();

      const result = await deleteProduct(mockContext);

      expect(mockContext.req.param).toHaveBeenCalledWith('id');
      expect(mockContext.json).toHaveBeenCalledWith({ success: true, message: '商品が削除されました' });
    });

    it('should return 404 if product not found', async () => {
      const mockContext = createMockContext({}, { id: '999' });
      
      // Mock the existence check to return empty array
      mockDbClient.select.mockReturnThis();
      mockDbClient.from.mockReturnThis();
      mockDbClient.where.mockReturnThis();
      mockDbClient.where.mockResolvedValueOnce([]);

      const result = await deleteProduct(mockContext);

      expect(mockContext.json).toHaveBeenCalledWith({ error: '商品が見つかりません' }, 404);
    });

    it('should handle errors', async () => {
      const mockContext = createMockContext({}, { id: '1' });
      
      // Mock the existence check to throw error
      mockDbClient.select.mockReturnThis();
      mockDbClient.from.mockReturnThis();
      mockDbClient.where.mockReturnThis();
      mockDbClient.where.mockRejectedValueOnce(new Error('Database error'));

      const result = await deleteProduct(mockContext);

      expect(mockContext.json).toHaveBeenCalledWith({ error: 'Database error' }, 500);
    });
  });
});