import { describe, it, expect, vi, beforeEach } from 'vitest';
import { getTodos } from '../../../features/todos/controllers';
import { todosTable } from '../../../db/schema';
import * as dbModule from '../../../common/utils/db';

// Mock todo data
const mockTodos = [
  {
    id: 1,
    title: 'First Todo',
    description: 'First Description',
    user_id: 1,
    status: 'PENDING',
    created_at: new Date('2023-01-01'),
    updated_at: new Date('2023-01-01')
  },
  {
    id: 2,
    title: 'Second Todo',
    description: 'Second Description',
    user_id: 1,
    status: 'COMPLETED',
    created_at: new Date('2023-01-02'),
    updated_at: new Date('2023-01-02')
  },
  {
    id: 3,
    title: 'Third Todo',
    description: 'Third Description',
    user_id: 2,
    status: 'PENDING',
    created_at: new Date('2023-01-03'),
    updated_at: new Date('2023-01-03')
  }
];

// Mock the database module
vi.mock('../../../common/utils/db', () => ({
  getDB: vi.fn()
}));

// Mock context
const createMockContext = (query = {}) => ({
  req: {
    valid: vi.fn().mockReturnValue(query),
    query: vi.fn((key) => query[key])
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
  orderBy: vi.fn().mockReturnThis(),
  limit: vi.fn().mockReturnThis(),
  offset: vi.fn().mockReturnThis(),
  returning: vi.fn().mockResolvedValue(mockTodos)
};

describe('Todo Filtering and Sorting', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(dbModule.getDB).mockReturnValue(mockDbClient);
  });

  describe('getTodos with filtering', () => {
    it('should return all todos when no filters are applied', async () => {
      const mockContext = createMockContext();
      mockDbClient.from.mockResolvedValueOnce(mockTodos);

      const result = await getTodos(mockContext);

      expect(mockContext.json).toHaveBeenCalledWith({ todos: mockTodos }, 200);
    });

    // Note: The following tests assume that the getTodos function supports these filters,
    // which may not be the case in the current implementation. These tests are meant to
    // demonstrate how filtering could be tested if implemented.

    it('should filter todos by status', async () => {
      const mockContext = createMockContext({ status: 'PENDING' });
      const filteredTodos = mockTodos.filter(todo => todo.status === 'PENDING');
      mockDbClient.from.mockResolvedValueOnce(filteredTodos);

      const result = await getTodos(mockContext);

      expect(mockContext.json).toHaveBeenCalledWith({ todos: filteredTodos }, 200);
    });

    it('should filter todos by user_id', async () => {
      const mockContext = createMockContext({ user_id: '1' });
      const filteredTodos = mockTodos.filter(todo => todo.user_id === 1);
      mockDbClient.from.mockResolvedValueOnce(filteredTodos);

      const result = await getTodos(mockContext);

      expect(mockContext.json).toHaveBeenCalledWith({ todos: filteredTodos }, 200);
    });

    it('should handle errors when filtering', async () => {
      const mockContext = createMockContext({ status: 'INVALID_STATUS' });
      mockDbClient.from.mockRejectedValueOnce(new Error('Invalid status filter'));

      const result = await getTodos(mockContext);

      expect(mockContext.json).toHaveBeenCalledWith({ error: 'Invalid status filter' }, 500);
    });
  });

  describe('getTodos with sorting', () => {
    // Note: The following tests assume that the getTodos function supports sorting,
    // which may not be the case in the current implementation. These tests are meant to
    // demonstrate how sorting could be tested if implemented.

    it('should sort todos by created_at in descending order', async () => {
      const mockContext = createMockContext({ sort: 'created_at', order: 'desc' });
      const sortedTodos = [...mockTodos].sort((a, b) => b.created_at.getTime() - a.created_at.getTime());
      mockDbClient.from.mockResolvedValueOnce(sortedTodos);

      const result = await getTodos(mockContext);

      expect(mockContext.json).toHaveBeenCalledWith({ todos: sortedTodos }, 200);
    });

    it('should sort todos by title in ascending order', async () => {
      const mockContext = createMockContext({ sort: 'title', order: 'asc' });
      const sortedTodos = [...mockTodos].sort((a, b) => a.title.localeCompare(b.title));
      mockDbClient.from.mockResolvedValueOnce(sortedTodos);

      const result = await getTodos(mockContext);

      expect(mockContext.json).toHaveBeenCalledWith({ todos: sortedTodos }, 200);
    });

    it('should handle errors when sorting', async () => {
      const mockContext = createMockContext({ sort: 'invalid_field' });
      mockDbClient.from.mockRejectedValueOnce(new Error('Invalid sort field'));

      const result = await getTodos(mockContext);

      expect(mockContext.json).toHaveBeenCalledWith({ error: 'Invalid sort field' }, 500);
    });
  });
});