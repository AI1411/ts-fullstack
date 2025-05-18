import { beforeEach, describe, expect, it, vi } from 'vitest';
import * as dbModule from '../../../common/utils/db';
import { todosTable } from '../../../db/schema';
import { createTodo, updateTodo } from '../../../features/todos/controllers';

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
  returning: vi.fn().mockResolvedValue([]),
};

describe('Todo Validation', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(dbModule.getDB).mockReturnValue(mockDbClient);
  });

  describe('createTodo validation', () => {
    it('should handle empty title', async () => {
      const mockBody = {
        title: '',
        description: 'Test Description',
        user_id: 1,
      };
      const mockContext = createMockContext(mockBody);

      // Make the DB return an empty array to simulate a validation error
      mockDbClient.returning.mockRejectedValueOnce(
        new Error('Title cannot be empty')
      );

      const result = await createTodo(mockContext);

      expect(mockContext.json).toHaveBeenCalledWith(
        { error: 'Title cannot be empty' },
        500
      );
    });

    it('should handle missing user_id', async () => {
      const mockBody = {
        title: 'Test Todo',
        description: 'Test Description',
        // user_id is missing
      };
      const mockContext = createMockContext(mockBody);

      // Make the DB return an empty array to simulate a validation error
      mockDbClient.returning.mockRejectedValueOnce(
        new Error('User ID is required')
      );

      const result = await createTodo(mockContext);

      expect(mockContext.json).toHaveBeenCalledWith(
        { error: 'User ID is required' },
        500
      );
    });

    it('should handle very long title', async () => {
      const longTitle = 'a'.repeat(256); // Assuming max length is 255
      const mockBody = {
        title: longTitle,
        description: 'Test Description',
        user_id: 1,
      };
      const mockContext = createMockContext(mockBody);

      // Make the DB return an empty array to simulate a validation error
      mockDbClient.returning.mockRejectedValueOnce(
        new Error('Title is too long')
      );

      const result = await createTodo(mockContext);

      expect(mockContext.json).toHaveBeenCalledWith(
        { error: 'Title is too long' },
        500
      );
    });
  });

  describe('updateTodo validation', () => {
    it('should handle invalid status value', async () => {
      const mockBody = {
        title: 'Updated Todo',
        description: 'Updated Description',
        user_id: 1,
        status: 'INVALID_STATUS', // Invalid status
      };
      const mockContext = createMockContext(mockBody, { id: '1' });

      // Make the DB return an empty array to simulate a validation error
      mockDbClient.returning.mockRejectedValueOnce(
        new Error('Invalid status value')
      );

      const result = await updateTodo(mockContext);

      expect(mockContext.json).toHaveBeenCalledWith(
        { error: 'Invalid status value' },
        500
      );
    });

    it('should handle non-numeric ID', async () => {
      const mockBody = {
        title: 'Updated Todo',
        description: 'Updated Description',
        user_id: 1,
        status: 'COMPLETED',
      };
      const mockContext = createMockContext(mockBody, { id: 'abc' }); // Non-numeric ID

      // Make the DB return an empty array to simulate a validation error
      mockDbClient.returning.mockRejectedValueOnce(
        new Error('Invalid ID format')
      );

      const result = await updateTodo(mockContext);

      expect(mockContext.json).toHaveBeenCalledWith(
        { error: 'Invalid ID format' },
        500
      );
    });
  });
});
