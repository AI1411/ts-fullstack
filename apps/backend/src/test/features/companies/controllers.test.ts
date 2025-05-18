import { beforeEach, describe, expect, it, vi } from 'vitest';
import * as dbModule from '../../../common/utils/db';
import { companiesTable } from '../../../db/schema';
import {
  createCompany,
  deleteCompany,
  getCompanies,
  getCompanyById,
  updateCompany,
} from '../../../features/companies/controllers';

// Mock company data
const mockCompany = {
  id: 1,
  name: 'テスト会社',
  description: 'テスト用の会社です',
  address: '東京都渋谷区',
  phone: '03-1234-5678',
  email: 'test@example.com',
  website: 'https://example.com',
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
  insert: vi.fn().mockReturnThis(),
  values: vi.fn().mockReturnThis(),
  update: vi.fn().mockReturnThis(),
  set: vi.fn().mockReturnThis(),
  delete: vi.fn().mockReturnThis(),
  returning: vi.fn().mockResolvedValue([mockCompany]),
};

describe('Company Controllers', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(dbModule.getDB).mockReturnValue(mockDbClient);
  });

  describe('getCompanies', () => {
    it('should return all companies', async () => {
      const mockContext = createMockContext();
      mockDbClient.select.mockReturnThis();
      mockDbClient.from.mockReturnThis();
      mockDbClient.from.mockResolvedValueOnce([mockCompany]);

      const result = await getCompanies(mockContext);

      expect(mockContext.json).toHaveBeenCalledWith({
        companies: [mockCompany],
      });
    });

    it('should handle errors', async () => {
      const mockContext = createMockContext();
      mockDbClient.select.mockReturnThis();
      mockDbClient.from.mockRejectedValueOnce(new Error('Database error'));

      const result = await getCompanies(mockContext);

      expect(mockContext.json).toHaveBeenCalledWith(
        { error: 'Database error' },
        500
      );
    });
  });

  describe('getCompanyById', () => {
    it('should return a company by id', async () => {
      const mockContext = createMockContext({}, { id: '1' });
      mockDbClient.select.mockReturnThis();
      mockDbClient.from.mockReturnThis();
      mockDbClient.where.mockResolvedValueOnce([mockCompany]);

      const result = await getCompanyById(mockContext);

      expect(mockContext.req.param).toHaveBeenCalledWith('id');
      expect(mockContext.json).toHaveBeenCalledWith({ company: mockCompany });
    });

    it('should return 404 if company not found', async () => {
      const mockContext = createMockContext({}, { id: '999' });
      mockDbClient.select.mockReturnThis();
      mockDbClient.from.mockReturnThis();
      mockDbClient.where.mockResolvedValueOnce([]);

      const result = await getCompanyById(mockContext);

      expect(mockContext.json).toHaveBeenCalledWith(
        { error: '会社が見つかりません' },
        404
      );
    });

    it('should handle errors', async () => {
      const mockContext = createMockContext({}, { id: '1' });
      mockDbClient.select.mockReturnThis();
      mockDbClient.from.mockReturnThis();
      mockDbClient.where.mockRejectedValueOnce(new Error('Database error'));

      const result = await getCompanyById(mockContext);

      expect(mockContext.json).toHaveBeenCalledWith(
        { error: 'Database error' },
        500
      );
    });
  });

  describe('createCompany', () => {
    it('should create a new company and return it', async () => {
      const mockBody = {
        name: 'テスト会社',
        description: 'テスト用の会社です',
        address: '東京都渋谷区',
        phone: '03-1234-5678',
        email: 'test@example.com',
        website: 'https://example.com',
      };
      const mockContext = createMockContext(mockBody);

      const result = await createCompany(mockContext);

      expect(mockContext.req.valid).toHaveBeenCalledWith('json');
      expect(mockContext.json).toHaveBeenCalledWith(
        { company: mockCompany },
        201
      );
    });

    it('should handle errors', async () => {
      const mockBody = {
        name: 'テスト会社',
        description: 'テスト用の会社です',
        address: '東京都渋谷区',
        phone: '03-1234-5678',
        email: 'test@example.com',
        website: 'https://example.com',
      };
      const mockContext = createMockContext(mockBody);

      // Override the mock to throw an error
      mockDbClient.returning.mockRejectedValueOnce(new Error('Database error'));

      const result = await createCompany(mockContext);

      expect(mockContext.json).toHaveBeenCalledWith(
        { error: 'Database error' },
        500
      );
    });
  });

  describe('updateCompany', () => {
    it('should update a company and return it', async () => {
      const mockBody = {
        name: '更新された会社名',
        description: '更新された説明',
        address: '更新された住所',
        phone: '更新された電話番号',
        email: 'updated@example.com',
        website: 'https://updated-example.com',
      };
      const mockContext = createMockContext(mockBody, { id: '1' });

      // Mock the first query to check if company exists
      mockDbClient.select.mockReturnThis();
      mockDbClient.from.mockReturnThis();
      mockDbClient.where.mockResolvedValueOnce([mockCompany]);

      const result = await updateCompany(mockContext);

      expect(mockContext.req.valid).toHaveBeenCalledWith('json');
      expect(mockContext.req.param).toHaveBeenCalledWith('id');
      expect(mockContext.json).toHaveBeenCalledWith({ company: mockCompany });
    });

    it('should return 404 if company not found', async () => {
      const mockBody = {
        name: '更新された会社名',
        description: '更新された説明',
      };
      const mockContext = createMockContext(mockBody, { id: '999' });

      // Mock the first query to check if company exists
      mockDbClient.select.mockReturnThis();
      mockDbClient.from.mockReturnThis();
      mockDbClient.where.mockResolvedValueOnce([]);

      const result = await updateCompany(mockContext);

      expect(mockContext.json).toHaveBeenCalledWith(
        { error: '会社が見つかりません' },
        404
      );
    });

    it('should handle errors', async () => {
      const mockBody = {
        name: '更新された会社名',
        description: '更新された説明',
      };
      const mockContext = createMockContext(mockBody, { id: '1' });

      // Mock the first query to throw an error
      mockDbClient.select.mockReturnThis();
      mockDbClient.from.mockReturnThis();
      mockDbClient.where.mockRejectedValueOnce(new Error('Database error'));

      const result = await updateCompany(mockContext);

      expect(mockContext.json).toHaveBeenCalledWith(
        { error: 'Database error' },
        500
      );
    });
  });

  describe('deleteCompany', () => {
    it('should delete a company and return success message', async () => {
      const mockContext = createMockContext({}, { id: '1' });

      // Mock the first query to check if company exists
      mockDbClient.select.mockReturnThis();
      mockDbClient.from.mockReturnThis();
      mockDbClient.where.mockResolvedValueOnce([mockCompany]);

      const result = await deleteCompany(mockContext);

      expect(mockContext.req.param).toHaveBeenCalledWith('id');
      expect(mockContext.json).toHaveBeenCalledWith({
        success: true,
        message: '会社が削除されました',
      });
    });

    it('should return 404 if company not found', async () => {
      const mockContext = createMockContext({}, { id: '999' });

      // Mock the first query to check if company exists
      mockDbClient.select.mockReturnThis();
      mockDbClient.from.mockReturnThis();
      mockDbClient.where.mockResolvedValueOnce([]);

      const result = await deleteCompany(mockContext);

      expect(mockContext.json).toHaveBeenCalledWith(
        { error: '会社が見つかりません' },
        404
      );
    });

    it('should handle errors', async () => {
      const mockContext = createMockContext({}, { id: '1' });

      // Mock the first query to throw an error
      mockDbClient.select.mockReturnThis();
      mockDbClient.from.mockReturnThis();
      mockDbClient.where.mockRejectedValueOnce(new Error('Database error'));

      const result = await deleteCompany(mockContext);

      expect(mockContext.json).toHaveBeenCalledWith(
        { error: 'Database error' },
        500
      );
    });
  });
});
