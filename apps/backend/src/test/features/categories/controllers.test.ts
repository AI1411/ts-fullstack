import { describe, it, expect, vi, beforeEach } from 'vitest';
import { 
  getCategories, 
  getCategoryById, 
  getProductsByCategory, 
  createCategory, 
  updateCategory, 
  deleteCategory 
} from '../../../features/categories/controllers';
import { categoriesTable, productsTable } from '../../../db/schema';
import * as dbModule from '../../../common/utils/db';

// Mock category data
const mockCategory = {
  id: 1,
  name: 'テストカテゴリ',
  description: 'テスト用のカテゴリです',
  created_at: new Date(),
  updated_at: new Date()
};

// Mock product data
const mockProduct = {
  id: 1,
  category_id: 1,
  name: 'テスト商品',
  description: 'テスト用の商品です',
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
  returning: vi.fn().mockResolvedValue([mockCategory])
};

describe('Category Controllers', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(dbModule.getDB).mockReturnValue(mockDbClient);
  });

  describe('getCategories', () => {
    it('should return all categories', async () => {
      const mockContext = createMockContext();
      mockDbClient.select.mockReturnThis();
      mockDbClient.from.mockReturnThis();
      mockDbClient.from.mockResolvedValueOnce([mockCategory]);

      const result = await getCategories(mockContext);

      expect(mockContext.json).toHaveBeenCalledWith({ categories: [mockCategory] });
    });

    it('should handle errors', async () => {
      const mockContext = createMockContext();
      mockDbClient.select.mockReturnThis();
      mockDbClient.from.mockRejectedValueOnce(new Error('Database error'));

      const result = await getCategories(mockContext);

      expect(mockContext.json).toHaveBeenCalledWith({ error: 'Database error' }, 500);
    });
  });

  describe('getCategoryById', () => {
    it('should return a category by id', async () => {
      const mockContext = createMockContext({}, { id: '1' });
      mockDbClient.select.mockReturnThis();
      mockDbClient.from.mockReturnThis();
      mockDbClient.where.mockResolvedValueOnce([mockCategory]);

      const result = await getCategoryById(mockContext);

      expect(mockContext.req.param).toHaveBeenCalledWith('id');
      expect(mockContext.json).toHaveBeenCalledWith({ category: mockCategory });
    });

    it('should return 404 if category not found', async () => {
      const mockContext = createMockContext({}, { id: '999' });
      mockDbClient.select.mockReturnThis();
      mockDbClient.from.mockReturnThis();
      mockDbClient.where.mockResolvedValueOnce([]);

      const result = await getCategoryById(mockContext);

      expect(mockContext.json).toHaveBeenCalledWith({ error: 'カテゴリが見つかりません' }, 404);
    });

    it('should handle errors', async () => {
      const mockContext = createMockContext({}, { id: '1' });
      mockDbClient.select.mockReturnThis();
      mockDbClient.from.mockReturnThis();
      mockDbClient.where.mockRejectedValueOnce(new Error('Database error'));

      const result = await getCategoryById(mockContext);

      expect(mockContext.json).toHaveBeenCalledWith({ error: 'Database error' }, 500);
    });
  });

  describe('getProductsByCategory', () => {
    it('should return products by category id', async () => {
      const mockContext = createMockContext({}, { id: '1' });
      mockDbClient.select.mockReturnThis();
      mockDbClient.from.mockReturnThis();
      mockDbClient.where.mockResolvedValueOnce([mockCategory]);
      
      // Mock the second query for products
      mockDbClient.select.mockReturnThis();
      mockDbClient.from.mockReturnThis();
      mockDbClient.where.mockResolvedValueOnce([mockProduct]);

      const result = await getProductsByCategory(mockContext);

      expect(mockContext.req.param).toHaveBeenCalledWith('id');
      expect(mockContext.json).toHaveBeenCalledWith({ products: [mockProduct] });
    });

    it('should return 404 if category not found', async () => {
      const mockContext = createMockContext({}, { id: '999' });
      mockDbClient.select.mockReturnThis();
      mockDbClient.from.mockReturnThis();
      mockDbClient.where.mockResolvedValueOnce([]);

      const result = await getProductsByCategory(mockContext);

      expect(mockContext.json).toHaveBeenCalledWith({ error: 'カテゴリが見つかりません' }, 404);
    });

    it('should handle errors', async () => {
      const mockContext = createMockContext({}, { id: '1' });
      mockDbClient.select.mockReturnThis();
      mockDbClient.from.mockReturnThis();
      mockDbClient.where.mockRejectedValueOnce(new Error('Database error'));

      const result = await getProductsByCategory(mockContext);

      expect(mockContext.json).toHaveBeenCalledWith({ error: 'Database error' }, 500);
    });
  });

  describe('createCategory', () => {
    it('should create a new category and return it', async () => {
      const mockBody = {
        name: 'テストカテゴリ',
        description: 'テスト用のカテゴリです'
      };
      const mockContext = createMockContext(mockBody);

      const result = await createCategory(mockContext);

      expect(mockContext.req.valid).toHaveBeenCalledWith('json');
      expect(mockContext.json).toHaveBeenCalledWith({ category: mockCategory }, 201);
    });

    it('should handle errors', async () => {
      const mockBody = {
        name: 'テストカテゴリ',
        description: 'テスト用のカテゴリです'
      };
      const mockContext = createMockContext(mockBody);

      // Override the mock to throw an error
      mockDbClient.returning.mockRejectedValueOnce(new Error('Database error'));

      const result = await createCategory(mockContext);

      expect(mockContext.json).toHaveBeenCalledWith({ error: 'Database error' }, 500);
    });
  });

  describe('updateCategory', () => {
    it('should update a category and return it', async () => {
      const mockBody = {
        name: '更新されたカテゴリ名',
        description: '更新された説明'
      };
      const mockContext = createMockContext(mockBody, { id: '1' });
      
      // Mock the first query to check if category exists
      mockDbClient.select.mockReturnThis();
      mockDbClient.from.mockReturnThis();
      mockDbClient.where.mockResolvedValueOnce([mockCategory]);

      const result = await updateCategory(mockContext);

      expect(mockContext.req.valid).toHaveBeenCalledWith('json');
      expect(mockContext.req.param).toHaveBeenCalledWith('id');
      expect(mockContext.json).toHaveBeenCalledWith({ category: mockCategory });
    });

    it('should return 404 if category not found', async () => {
      const mockBody = {
        name: '更新されたカテゴリ名',
        description: '更新された説明'
      };
      const mockContext = createMockContext(mockBody, { id: '999' });
      
      // Mock the first query to check if category exists
      mockDbClient.select.mockReturnThis();
      mockDbClient.from.mockReturnThis();
      mockDbClient.where.mockResolvedValueOnce([]);

      const result = await updateCategory(mockContext);

      expect(mockContext.json).toHaveBeenCalledWith({ error: 'カテゴリが見つかりません' }, 404);
    });

    it('should handle errors', async () => {
      const mockBody = {
        name: '更新されたカテゴリ名',
        description: '更新された説明'
      };
      const mockContext = createMockContext(mockBody, { id: '1' });
      
      // Mock the first query to throw an error
      mockDbClient.select.mockReturnThis();
      mockDbClient.from.mockReturnThis();
      mockDbClient.where.mockRejectedValueOnce(new Error('Database error'));

      const result = await updateCategory(mockContext);

      expect(mockContext.json).toHaveBeenCalledWith({ error: 'Database error' }, 500);
    });
  });

  describe('deleteCategory', () => {
    it('should delete a category and return success message', async () => {
      const mockContext = createMockContext({}, { id: '1' });
      
      // Mock the first query to check if category exists
      mockDbClient.select.mockReturnThis();
      mockDbClient.from.mockReturnThis();
      mockDbClient.where.mockResolvedValueOnce([mockCategory]);

      const result = await deleteCategory(mockContext);

      expect(mockContext.req.param).toHaveBeenCalledWith('id');
      expect(mockContext.json).toHaveBeenCalledWith({ success: true, message: 'カテゴリが削除されました' });
    });

    it('should return 404 if category not found', async () => {
      const mockContext = createMockContext({}, { id: '999' });
      
      // Mock the first query to check if category exists
      mockDbClient.select.mockReturnThis();
      mockDbClient.from.mockReturnThis();
      mockDbClient.where.mockResolvedValueOnce([]);

      const result = await deleteCategory(mockContext);

      expect(mockContext.json).toHaveBeenCalledWith({ error: 'カテゴリが見つかりません' }, 404);
    });

    it('should handle errors', async () => {
      const mockContext = createMockContext({}, { id: '1' });
      
      // Mock the first query to throw an error
      mockDbClient.select.mockReturnThis();
      mockDbClient.from.mockReturnThis();
      mockDbClient.where.mockRejectedValueOnce(new Error('Database error'));

      const result = await deleteCategory(mockContext);

      expect(mockContext.json).toHaveBeenCalledWith({ error: 'Database error' }, 500);
    });
  });
});