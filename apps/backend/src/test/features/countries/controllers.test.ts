import { describe, it, expect, vi, beforeEach } from 'vitest';
import { 
  getCountries, 
  getCountryById, 
  createCountry, 
  updateCountry, 
  deleteCountry 
} from '../../../features/countries/controllers';
import { countriesTable } from '../../../db/schema';
import * as dbModule from '../../../common/utils/db';

// Mock country data
const mockCountry = {
  id: 1,
  name: '日本',
  code: 'JP',
  flag_url: 'https://example.com/flags/jp.png',
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
  returning: vi.fn().mockResolvedValue([mockCountry])
};

describe('Country Controllers', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(dbModule.getDB).mockReturnValue(mockDbClient);
  });

  describe('getCountries', () => {
    it('should return all countries', async () => {
      const mockContext = createMockContext();
      mockDbClient.select.mockReturnThis();
      mockDbClient.from.mockReturnThis();
      mockDbClient.from.mockResolvedValueOnce([mockCountry]);

      const result = await getCountries(mockContext);

      expect(mockContext.json).toHaveBeenCalledWith({ countries: [mockCountry] });
    });

    it('should handle errors', async () => {
      const mockContext = createMockContext();
      mockDbClient.select.mockReturnThis();
      mockDbClient.from.mockRejectedValueOnce(new Error('Database error'));

      const result = await getCountries(mockContext);

      expect(mockContext.json).toHaveBeenCalledWith({ error: 'Database error' }, 500);
    });
  });

  describe('getCountryById', () => {
    it('should return a country by id', async () => {
      const mockContext = createMockContext({}, { id: '1' });
      mockDbClient.select.mockReturnThis();
      mockDbClient.from.mockReturnThis();
      mockDbClient.where.mockResolvedValueOnce([mockCountry]);

      const result = await getCountryById(mockContext);

      expect(mockContext.req.param).toHaveBeenCalledWith('id');
      expect(mockContext.json).toHaveBeenCalledWith({ country: mockCountry });
    });

    it('should return 404 if country not found', async () => {
      const mockContext = createMockContext({}, { id: '999' });
      mockDbClient.select.mockReturnThis();
      mockDbClient.from.mockReturnThis();
      mockDbClient.where.mockResolvedValueOnce([]);

      const result = await getCountryById(mockContext);

      expect(mockContext.json).toHaveBeenCalledWith({ error: '国が見つかりません' }, 404);
    });

    it('should handle errors', async () => {
      const mockContext = createMockContext({}, { id: '1' });
      mockDbClient.select.mockReturnThis();
      mockDbClient.from.mockReturnThis();
      mockDbClient.where.mockRejectedValueOnce(new Error('Database error'));

      const result = await getCountryById(mockContext);

      expect(mockContext.json).toHaveBeenCalledWith({ error: 'Database error' }, 500);
    });
  });

  describe('createCountry', () => {
    it('should create a new country and return it', async () => {
      const mockBody = {
        name: '日本',
        code: 'JP',
        flag_url: 'https://example.com/flags/jp.png'
      };
      const mockContext = createMockContext(mockBody);

      const result = await createCountry(mockContext);

      expect(mockContext.req.valid).toHaveBeenCalledWith('json');
      expect(mockContext.json).toHaveBeenCalledWith({ country: mockCountry }, 201);
    });

    it('should handle errors', async () => {
      const mockBody = {
        name: '日本',
        code: 'JP',
        flag_url: 'https://example.com/flags/jp.png'
      };
      const mockContext = createMockContext(mockBody);

      // Override the mock to throw an error
      mockDbClient.returning.mockRejectedValueOnce(new Error('Database error'));

      const result = await createCountry(mockContext);

      expect(mockContext.json).toHaveBeenCalledWith({ error: 'Database error' }, 500);
    });
  });

  describe('updateCountry', () => {
    it('should update a country and return it', async () => {
      const mockBody = {
        name: '日本（更新）',
        code: 'JPN',
        flag_url: 'https://example.com/flags/japan.png'
      };
      const mockContext = createMockContext(mockBody, { id: '1' });
      
      // Mock the first query to check if country exists
      mockDbClient.select.mockReturnThis();
      mockDbClient.from.mockReturnThis();
      mockDbClient.where.mockResolvedValueOnce([mockCountry]);

      const result = await updateCountry(mockContext);

      expect(mockContext.req.valid).toHaveBeenCalledWith('json');
      expect(mockContext.req.param).toHaveBeenCalledWith('id');
      expect(mockContext.json).toHaveBeenCalledWith({ country: mockCountry });
    });

    it('should return 404 if country not found', async () => {
      const mockBody = {
        name: '日本（更新）',
        code: 'JPN'
      };
      const mockContext = createMockContext(mockBody, { id: '999' });
      
      // Mock the first query to check if country exists
      mockDbClient.select.mockReturnThis();
      mockDbClient.from.mockReturnThis();
      mockDbClient.where.mockResolvedValueOnce([]);

      const result = await updateCountry(mockContext);

      expect(mockContext.json).toHaveBeenCalledWith({ error: '国が見つかりません' }, 404);
    });

    it('should handle errors', async () => {
      const mockBody = {
        name: '日本（更新）',
        code: 'JPN'
      };
      const mockContext = createMockContext(mockBody, { id: '1' });
      
      // Mock the first query to throw an error
      mockDbClient.select.mockReturnThis();
      mockDbClient.from.mockReturnThis();
      mockDbClient.where.mockRejectedValueOnce(new Error('Database error'));

      const result = await updateCountry(mockContext);

      expect(mockContext.json).toHaveBeenCalledWith({ error: 'Database error' }, 500);
    });
  });

  describe('deleteCountry', () => {
    it('should delete a country and return success message', async () => {
      const mockContext = createMockContext({}, { id: '1' });
      
      // Mock the first query to check if country exists
      mockDbClient.select.mockReturnThis();
      mockDbClient.from.mockReturnThis();
      mockDbClient.where.mockResolvedValueOnce([mockCountry]);

      const result = await deleteCountry(mockContext);

      expect(mockContext.req.param).toHaveBeenCalledWith('id');
      expect(mockContext.json).toHaveBeenCalledWith({ success: true, message: '国が削除されました' });
    });

    it('should return 404 if country not found', async () => {
      const mockContext = createMockContext({}, { id: '999' });
      
      // Mock the first query to check if country exists
      mockDbClient.select.mockReturnThis();
      mockDbClient.from.mockReturnThis();
      mockDbClient.where.mockResolvedValueOnce([]);

      const result = await deleteCountry(mockContext);

      expect(mockContext.json).toHaveBeenCalledWith({ error: '国が見つかりません' }, 404);
    });

    it('should handle errors', async () => {
      const mockContext = createMockContext({}, { id: '1' });
      
      // Mock the first query to throw an error
      mockDbClient.select.mockReturnThis();
      mockDbClient.from.mockReturnThis();
      mockDbClient.where.mockRejectedValueOnce(new Error('Database error'));

      const result = await deleteCountry(mockContext);

      expect(mockContext.json).toHaveBeenCalledWith({ error: 'Database error' }, 500);
    });
  });
});