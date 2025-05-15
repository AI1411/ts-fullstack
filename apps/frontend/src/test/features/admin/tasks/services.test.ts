import { describe, it, expect, vi, beforeEach } from 'vitest';
import { taskService } from '@/features/admin/tasks/services';
import * as controllers from '@/features/admin/tasks/controllers';
import { Task, CreateTaskInput } from '@/features/admin/tasks/controllers';

// Mock the controllers
vi.mock('@/features/admin/tasks/controllers', () => ({
  getTasks: vi.fn(),
  createTask: vi.fn(),
  getTaskById: vi.fn(),
  updateTask: vi.fn(),
  deleteTask: vi.fn(),
  // Re-export types
  Task: {},
  CreateTaskInput: {}
}));

describe('Task Service', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('getTasks', () => {
    const mockTasks: Task[] = [
      {
        id: 1,
        title: 'Test Task',
        description: 'Test Description',
        status: 'PENDING',
        user_id: 1,
        team_id: 1,
        due_date: '2023-12-31',
        created_at: '2023-01-01T00:00:00Z'
      }
    ];

    it('should call the controller method and return tasks', async () => {
      // Mock successful response
      vi.mocked(controllers.getTasks).mockResolvedValue(mockTasks);

      const result = await taskService.getTasks();
      
      expect(controllers.getTasks).toHaveBeenCalled();
      expect(result).toEqual(mockTasks);
    });
  });

  describe('createTask', () => {
    const taskData: CreateTaskInput = {
      title: 'Test Task',
      description: 'Test Description',
      status: 'PENDING',
      user_id: 1,
      team_id: 1,
      due_date: '2023-12-31'
    };
    const mockTask: Task = {
      id: 1,
      title: 'Test Task',
      description: 'Test Description',
      status: 'PENDING',
      user_id: 1,
      team_id: 1,
      due_date: '2023-12-31',
      created_at: '2023-01-01T00:00:00Z'
    };

    it('should call the controller method with the correct arguments', async () => {
      // Mock successful response
      vi.mocked(controllers.createTask).mockResolvedValue(mockTask);

      const result = await taskService.createTask(taskData);
      
      expect(controllers.createTask).toHaveBeenCalledWith(taskData);
      expect(result).toEqual(mockTask);
    });
  });

  describe('getTaskById', () => {
    const taskId = 1;
    const mockTask: Task = {
      id: 1,
      title: 'Test Task',
      description: 'Test Description',
      status: 'PENDING',
      user_id: 1,
      team_id: 1,
      due_date: '2023-12-31',
      created_at: '2023-01-01T00:00:00Z'
    };

    it('should call the controller method with the correct arguments', async () => {
      // Mock successful response
      vi.mocked(controllers.getTaskById).mockResolvedValue(mockTask);

      const result = await taskService.getTaskById(taskId);
      
      expect(controllers.getTaskById).toHaveBeenCalledWith(taskId);
      expect(result).toEqual(mockTask);
    });
  });

  describe('updateTask', () => {
    const taskId = 1;
    const taskData: Partial<CreateTaskInput> = {
      title: 'Updated Task',
      status: 'IN_PROGRESS'
    };
    const mockTask: Task = {
      id: 1,
      title: 'Updated Task',
      description: 'Test Description',
      status: 'IN_PROGRESS',
      user_id: 1,
      team_id: 1,
      due_date: '2023-12-31',
      created_at: '2023-01-01T00:00:00Z'
    };

    it('should call the controller method with the correct arguments', async () => {
      // Mock successful response
      vi.mocked(controllers.updateTask).mockResolvedValue(mockTask);

      const result = await taskService.updateTask(taskId, taskData);
      
      expect(controllers.updateTask).toHaveBeenCalledWith(taskId, taskData);
      expect(result).toEqual(mockTask);
    });
  });

  describe('deleteTask', () => {
    const taskId = 1;

    it('should call the controller method with the correct arguments', async () => {
      // Mock successful response
      vi.mocked(controllers.deleteTask).mockResolvedValue(undefined);

      await taskService.deleteTask(taskId);
      
      expect(controllers.deleteTask).toHaveBeenCalledWith(taskId);
    });
  });

  describe('getCompletedTasks', () => {
    const mockTasks: Task[] = [
      {
        id: 1,
        title: 'Completed Task',
        description: 'Test Description',
        status: 'COMPLETED',
        user_id: 1,
        team_id: 1,
        due_date: '2023-12-31',
        created_at: '2023-01-01T00:00:00Z'
      },
      {
        id: 2,
        title: 'Pending Task',
        description: 'Test Description',
        status: 'PENDING',
        user_id: 1,
        team_id: 1,
        due_date: '2023-12-31',
        created_at: '2023-01-01T00:00:00Z'
      }
    ];

    it('should filter completed tasks', async () => {
      // Mock successful response
      vi.mocked(controllers.getTasks).mockResolvedValue(mockTasks);

      const result = await taskService.getCompletedTasks();
      
      expect(controllers.getTasks).toHaveBeenCalled();
      expect(result).toHaveLength(1);
      expect(result[0].status).toBe('COMPLETED');
    });
  });

  describe('getPendingTasks', () => {
    const mockTasks: Task[] = [
      {
        id: 1,
        title: 'Completed Task',
        description: 'Test Description',
        status: 'COMPLETED',
        user_id: 1,
        team_id: 1,
        due_date: '2023-12-31',
        created_at: '2023-01-01T00:00:00Z'
      },
      {
        id: 2,
        title: 'Pending Task',
        description: 'Test Description',
        status: 'PENDING',
        user_id: 1,
        team_id: 1,
        due_date: '2023-12-31',
        created_at: '2023-01-01T00:00:00Z'
      }
    ];

    it('should filter pending tasks', async () => {
      // Mock successful response
      vi.mocked(controllers.getTasks).mockResolvedValue(mockTasks);

      const result = await taskService.getPendingTasks();
      
      expect(controllers.getTasks).toHaveBeenCalled();
      expect(result).toHaveLength(1);
      expect(result[0].status).toBe('PENDING');
    });
  });

  describe('getInProgressTasks', () => {
    const mockTasks: Task[] = [
      {
        id: 1,
        title: 'In Progress Task',
        description: 'Test Description',
        status: 'IN_PROGRESS',
        user_id: 1,
        team_id: 1,
        due_date: '2023-12-31',
        created_at: '2023-01-01T00:00:00Z'
      },
      {
        id: 2,
        title: 'Pending Task',
        description: 'Test Description',
        status: 'PENDING',
        user_id: 1,
        team_id: 1,
        due_date: '2023-12-31',
        created_at: '2023-01-01T00:00:00Z'
      }
    ];

    it('should filter in-progress tasks', async () => {
      // Mock successful response
      vi.mocked(controllers.getTasks).mockResolvedValue(mockTasks);

      const result = await taskService.getInProgressTasks();
      
      expect(controllers.getTasks).toHaveBeenCalled();
      expect(result).toHaveLength(1);
      expect(result[0].status).toBe('IN_PROGRESS');
    });
  });
});