import { describe, it, expect, vi, beforeEach } from 'vitest';
import { createTask, getTasks, getTaskById, getTasksByUserId, getTasksByTeamId, updateTask, deleteTask } from '../../../features/tasks/controllers';
import { tasksTable } from '../../../db/schema';
import * as dbModule from '../../../common/utils/db';

// Mock task data
const mockTask = {
  id: 1,
  user_id: 1,
  team_id: 1,
  title: 'Test Task',
  description: 'Test Description',
  status: 'PENDING',
  due_date: new Date('2023-12-31'),
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
  returning: vi.fn().mockResolvedValue([mockTask])
};

describe('Task Controllers', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(dbModule.getDB).mockReturnValue(mockDbClient);
  });

  describe('createTask', () => {
    it('should create a new task and return it', async () => {
      const mockBody = {
        user_id: 1,
        team_id: 1,
        title: 'Test Task',
        description: 'Test Description',
        status: 'PENDING',
        due_date: '2023-12-31'
      };
      const mockContext = createMockContext(mockBody);

      const result = await createTask(mockContext);

      expect(mockContext.req.valid).toHaveBeenCalledWith('json');
      expect(mockContext.json).toHaveBeenCalledWith({ task: mockTask });
    });

    it('should handle errors', async () => {
      const mockBody = {
        user_id: 1,
        team_id: 1,
        title: 'Test Task',
        description: 'Test Description',
        status: 'PENDING',
        due_date: '2023-12-31'
      };
      const mockContext = createMockContext(mockBody);

      // Override the mock to throw an error
      mockDbClient.returning.mockRejectedValueOnce(new Error('Database error'));

      const result = await createTask(mockContext);

      expect(mockContext.json).toHaveBeenCalledWith({ error: 'Database error' }, 500);
    });
  });

  describe('getTasks', () => {
    it('should return all tasks', async () => {
      const mockContext = createMockContext();
      mockDbClient.select.mockReturnThis();
      mockDbClient.from.mockReturnThis();
      mockDbClient.from.mockResolvedValueOnce([mockTask]);

      const result = await getTasks(mockContext);

      expect(mockContext.json).toHaveBeenCalledWith({ tasks: [mockTask] });
    });

    it('should handle errors', async () => {
      const mockContext = createMockContext();
      mockDbClient.select.mockReturnThis();
      mockDbClient.from.mockRejectedValueOnce(new Error('Database error'));

      const result = await getTasks(mockContext);

      expect(mockContext.json).toHaveBeenCalledWith({ error: 'Database error' }, 500);
    });
  });

  describe('getTasksByUserId', () => {
    it('should return tasks for a specific user', async () => {
      const mockContext = createMockContext({}, { userId: '1' });
      mockDbClient.select.mockReturnThis();
      mockDbClient.from.mockReturnThis();
      mockDbClient.where.mockReturnThis();
      mockDbClient.where.mockResolvedValueOnce([mockTask]);

      const result = await getTasksByUserId(mockContext);

      expect(mockContext.req.param).toHaveBeenCalledWith('userId');
      expect(mockContext.json).toHaveBeenCalledWith({ tasks: [mockTask] });
    });

    it('should handle errors', async () => {
      const mockContext = createMockContext({}, { userId: '1' });
      mockDbClient.select.mockReturnThis();
      mockDbClient.from.mockReturnThis();
      mockDbClient.where.mockReturnThis();
      mockDbClient.where.mockRejectedValueOnce(new Error('Database error'));

      const result = await getTasksByUserId(mockContext);

      expect(mockContext.json).toHaveBeenCalledWith({ error: 'Database error' }, 500);
    });
  });

  describe('getTasksByTeamId', () => {
    it('should return tasks for a specific team', async () => {
      const mockContext = createMockContext({}, { teamId: '1' });
      mockDbClient.select.mockReturnThis();
      mockDbClient.from.mockReturnThis();
      mockDbClient.where.mockReturnThis();
      mockDbClient.where.mockResolvedValueOnce([mockTask]);

      const result = await getTasksByTeamId(mockContext);

      expect(mockContext.req.param).toHaveBeenCalledWith('teamId');
      expect(mockContext.json).toHaveBeenCalledWith({ tasks: [mockTask] });
    });

    it('should handle errors', async () => {
      const mockContext = createMockContext({}, { teamId: '1' });
      mockDbClient.select.mockReturnThis();
      mockDbClient.from.mockReturnThis();
      mockDbClient.where.mockReturnThis();
      mockDbClient.where.mockRejectedValueOnce(new Error('Database error'));

      const result = await getTasksByTeamId(mockContext);

      expect(mockContext.json).toHaveBeenCalledWith({ error: 'Database error' }, 500);
    });
  });

  describe('getTaskById', () => {
    it('should return a task by id', async () => {
      const mockContext = createMockContext({}, { id: '1' });
      mockDbClient.select.mockReturnThis();
      mockDbClient.from.mockReturnThis();
      mockDbClient.where.mockReturnThis();
      mockDbClient.where.mockResolvedValueOnce([mockTask]);

      const result = await getTaskById(mockContext);

      expect(mockContext.req.param).toHaveBeenCalledWith('id');
      expect(mockContext.json).toHaveBeenCalledWith({ task: mockTask });
    });

    it('should return 404 if task not found', async () => {
      const mockContext = createMockContext({}, { id: '999' });
      mockDbClient.select.mockReturnThis();
      mockDbClient.from.mockReturnThis();
      mockDbClient.where.mockReturnThis();
      mockDbClient.where.mockResolvedValueOnce([]);

      const result = await getTaskById(mockContext);

      expect(mockContext.json).toHaveBeenCalledWith({ error: 'Task not found' }, 404);
    });

    it('should handle errors', async () => {
      const mockContext = createMockContext({}, { id: '1' });
      mockDbClient.select.mockReturnThis();
      mockDbClient.from.mockReturnThis();
      mockDbClient.where.mockReturnThis();
      mockDbClient.where.mockRejectedValueOnce(new Error('Database error'));

      const result = await getTaskById(mockContext);

      expect(mockContext.json).toHaveBeenCalledWith({ error: 'Database error' }, 500);
    });
  });

  describe('updateTask', () => {
    it('should update a task and return it', async () => {
      const mockBody = {
        user_id: 2,
        team_id: 2,
        title: 'Updated Task',
        description: 'Updated Description',
        status: 'IN_PROGRESS',
        due_date: '2024-01-31'
      };
      const mockContext = createMockContext(mockBody, { id: '1' });
      mockDbClient.update.mockReturnThis();
      mockDbClient.set.mockReturnThis();
      mockDbClient.where.mockReturnThis();
      mockDbClient.returning.mockResolvedValueOnce([{...mockTask, ...mockBody, due_date: new Date(mockBody.due_date)}]);

      const result = await updateTask(mockContext);

      expect(mockContext.req.valid).toHaveBeenCalledWith('json');
      expect(mockContext.req.param).toHaveBeenCalledWith('id');
      expect(mockContext.json).toHaveBeenCalledWith({ task: expect.objectContaining({...mockTask, ...mockBody, due_date: expect.any(Date)}) });
    });

    it('should return 404 if task not found', async () => {
      const mockBody = {
        title: 'Updated Task',
        status: 'IN_PROGRESS'
      };
      const mockContext = createMockContext(mockBody, { id: '999' });
      mockDbClient.update.mockReturnThis();
      mockDbClient.set.mockReturnThis();
      mockDbClient.where.mockReturnThis();
      mockDbClient.returning.mockResolvedValueOnce([]);

      const result = await updateTask(mockContext);

      expect(mockContext.json).toHaveBeenCalledWith({ error: 'Task not found' }, 404);
    });

    it('should handle errors', async () => {
      const mockBody = {
        title: 'Updated Task',
        status: 'IN_PROGRESS'
      };
      const mockContext = createMockContext(mockBody, { id: '1' });
      mockDbClient.update.mockReturnThis();
      mockDbClient.set.mockReturnThis();
      mockDbClient.where.mockReturnThis();
      mockDbClient.returning.mockRejectedValueOnce(new Error('Database error'));

      const result = await updateTask(mockContext);

      expect(mockContext.json).toHaveBeenCalledWith({ error: 'Database error' }, 500);
    });
  });

  describe('deleteTask', () => {
    it('should delete a task and return success message', async () => {
      const mockContext = createMockContext({}, { id: '1' });
      mockDbClient.delete.mockReturnThis();
      mockDbClient.where.mockReturnThis();
      mockDbClient.returning.mockResolvedValueOnce([mockTask]);

      const result = await deleteTask(mockContext);

      expect(mockContext.req.param).toHaveBeenCalledWith('id');
      expect(mockContext.json).toHaveBeenCalledWith({ message: 'Task deleted successfully' });
    });

    it('should return 404 if task not found', async () => {
      const mockContext = createMockContext({}, { id: '999' });
      mockDbClient.delete.mockReturnThis();
      mockDbClient.where.mockReturnThis();
      mockDbClient.returning.mockResolvedValueOnce([]);

      const result = await deleteTask(mockContext);

      expect(mockContext.json).toHaveBeenCalledWith({ error: 'Task not found' }, 404);
    });

    it('should handle errors', async () => {
      const mockContext = createMockContext({}, { id: '1' });
      mockDbClient.delete.mockReturnThis();
      mockDbClient.where.mockReturnThis();
      mockDbClient.returning.mockRejectedValueOnce(new Error('Database error'));

      const result = await deleteTask(mockContext);

      expect(mockContext.json).toHaveBeenCalledWith({ error: 'Database error' }, 500);
    });
  });
});