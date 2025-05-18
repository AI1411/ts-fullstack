import {
  type CreateTaskInput,
  type Task,
  createTask,
  deleteTask,
  getTaskById,
  getTasks,
  updateTask,
} from '@/features/admin/tasks/controllers';
import { taskRepository } from '@/features/admin/tasks/repositories';
import { beforeEach, describe, expect, it, vi } from 'vitest';

// Define a type for mocked responses
type MockResponse<T> = {
  json: () => Promise<T>;
  ok: boolean;
  text?: () => Promise<string>;
};

// Mock the repository
vi.mock('@/features/admin/tasks/repositories', () => ({
  taskRepository: {
    getTasks: vi.fn(),
    createTask: vi.fn(),
    getTaskById: vi.fn(),
    updateTask: vi.fn(),
    deleteTask: vi.fn(),
  },
}));

describe('Task Controllers', () => {
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
        created_at: '2023-01-01T00:00:00Z',
      },
    ];

    it('should return tasks when the API call is successful', async () => {
      // Mock successful response
      vi.mocked(taskRepository.getTasks).mockResolvedValue({
        json: () => Promise.resolve({ tasks: mockTasks }),
        ok: true,
      } as MockResponse<{ tasks: Task[] }>);

      const result = await getTasks();

      expect(taskRepository.getTasks).toHaveBeenCalled();
      expect(result).toEqual(mockTasks);
    });

    it('should throw an error when the API call fails', async () => {
      // Mock failed response
      vi.mocked(taskRepository.getTasks).mockRejectedValue(
        new Error('API error')
      );

      await expect(getTasks()).rejects.toThrow('API error');
      expect(taskRepository.getTasks).toHaveBeenCalled();
    });
  });

  describe('createTask', () => {
    const taskData: CreateTaskInput = {
      title: 'Test Task',
      description: 'Test Description',
      status: 'PENDING',
      user_id: 1,
      team_id: 1,
      due_date: '2023-12-31',
    };
    const mockTask: Task = {
      id: 1,
      title: 'Test Task',
      description: 'Test Description',
      status: 'PENDING',
      user_id: 1,
      team_id: 1,
      due_date: '2023-12-31',
      created_at: '2023-01-01T00:00:00Z',
    };

    it('should create a task when the API call is successful', async () => {
      // Mock successful response
      vi.mocked(taskRepository.createTask).mockResolvedValue({
        json: () => Promise.resolve({ task: mockTask }),
        ok: true,
      } as MockResponse<{ task: Task }>);

      const result = await createTask(taskData);

      expect(taskRepository.createTask).toHaveBeenCalledWith(taskData);
      expect(result).toEqual(mockTask);
    });

    it('should throw an error when the API call fails', async () => {
      // Mock failed response
      vi.mocked(taskRepository.createTask).mockResolvedValue({
        ok: false,
        text: () => Promise.resolve('Invalid task data'),
      } as MockResponse<never>);

      await expect(createTask(taskData)).rejects.toThrow('Invalid task data');
      expect(taskRepository.createTask).toHaveBeenCalledWith(taskData);
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
      created_at: '2023-01-01T00:00:00Z',
    };

    it('should return a task when the API call is successful', async () => {
      // Mock successful response
      vi.mocked(taskRepository.getTaskById).mockResolvedValue({
        json: () => Promise.resolve({ task: mockTask }),
        ok: true,
      } as MockResponse<{ task: Task }>);

      const result = await getTaskById(taskId);

      expect(taskRepository.getTaskById).toHaveBeenCalledWith(taskId);
      expect(result).toEqual(mockTask);
    });

    it('should throw an error when the API call fails', async () => {
      // Mock failed response
      vi.mocked(taskRepository.getTaskById).mockResolvedValue({
        ok: false,
      } as MockResponse<never>);

      await expect(getTaskById(taskId)).rejects.toThrow('Task not found');
      expect(taskRepository.getTaskById).toHaveBeenCalledWith(taskId);
    });
  });

  describe('updateTask', () => {
    const taskId = 1;
    const taskData: Partial<CreateTaskInput> = {
      title: 'Updated Task',
      status: 'IN_PROGRESS',
    };
    const mockTask: Task = {
      id: 1,
      title: 'Updated Task',
      description: 'Test Description',
      status: 'IN_PROGRESS',
      user_id: 1,
      team_id: 1,
      due_date: '2023-12-31',
      created_at: '2023-01-01T00:00:00Z',
    };

    it('should update a task when the API call is successful', async () => {
      // Mock successful response
      vi.mocked(taskRepository.updateTask).mockResolvedValue({
        json: () => Promise.resolve({ task: mockTask }),
        ok: true,
      } as MockResponse<{ task: Task }>);

      const result = await updateTask(taskId, taskData);

      expect(taskRepository.updateTask).toHaveBeenCalledWith(taskId, taskData);
      expect(result).toEqual(mockTask);
    });

    it('should throw an error when the API call fails', async () => {
      // Mock failed response
      vi.mocked(taskRepository.updateTask).mockResolvedValue({
        ok: false,
        text: () => Promise.resolve('Task not found'),
      } as MockResponse<never>);

      await expect(updateTask(taskId, taskData)).rejects.toThrow(
        'Task not found'
      );
      expect(taskRepository.updateTask).toHaveBeenCalledWith(taskId, taskData);
    });
  });

  describe('deleteTask', () => {
    const taskId = 1;

    it('should delete a task when the API call is successful', async () => {
      // Mock successful response
      vi.mocked(taskRepository.deleteTask).mockResolvedValue({
        ok: true,
      } as MockResponse<never>);

      await deleteTask(taskId);

      expect(taskRepository.deleteTask).toHaveBeenCalledWith(taskId);
    });

    it('should throw an error when the API call fails', async () => {
      // Mock failed response
      vi.mocked(taskRepository.deleteTask).mockResolvedValue({
        ok: false,
        text: () => Promise.resolve('Task not found'),
      } as MockResponse<never>);

      await expect(deleteTask(taskId)).rejects.toThrow('Task not found');
      expect(taskRepository.deleteTask).toHaveBeenCalledWith(taskId);
    });
  });
});
