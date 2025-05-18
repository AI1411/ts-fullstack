import { beforeEach, describe, expect, it, vi } from 'vitest';
import * as dbModule from '../../../common/utils/db';
import { subTasksTable } from '../../../db/schema';
import {
  createSubTask,
  deleteSubTask,
  getSubTaskById,
  getSubTasks,
  getSubTasksByTaskId,
  updateSubTask,
} from '../../../features/sub-tasks/controllers';

// Mock sub-task data
const mockSubTask = {
  id: 1,
  task_id: 1,
  title: 'Test SubTask',
  description: 'Test Description',
  status: 'PENDING',
  due_date: null,
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
  returning: vi.fn().mockResolvedValue([mockSubTask]),
};

describe('SubTask Controllers', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(dbModule.getDB).mockReturnValue(mockDbClient);
  });

  describe('createSubTask', () => {
    it('should create a new sub-task and return it', async () => {
      const mockBody = {
        task_id: 1,
        title: 'Test SubTask',
        description: 'Test Description',
        status: 'PENDING',
        due_date: null,
      };
      const mockContext = createMockContext(mockBody);

      const result = await createSubTask(mockContext);

      expect(mockContext.req.valid).toHaveBeenCalledWith('json');
      expect(mockContext.json).toHaveBeenCalledWith({ subTask: mockSubTask });
    });

    it('should handle errors', async () => {
      const mockBody = {
        task_id: 1,
        title: 'Test SubTask',
        description: 'Test Description',
        status: 'PENDING',
        due_date: null,
      };
      const mockContext = createMockContext(mockBody);

      // Override the mock to throw an error
      mockDbClient.returning.mockRejectedValueOnce(new Error('Database error'));

      const result = await createSubTask(mockContext);

      expect(mockContext.json).toHaveBeenCalledWith(
        { error: 'Database error' },
        500
      );
    });
  });

  describe('getSubTasks', () => {
    it('should return all sub-tasks', async () => {
      const mockContext = createMockContext();
      mockDbClient.select.mockReturnThis();
      mockDbClient.from.mockReturnThis();
      mockDbClient.from.mockResolvedValueOnce([mockSubTask]);

      const result = await getSubTasks(mockContext);

      expect(mockContext.json).toHaveBeenCalledWith({
        subTasks: [mockSubTask],
      });
    });

    it('should handle errors', async () => {
      const mockContext = createMockContext();
      mockDbClient.select.mockReturnThis();
      mockDbClient.from.mockRejectedValueOnce(new Error('Database error'));

      const result = await getSubTasks(mockContext);

      expect(mockContext.json).toHaveBeenCalledWith(
        { error: 'Database error' },
        500
      );
    });
  });

  describe('getSubTasksByTaskId', () => {
    it('should return sub-tasks for a specific task', async () => {
      const mockParams = { taskId: '1' };
      const mockContext = createMockContext({}, mockParams);
      mockDbClient.select.mockReturnThis();
      mockDbClient.from.mockReturnThis();
      mockDbClient.where.mockResolvedValueOnce([mockSubTask]);

      const result = await getSubTasksByTaskId(mockContext);

      expect(mockContext.req.param).toHaveBeenCalledWith('taskId');
      expect(mockContext.json).toHaveBeenCalledWith({
        subTasks: [mockSubTask],
      });
    });

    it('should handle errors', async () => {
      const mockParams = { taskId: '1' };
      const mockContext = createMockContext({}, mockParams);
      mockDbClient.select.mockReturnThis();
      mockDbClient.from.mockReturnThis();
      mockDbClient.where.mockRejectedValueOnce(new Error('Database error'));

      const result = await getSubTasksByTaskId(mockContext);

      expect(mockContext.json).toHaveBeenCalledWith(
        { error: 'Database error' },
        500
      );
    });
  });

  describe('getSubTaskById', () => {
    it('should return a sub-task by id', async () => {
      const mockParams = { id: '1' };
      const mockContext = createMockContext({}, mockParams);
      mockDbClient.select.mockReturnThis();
      mockDbClient.from.mockReturnThis();
      mockDbClient.where.mockResolvedValueOnce([mockSubTask]);

      const result = await getSubTaskById(mockContext);

      expect(mockContext.req.param).toHaveBeenCalledWith('id');
      expect(mockContext.json).toHaveBeenCalledWith({ subTask: mockSubTask });
    });

    it('should return 404 if sub-task not found', async () => {
      const mockParams = { id: '999' };
      const mockContext = createMockContext({}, mockParams);
      mockDbClient.select.mockReturnThis();
      mockDbClient.from.mockReturnThis();
      mockDbClient.where.mockResolvedValueOnce([]);

      const result = await getSubTaskById(mockContext);

      expect(mockContext.json).toHaveBeenCalledWith(
        { error: 'SubTask not found' },
        404
      );
    });

    it('should handle errors', async () => {
      const mockParams = { id: '1' };
      const mockContext = createMockContext({}, mockParams);
      mockDbClient.select.mockReturnThis();
      mockDbClient.from.mockReturnThis();
      mockDbClient.where.mockRejectedValueOnce(new Error('Database error'));

      const result = await getSubTaskById(mockContext);

      expect(mockContext.json).toHaveBeenCalledWith(
        { error: 'Database error' },
        500
      );
    });
  });

  describe('updateSubTask', () => {
    it('should update a sub-task and return it', async () => {
      const mockParams = { id: '1' };
      const mockBody = {
        task_id: 1,
        title: 'Updated SubTask',
        description: 'Updated Description',
        status: 'IN_PROGRESS',
        due_date: null,
      };
      const mockContext = createMockContext(mockBody, mockParams);

      const result = await updateSubTask(mockContext);

      expect(mockContext.req.param).toHaveBeenCalledWith('id');
      expect(mockContext.req.valid).toHaveBeenCalledWith('json');
      expect(mockContext.json).toHaveBeenCalledWith({ subTask: mockSubTask });
    });

    it('should return 404 if sub-task not found', async () => {
      const mockParams = { id: '999' };
      const mockBody = {
        task_id: 1,
        title: 'Updated SubTask',
        description: 'Updated Description',
        status: 'IN_PROGRESS',
        due_date: null,
      };
      const mockContext = createMockContext(mockBody, mockParams);
      mockDbClient.returning.mockResolvedValueOnce([]);

      const result = await updateSubTask(mockContext);

      expect(mockContext.json).toHaveBeenCalledWith(
        { error: 'SubTask not found' },
        404
      );
    });

    it('should handle errors', async () => {
      const mockParams = { id: '1' };
      const mockBody = {
        task_id: 1,
        title: 'Updated SubTask',
        description: 'Updated Description',
        status: 'IN_PROGRESS',
        due_date: null,
      };
      const mockContext = createMockContext(mockBody, mockParams);
      mockDbClient.returning.mockRejectedValueOnce(new Error('Database error'));

      const result = await updateSubTask(mockContext);

      expect(mockContext.json).toHaveBeenCalledWith(
        { error: 'Database error' },
        500
      );
    });
  });

  describe('deleteSubTask', () => {
    it('should delete a sub-task and return success message', async () => {
      const mockParams = { id: '1' };
      const mockContext = createMockContext({}, mockParams);

      const result = await deleteSubTask(mockContext);

      expect(mockContext.req.param).toHaveBeenCalledWith('id');
      expect(mockContext.json).toHaveBeenCalledWith({
        message: 'SubTask deleted successfully',
      });
    });

    it('should return 404 if sub-task not found', async () => {
      const mockParams = { id: '999' };
      const mockContext = createMockContext({}, mockParams);
      mockDbClient.returning.mockResolvedValueOnce([]);

      const result = await deleteSubTask(mockContext);

      expect(mockContext.json).toHaveBeenCalledWith(
        { error: 'SubTask not found' },
        404
      );
    });

    it('should handle errors', async () => {
      const mockParams = { id: '1' };
      const mockContext = createMockContext({}, mockParams);
      mockDbClient.returning.mockRejectedValueOnce(new Error('Database error'));

      const result = await deleteSubTask(mockContext);

      expect(mockContext.json).toHaveBeenCalledWith(
        { error: 'Database error' },
        500
      );
    });
  });
});
