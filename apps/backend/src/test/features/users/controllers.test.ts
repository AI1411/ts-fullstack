import { beforeEach, describe, expect, it, vi } from 'vitest';
import * as dbModule from '../../../common/utils/db';
import { usersTable } from '../../../db/schema';
import {
  createUser,
  deleteUser,
  getUserById,
  getUsers,
  updateUser,
} from '../../../features/users/controllers';

// Mock user data
const mockUser = {
  id: 1,
  name: 'Test User',
  email: 'test@example.com',
  password: 'password123',
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
  returning: vi.fn().mockResolvedValue([mockUser]),
};

describe('User Controllers', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(dbModule.getDB).mockReturnValue(mockDbClient);
  });

  describe('createUser', () => {
    it('should create a new user and return it', async () => {
      const mockBody = {
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123',
      };
      const mockContext = createMockContext(mockBody);

      const result = await createUser(mockContext);

      expect(mockContext.req.valid).toHaveBeenCalledWith('json');
      expect(mockContext.json).toHaveBeenCalledWith({ user: mockUser });
    });

    it('should handle errors', async () => {
      const mockBody = {
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123',
      };
      const mockContext = createMockContext(mockBody);

      // Override the mock to throw an error
      mockDbClient.returning.mockRejectedValueOnce(new Error('Database error'));

      const result = await createUser(mockContext);

      expect(mockContext.json).toHaveBeenCalledWith(
        { error: 'Database error' },
        500
      );
    });
  });

  describe('getUsers', () => {
    it('should return all users', async () => {
      const mockContext = createMockContext();
      mockDbClient.select.mockReturnThis();
      mockDbClient.from.mockReturnThis();
      mockDbClient.from.mockResolvedValueOnce([mockUser]);

      const result = await getUsers(mockContext);

      expect(mockContext.json).toHaveBeenCalledWith({ users: [mockUser] });
    });

    it('should handle errors', async () => {
      const mockContext = createMockContext();
      mockDbClient.select.mockReturnThis();
      mockDbClient.from.mockRejectedValueOnce(new Error('Database error'));

      const result = await getUsers(mockContext);

      expect(mockContext.json).toHaveBeenCalledWith(
        { error: 'Database error' },
        500
      );
    });
  });

  describe('getUserById', () => {
    it('should return a user by id', async () => {
      const mockContext = createMockContext({}, { id: '1' });
      mockDbClient.select.mockReturnThis();
      mockDbClient.from.mockReturnThis();
      mockDbClient.where.mockReturnThis();
      mockDbClient.where.mockResolvedValueOnce([mockUser]);

      const result = await getUserById(mockContext);

      expect(mockContext.req.param).toHaveBeenCalledWith('id');
      expect(mockContext.json).toHaveBeenCalledWith({ user: mockUser });
    });

    it('should return 404 if user not found', async () => {
      const mockContext = createMockContext({}, { id: '999' });
      mockDbClient.select.mockReturnThis();
      mockDbClient.from.mockReturnThis();
      mockDbClient.where.mockReturnThis();
      mockDbClient.where.mockResolvedValueOnce([]);

      const result = await getUserById(mockContext);

      expect(mockContext.json).toHaveBeenCalledWith(
        { error: 'User not found' },
        404
      );
    });

    it('should handle errors', async () => {
      const mockContext = createMockContext({}, { id: '1' });
      mockDbClient.select.mockReturnThis();
      mockDbClient.from.mockReturnThis();
      mockDbClient.where.mockReturnThis();
      mockDbClient.where.mockRejectedValueOnce(new Error('Database error'));

      const result = await getUserById(mockContext);

      expect(mockContext.json).toHaveBeenCalledWith(
        { error: 'Database error' },
        500
      );
    });
  });

  describe('updateUser', () => {
    it('should update a user and return it', async () => {
      const mockBody = {
        name: 'Updated User',
        email: 'updated@example.com',
        password: 'newpassword123',
      };
      const mockContext = createMockContext(mockBody, { id: '1' });
      mockDbClient.update.mockReturnThis();
      mockDbClient.set.mockReturnThis();
      mockDbClient.where.mockReturnThis();
      mockDbClient.returning.mockResolvedValueOnce([mockUser]);

      const result = await updateUser(mockContext);

      expect(mockContext.req.valid).toHaveBeenCalledWith('json');
      expect(mockContext.req.param).toHaveBeenCalledWith('id');
      expect(mockContext.json).toHaveBeenCalledWith({ user: mockUser });
    });

    it('should return 404 if user not found', async () => {
      const mockBody = {
        name: 'Updated User',
        email: 'updated@example.com',
        password: 'newpassword123',
      };
      const mockContext = createMockContext(mockBody, { id: '999' });
      mockDbClient.update.mockReturnThis();
      mockDbClient.set.mockReturnThis();
      mockDbClient.where.mockReturnThis();
      mockDbClient.returning.mockResolvedValueOnce([]);

      const result = await updateUser(mockContext);

      expect(mockContext.json).toHaveBeenCalledWith(
        { error: 'User not found' },
        404
      );
    });

    it('should handle errors', async () => {
      const mockBody = {
        name: 'Updated User',
        email: 'updated@example.com',
        password: 'newpassword123',
      };
      const mockContext = createMockContext(mockBody, { id: '1' });
      mockDbClient.update.mockReturnThis();
      mockDbClient.set.mockReturnThis();
      mockDbClient.where.mockReturnThis();
      mockDbClient.returning.mockRejectedValueOnce(new Error('Database error'));

      const result = await updateUser(mockContext);

      expect(mockContext.json).toHaveBeenCalledWith(
        { error: 'Database error' },
        500
      );
    });
  });

  describe('deleteUser', () => {
    it('should delete a user and return success message', async () => {
      const mockContext = createMockContext({}, { id: '1' });
      mockDbClient.delete.mockReturnThis();
      mockDbClient.where.mockReturnThis();
      mockDbClient.returning.mockResolvedValueOnce([mockUser]);

      const result = await deleteUser(mockContext);

      expect(mockContext.req.param).toHaveBeenCalledWith('id');
      expect(mockContext.json).toHaveBeenCalledWith({
        message: 'User deleted successfully',
      });
    });

    it('should return 404 if user not found', async () => {
      const mockContext = createMockContext({}, { id: '999' });
      mockDbClient.delete.mockReturnThis();
      mockDbClient.where.mockReturnThis();
      mockDbClient.returning.mockResolvedValueOnce([]);

      const result = await deleteUser(mockContext);

      expect(mockContext.json).toHaveBeenCalledWith(
        { error: 'User not found' },
        404
      );
    });

    it('should handle errors', async () => {
      const mockContext = createMockContext({}, { id: '1' });
      mockDbClient.delete.mockReturnThis();
      mockDbClient.where.mockReturnThis();
      mockDbClient.returning.mockRejectedValueOnce(new Error('Database error'));

      const result = await deleteUser(mockContext);

      expect(mockContext.json).toHaveBeenCalledWith(
        { error: 'Database error' },
        500
      );
    });
  });
});
