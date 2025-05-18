import { beforeEach, describe, expect, it, vi } from 'vitest';
import * as dbModule from '../../../common/utils/db';
import { contactsTable } from '../../../db/schema';
import {
  createContact,
  deleteContact,
  getContactById,
  getContacts,
  updateContact,
} from '../../../features/contacts/controllers';

// Mock contact data
const mockContact = {
  id: 1,
  name: 'テストユーザー',
  email: 'test@example.com',
  phone: '03-1234-5678',
  subject: 'お問い合わせテスト',
  message: 'これはテスト用のお問い合わせメッセージです。',
  status: 'PENDING',
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
  returning: vi.fn().mockResolvedValue([mockContact]),
  orderBy: vi.fn().mockReturnThis(),
};

describe('Contact Controllers', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(dbModule.getDB).mockReturnValue(mockDbClient);
  });

  describe('createContact', () => {
    it('should create a new contact and return it', async () => {
      const mockBody = {
        name: 'テストユーザー',
        email: 'test@example.com',
        phone: '03-1234-5678',
        subject: 'お問い合わせテスト',
        message: 'これはテスト用のお問い合わせメッセージです。',
      };
      const mockContext = createMockContext(mockBody);

      const result = await createContact(mockContext);

      expect(mockContext.req.valid).toHaveBeenCalledWith('json');
      expect(mockContext.json).toHaveBeenCalledWith(
        { contact: mockContact },
        201
      );
    });

    it('should handle errors', async () => {
      const mockBody = {
        name: 'テストユーザー',
        email: 'test@example.com',
        phone: '03-1234-5678',
        subject: 'お問い合わせテスト',
        message: 'これはテスト用のお問い合わせメッセージです。',
      };
      const mockContext = createMockContext(mockBody);

      // Override the mock to throw an error
      mockDbClient.returning.mockRejectedValueOnce(new Error('Database error'));

      const result = await createContact(mockContext);

      expect(mockContext.json).toHaveBeenCalledWith(
        { error: 'Database error' },
        500
      );
    });
  });

  describe('getContacts', () => {
    it('should return all contacts', async () => {
      const mockContext = createMockContext();
      mockDbClient.select.mockReturnThis();
      mockDbClient.from.mockReturnThis();
      mockDbClient.orderBy.mockResolvedValueOnce([mockContact]);

      const result = await getContacts(mockContext);

      expect(mockContext.json).toHaveBeenCalledWith({
        contacts: [mockContact],
      });
    });

    it('should handle errors', async () => {
      const mockContext = createMockContext();
      mockDbClient.select.mockReturnThis();
      mockDbClient.from.mockReturnThis();
      mockDbClient.orderBy.mockRejectedValueOnce(new Error('Database error'));

      const result = await getContacts(mockContext);

      expect(mockContext.json).toHaveBeenCalledWith(
        { error: 'Database error' },
        500
      );
    });
  });

  describe('getContactById', () => {
    it('should return a contact by id', async () => {
      const mockContext = createMockContext({}, { id: '1' });
      mockDbClient.select.mockReturnThis();
      mockDbClient.from.mockReturnThis();
      mockDbClient.where.mockResolvedValueOnce([mockContact]);

      const result = await getContactById(mockContext);

      expect(mockContext.req.param).toHaveBeenCalledWith('id');
      expect(mockContext.json).toHaveBeenCalledWith({ contact: mockContact });
    });

    it('should return 404 if contact not found', async () => {
      const mockContext = createMockContext({}, { id: '999' });
      mockDbClient.select.mockReturnThis();
      mockDbClient.from.mockReturnThis();
      mockDbClient.where.mockResolvedValueOnce([]);

      const result = await getContactById(mockContext);

      expect(mockContext.json).toHaveBeenCalledWith(
        { error: 'お問い合わせが見つかりません' },
        404
      );
    });

    it('should handle errors', async () => {
      const mockContext = createMockContext({}, { id: '1' });
      mockDbClient.select.mockReturnThis();
      mockDbClient.from.mockReturnThis();
      mockDbClient.where.mockRejectedValueOnce(new Error('Database error'));

      const result = await getContactById(mockContext);

      expect(mockContext.json).toHaveBeenCalledWith(
        { error: 'Database error' },
        500
      );
    });
  });

  describe('updateContact', () => {
    it('should update a contact status and return it', async () => {
      const mockBody = {
        status: 'RESOLVED',
      };
      const mockContext = createMockContext(mockBody, { id: '1' });

      // Mock the first query to check if contact exists
      mockDbClient.select.mockReturnThis();
      mockDbClient.from.mockReturnThis();
      mockDbClient.where.mockResolvedValueOnce([mockContact]);

      const result = await updateContact(mockContext);

      expect(mockContext.req.valid).toHaveBeenCalledWith('json');
      expect(mockContext.req.param).toHaveBeenCalledWith('id');
      expect(mockContext.json).toHaveBeenCalledWith({ contact: mockContact });
    });

    it('should return 404 if contact not found', async () => {
      const mockBody = {
        status: 'RESOLVED',
      };
      const mockContext = createMockContext(mockBody, { id: '999' });

      // Mock the first query to check if contact exists
      mockDbClient.select.mockReturnThis();
      mockDbClient.from.mockReturnThis();
      mockDbClient.where.mockResolvedValueOnce([]);

      const result = await updateContact(mockContext);

      expect(mockContext.json).toHaveBeenCalledWith(
        { error: 'お問い合わせが見つかりません' },
        404
      );
    });

    it('should handle errors', async () => {
      const mockBody = {
        status: 'RESOLVED',
      };
      const mockContext = createMockContext(mockBody, { id: '1' });

      // Mock the first query to throw an error
      mockDbClient.select.mockReturnThis();
      mockDbClient.from.mockReturnThis();
      mockDbClient.where.mockRejectedValueOnce(new Error('Database error'));

      const result = await updateContact(mockContext);

      expect(mockContext.json).toHaveBeenCalledWith(
        { error: 'Database error' },
        500
      );
    });
  });

  describe('deleteContact', () => {
    it('should delete a contact and return success message', async () => {
      const mockContext = createMockContext({}, { id: '1' });

      // Mock the first query to check if contact exists
      mockDbClient.select.mockReturnThis();
      mockDbClient.from.mockReturnThis();
      mockDbClient.where.mockResolvedValueOnce([mockContact]);

      const result = await deleteContact(mockContext);

      expect(mockContext.req.param).toHaveBeenCalledWith('id');
      expect(mockContext.json).toHaveBeenCalledWith({ success: true }, 200);
    });

    it('should return 404 if contact not found', async () => {
      const mockContext = createMockContext({}, { id: '999' });

      // Mock the first query to check if contact exists
      mockDbClient.select.mockReturnThis();
      mockDbClient.from.mockReturnThis();
      mockDbClient.where.mockResolvedValueOnce([]);

      const result = await deleteContact(mockContext);

      expect(mockContext.json).toHaveBeenCalledWith(
        { error: 'お問い合わせが見つかりません' },
        404
      );
    });

    it('should handle errors', async () => {
      const mockContext = createMockContext({}, { id: '1' });

      // Mock the first query to throw an error
      mockDbClient.select.mockReturnThis();
      mockDbClient.from.mockReturnThis();
      mockDbClient.where.mockRejectedValueOnce(new Error('Database error'));

      const result = await deleteContact(mockContext);

      expect(mockContext.json).toHaveBeenCalledWith(
        { error: 'Database error' },
        500
      );
    });
  });
});
