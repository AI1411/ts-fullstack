import { describe, it, expect, vi, beforeEach } from 'vitest';
import { createTodo, getTodos, getTodoById, updateTodo, deleteTodo } from '../../../features/todos/controllers';
import { todosTable } from '../../../db/schema';
import * as dbModule from '../../../common/utils/db';

// Mock todo data
const mockTodo = {
  id: 1,
  title: 'Test Todo',
  description: 'Test Description',
  user_id: 1,
  status: 'PENDING',
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
  returning: vi.fn().mockResolvedValue([mockTodo])
};

describe('Todo Controllers', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(dbModule.getDB).mockReturnValue(mockDbClient);
  });
  describe('createTodo', () => {
    it('should create a new todo and return it', async () => {
      const mockBody = {
        title: 'Test Todo',
        description: 'Test Description',
        user_id: 1
      };
      const mockContext = createMockContext(mockBody);

      const result = await createTodo(mockContext);

      expect(mockContext.req.valid).toHaveBeenCalledWith('json');
      expect(mockContext.json).toHaveBeenCalledWith({ todo: mockTodo }, 201);
    });

    it('should handle errors', async () => {
      const mockBody = {
        title: 'Test Todo',
        description: 'Test Description',
        user_id: 1
      };
      const mockContext = createMockContext(mockBody);

      // Override the mock to throw an error
      mockDbClient.returning.mockRejectedValueOnce(new Error('Database error'));

      const result = await createTodo(mockContext);

      expect(mockContext.json).toHaveBeenCalledWith({ error: 'Database error' }, 500);
    });
  });

  describe('getTodos', () => {
    it('should return all todos', async () => {
      const mockContext = createMockContext();
      mockDbClient.select.mockReturnThis();
      mockDbClient.from.mockReturnThis();
      mockDbClient.from.mockResolvedValueOnce([mockTodo]);

      const result = await getTodos(mockContext);

      expect(mockContext.json).toHaveBeenCalledWith({ todos: [mockTodo] }, 200);
    });

    it('should handle errors', async () => {
      const mockContext = createMockContext();
      mockDbClient.select.mockReturnThis();
      mockDbClient.from.mockRejectedValueOnce(new Error('Database error'));

      const result = await getTodos(mockContext);

      expect(mockContext.json).toHaveBeenCalledWith({ error: 'Database error' }, 500);
    });
  });

  describe('getTodoById', () => {
    it('should return a todo by id', async () => {
      const mockContext = createMockContext({}, { id: '1' });
      mockDbClient.select.mockReturnThis();
      mockDbClient.from.mockReturnThis();
      mockDbClient.where.mockReturnThis();
      mockDbClient.where.mockResolvedValueOnce([mockTodo]);

      const result = await getTodoById(mockContext);

      expect(mockContext.req.param).toHaveBeenCalledWith('id');
      expect(mockContext.json).toHaveBeenCalledWith({ todo: mockTodo }, 200);
    });

    it('should return 404 if todo not found', async () => {
      const mockContext = createMockContext({}, { id: '999' });
      mockDbClient.select.mockReturnThis();
      mockDbClient.from.mockReturnThis();
      mockDbClient.where.mockReturnThis();
      mockDbClient.where.mockResolvedValueOnce([]);

      const result = await getTodoById(mockContext);

      expect(mockContext.json).toHaveBeenCalledWith({ error: 'Todo not found' }, 404);
    });

    it('should handle errors', async () => {
      const mockContext = createMockContext({}, { id: '1' });
      mockDbClient.select.mockReturnThis();
      mockDbClient.from.mockReturnThis();
      mockDbClient.where.mockReturnThis();
      mockDbClient.where.mockRejectedValueOnce(new Error('Database error'));

      const result = await getTodoById(mockContext);

      expect(mockContext.json).toHaveBeenCalledWith({ error: 'Database error' }, 500);
    });
  });

  describe('updateTodo', () => {
    it('should update a todo and return it', async () => {
      const mockBody = {
        title: 'Updated Todo',
        description: 'Updated Description',
        user_id: 1,
        status: 'COMPLETED'
      };
      const mockContext = createMockContext(mockBody, { id: '1' });
      mockDbClient.update.mockReturnThis();
      mockDbClient.set.mockReturnThis();
      mockDbClient.where.mockReturnThis();
      mockDbClient.returning.mockResolvedValueOnce([mockTodo]);

      const result = await updateTodo(mockContext);

      expect(mockContext.req.valid).toHaveBeenCalledWith('json');
      expect(mockContext.req.param).toHaveBeenCalledWith('id');
      expect(mockContext.json).toHaveBeenCalledWith({ todo: mockTodo }, 200);
    });

    it('should return 404 if todo not found', async () => {
      const mockBody = {
        title: 'Updated Todo',
        description: 'Updated Description',
        user_id: 1,
        status: 'COMPLETED'
      };
      const mockContext = createMockContext(mockBody, { id: '999' });
      mockDbClient.update.mockReturnThis();
      mockDbClient.set.mockReturnThis();
      mockDbClient.where.mockReturnThis();
      mockDbClient.returning.mockResolvedValueOnce([]);

      const result = await updateTodo(mockContext);

      expect(mockContext.json).toHaveBeenCalledWith({ error: 'Todo not found' }, 404);
    });

    it('should handle errors', async () => {
      const mockBody = {
        title: 'Updated Todo',
        description: 'Updated Description',
        user_id: 1,
        status: 'COMPLETED'
      };
      const mockContext = createMockContext(mockBody, { id: '1' });
      mockDbClient.update.mockReturnThis();
      mockDbClient.set.mockReturnThis();
      mockDbClient.where.mockReturnThis();
      mockDbClient.returning.mockRejectedValueOnce(new Error('Database error'));

      const result = await updateTodo(mockContext);

      expect(mockContext.json).toHaveBeenCalledWith({ error: 'Database error' }, 500);
    });
  });

  describe('deleteTodo', () => {
    it('should delete a todo and return success message', async () => {
      const mockContext = createMockContext({}, { id: '1' });
      mockDbClient.delete.mockReturnThis();
      mockDbClient.where.mockReturnThis();
      mockDbClient.returning.mockResolvedValueOnce([mockTodo]);

      const result = await deleteTodo(mockContext);

      expect(mockContext.req.param).toHaveBeenCalledWith('id');
      expect(mockContext.json).toHaveBeenCalledWith({ message: 'Todo deleted successfully' }, 200);
    });

    it('should return 404 if todo not found', async () => {
      const mockContext = createMockContext({}, { id: '999' });
      mockDbClient.delete.mockReturnThis();
      mockDbClient.where.mockReturnThis();
      mockDbClient.returning.mockResolvedValueOnce([]);

      const result = await deleteTodo(mockContext);

      expect(mockContext.json).toHaveBeenCalledWith({ error: 'Todo not found' }, 404);
    });

    it('should handle errors', async () => {
      const mockContext = createMockContext({}, { id: '1' });
      mockDbClient.delete.mockReturnThis();
      mockDbClient.where.mockReturnThis();
      mockDbClient.returning.mockRejectedValueOnce(new Error('Database error'));

      const result = await deleteTodo(mockContext);

      expect(mockContext.json).toHaveBeenCalledWith({ error: 'Database error' }, 500);
    });
  });
});
