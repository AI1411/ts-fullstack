import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import {
  getSubTasks,
  getSubTasksByTaskId,
  createSubTask,
  getSubTaskById,
  updateSubTask,
  deleteSubTask,
  SubTask,
  CreateSubTaskInput
} from '@/features/admin/sub-tasks/controllers';
import { subTaskRepository } from '@/features/admin/sub-tasks/repositories';

// Mock the sub-task repository
vi.mock('@/features/admin/sub-tasks/repositories', () => ({
  subTaskRepository: {
    getSubTasks: vi.fn(),
    getSubTasksByTaskId: vi.fn(),
    createSubTask: vi.fn(),
    getSubTaskById: vi.fn(),
    updateSubTask: vi.fn(),
    deleteSubTask: vi.fn()
  }
}));

describe('Sub-Task Controllers', () => {
  // Spy on console.error to prevent actual console output during tests
  let consoleErrorSpy: vi.SpyInstance;

  beforeEach(() => {
    consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    vi.clearAllMocks();
    consoleErrorSpy.mockRestore();
  });

  describe('getSubTasks', () => {
    const mockSubTasks: SubTask[] = [
      {
        id: 1,
        task_id: 1,
        title: 'Test Sub-Task 1',
        description: 'Description 1',
        status: 'PENDING',
        due_date: '2023-01-01T00:00:00Z',
        created_at: '2023-01-01T00:00:00Z',
        updated_at: '2023-01-01T00:00:00Z'
      },
      {
        id: 2,
        task_id: 1,
        title: 'Test Sub-Task 2',
        description: null,
        status: 'IN_PROGRESS',
        due_date: null,
        created_at: '2023-01-02T00:00:00Z',
        updated_at: '2023-01-02T00:00:00Z'
      }
    ];

    it('should return sub-tasks when API call is successful', async () => {
      // Mock successful response
      vi.mocked(subTaskRepository.getSubTasks).mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({ subTasks: mockSubTasks }),
        text: () => Promise.resolve(JSON.stringify({ subTasks: mockSubTasks })),
        headers: new Headers({ 'content-type': 'application/json' })
      } as unknown as Response);

      const result = await getSubTasks();
      expect(result).toEqual(mockSubTasks);
      expect(subTaskRepository.getSubTasks).toHaveBeenCalled();
    });

    it('should throw an error when API call fails', async () => {
      // Mock failed response
      vi.mocked(subTaskRepository.getSubTasks).mockResolvedValue({
        ok: false,
        status: 500,
        statusText: 'Internal Server Error',
        json: () => Promise.resolve({}),
        text: () => Promise.resolve('Internal Server Error')
      } as unknown as Response);

      await expect(getSubTasks()).rejects.toThrow('Error fetching sub-tasks:');
      expect(subTaskRepository.getSubTasks).toHaveBeenCalled();
      expect(consoleErrorSpy).toHaveBeenCalled();
    });
  });

  describe('getSubTasksByTaskId', () => {
    const taskId = 1;
    const mockSubTasks: SubTask[] = [
      {
        id: 1,
        task_id: 1,
        title: 'Test Sub-Task 1',
        description: 'Description 1',
        status: 'PENDING',
        due_date: '2023-01-01T00:00:00Z',
        created_at: '2023-01-01T00:00:00Z',
        updated_at: '2023-01-01T00:00:00Z'
      },
      {
        id: 2,
        task_id: 1,
        title: 'Test Sub-Task 2',
        description: null,
        status: 'IN_PROGRESS',
        due_date: null,
        created_at: '2023-01-02T00:00:00Z',
        updated_at: '2023-01-02T00:00:00Z'
      }
    ];

    it('should return sub-tasks when API call is successful', async () => {
      // Mock successful response
      vi.mocked(subTaskRepository.getSubTasksByTaskId).mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({ subTasks: mockSubTasks }),
        text: () => Promise.resolve(JSON.stringify({ subTasks: mockSubTasks })),
        headers: new Headers({ 'content-type': 'application/json' })
      } as unknown as Response);

      const result = await getSubTasksByTaskId(taskId);
      expect(result).toEqual(mockSubTasks);
      expect(subTaskRepository.getSubTasksByTaskId).toHaveBeenCalledWith(taskId);
    });

    it('should throw an error when API call fails', async () => {
      // Mock failed response
      vi.mocked(subTaskRepository.getSubTasksByTaskId).mockResolvedValue({
        ok: false,
        status: 500,
        statusText: 'Internal Server Error',
        json: () => Promise.resolve({}),
        text: () => Promise.resolve('Internal Server Error')
      } as unknown as Response);

      await expect(getSubTasksByTaskId(taskId)).rejects.toThrow(`Error fetching sub-tasks for task ${taskId}:`);
      expect(subTaskRepository.getSubTasksByTaskId).toHaveBeenCalledWith(taskId);
      expect(consoleErrorSpy).toHaveBeenCalled();
    });
  });

  describe('createSubTask', () => {
    const subTaskData: CreateSubTaskInput = {
      task_id: 1,
      title: 'New Sub-Task',
      description: 'New Description',
      status: 'PENDING',
      due_date: '2023-01-01T00:00:00Z'
    };
    const mockSubTask: SubTask = {
      id: 3,
      task_id: 1,
      title: 'New Sub-Task',
      description: 'New Description',
      status: 'PENDING',
      due_date: '2023-01-01T00:00:00Z',
      created_at: '2023-01-03T00:00:00Z',
      updated_at: '2023-01-03T00:00:00Z'
    };

    it('should return a sub-task when API call is successful', async () => {
      // Mock successful response
      vi.mocked(subTaskRepository.createSubTask).mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({ subTask: mockSubTask })
      } as unknown as Response);

      const result = await createSubTask(subTaskData);
      expect(result).toEqual(mockSubTask);
      expect(subTaskRepository.createSubTask).toHaveBeenCalledWith(subTaskData);
    });

    it('should throw an error when API call fails', async () => {
      // Mock failed response
      const errorMessage = 'Failed to create sub-task';
      vi.mocked(subTaskRepository.createSubTask).mockResolvedValue({
        ok: false,
        text: () => Promise.resolve(errorMessage)
      } as unknown as Response);

      await expect(createSubTask(subTaskData)).rejects.toThrow(errorMessage);
      expect(subTaskRepository.createSubTask).toHaveBeenCalledWith(subTaskData);
      expect(consoleErrorSpy).toHaveBeenCalled();
    });
  });

  describe('getSubTaskById', () => {
    const subTaskId = 1;
    const mockSubTask: SubTask = {
      id: 1,
      task_id: 1,
      title: 'Test Sub-Task 1',
      description: 'Description 1',
      status: 'PENDING',
      due_date: '2023-01-01T00:00:00Z',
      created_at: '2023-01-01T00:00:00Z',
      updated_at: '2023-01-01T00:00:00Z'
    };

    it('should return a sub-task when API call is successful', async () => {
      // Mock successful response
      vi.mocked(subTaskRepository.getSubTaskById).mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({ subTask: mockSubTask })
      } as unknown as Response);

      const result = await getSubTaskById(subTaskId);
      expect(result).toEqual(mockSubTask);
      expect(subTaskRepository.getSubTaskById).toHaveBeenCalledWith(subTaskId);
    });

    it('should throw an error when API call fails', async () => {
      // Mock failed response
      vi.mocked(subTaskRepository.getSubTaskById).mockResolvedValue({
        ok: false
      } as unknown as Response);

      await expect(getSubTaskById(subTaskId)).rejects.toThrow('Sub-task not found');
      expect(subTaskRepository.getSubTaskById).toHaveBeenCalledWith(subTaskId);
      expect(consoleErrorSpy).toHaveBeenCalled();
    });
  });

  describe('updateSubTask', () => {
    const subTaskId = 1;
    const subTaskData: Partial<CreateSubTaskInput> = {
      title: 'Updated Sub-Task',
      status: 'COMPLETED'
    };
    const mockSubTask: SubTask = {
      id: 1,
      task_id: 1,
      title: 'Updated Sub-Task',
      description: 'Description 1',
      status: 'COMPLETED',
      due_date: '2023-01-01T00:00:00Z',
      created_at: '2023-01-01T00:00:00Z',
      updated_at: '2023-01-04T00:00:00Z'
    };

    it('should return an updated sub-task when API call is successful', async () => {
      // Mock successful response
      vi.mocked(subTaskRepository.updateSubTask).mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({ subTask: mockSubTask })
      } as unknown as Response);

      const result = await updateSubTask(subTaskId, subTaskData);
      expect(result).toEqual(mockSubTask);
      expect(subTaskRepository.updateSubTask).toHaveBeenCalledWith(subTaskId, subTaskData);
    });

    it('should throw an error when API call fails', async () => {
      // Mock failed response
      const errorMessage = 'Failed to update sub-task';
      vi.mocked(subTaskRepository.updateSubTask).mockResolvedValue({
        ok: false,
        text: () => Promise.resolve(errorMessage)
      } as unknown as Response);

      await expect(updateSubTask(subTaskId, subTaskData)).rejects.toThrow(errorMessage);
      expect(subTaskRepository.updateSubTask).toHaveBeenCalledWith(subTaskId, subTaskData);
      expect(consoleErrorSpy).toHaveBeenCalled();
    });
  });

  describe('deleteSubTask', () => {
    const subTaskId = 1;

    it('should not throw an error when API call is successful', async () => {
      // Mock successful response
      vi.mocked(subTaskRepository.deleteSubTask).mockResolvedValue({
        ok: true
      } as unknown as Response);

      await expect(deleteSubTask(subTaskId)).resolves.not.toThrow();
      expect(subTaskRepository.deleteSubTask).toHaveBeenCalledWith(subTaskId);
    });

    it('should throw an error when API call fails', async () => {
      // Mock failed response
      const errorMessage = 'Failed to delete sub-task';
      vi.mocked(subTaskRepository.deleteSubTask).mockResolvedValue({
        ok: false,
        text: () => Promise.resolve(errorMessage)
      } as unknown as Response);

      await expect(deleteSubTask(subTaskId)).rejects.toThrow(errorMessage);
      expect(subTaskRepository.deleteSubTask).toHaveBeenCalledWith(subTaskId);
      expect(consoleErrorSpy).toHaveBeenCalled();
    });
  });
});
