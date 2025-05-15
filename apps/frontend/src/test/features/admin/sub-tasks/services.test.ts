import { describe, it, expect, vi, beforeEach } from 'vitest';
import { subTaskService } from '@/features/admin/sub-tasks/services';
import * as controllers from '@/features/admin/sub-tasks/controllers';
import { SubTask, CreateSubTaskInput } from '@/features/admin/sub-tasks/controllers';

// Mock the controllers
vi.mock('@/features/admin/sub-tasks/controllers', () => ({
  getSubTasks: vi.fn(),
  getSubTasksByTaskId: vi.fn(),
  createSubTask: vi.fn(),
  getSubTaskById: vi.fn(),
  updateSubTask: vi.fn(),
  deleteSubTask: vi.fn(),
  // Re-export types
  SubTask: {},
  CreateSubTaskInput: {}
}));

describe('Sub-Task Service', () => {
  beforeEach(() => {
    vi.clearAllMocks();
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

    it('should call the controller method with the correct arguments', async () => {
      // Mock successful response
      vi.mocked(controllers.getSubTasks).mockResolvedValue(mockSubTasks);

      const result = await subTaskService.getSubTasks();
      
      expect(controllers.getSubTasks).toHaveBeenCalled();
      expect(result).toEqual(mockSubTasks);
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

    it('should call the controller method with the correct arguments', async () => {
      // Mock successful response
      vi.mocked(controllers.getSubTasksByTaskId).mockResolvedValue(mockSubTasks);

      const result = await subTaskService.getSubTasksByTaskId(taskId);
      
      expect(controllers.getSubTasksByTaskId).toHaveBeenCalledWith(taskId);
      expect(result).toEqual(mockSubTasks);
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

    it('should call the controller method with the correct arguments', async () => {
      // Mock successful response
      vi.mocked(controllers.createSubTask).mockResolvedValue(mockSubTask);

      const result = await subTaskService.createSubTask(subTaskData);
      
      expect(controllers.createSubTask).toHaveBeenCalledWith(subTaskData);
      expect(result).toEqual(mockSubTask);
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

    it('should call the controller method with the correct arguments', async () => {
      // Mock successful response
      vi.mocked(controllers.getSubTaskById).mockResolvedValue(mockSubTask);

      const result = await subTaskService.getSubTaskById(subTaskId);
      
      expect(controllers.getSubTaskById).toHaveBeenCalledWith(subTaskId);
      expect(result).toEqual(mockSubTask);
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

    it('should call the controller method with the correct arguments', async () => {
      // Mock successful response
      vi.mocked(controllers.updateSubTask).mockResolvedValue(mockSubTask);

      const result = await subTaskService.updateSubTask(subTaskId, subTaskData);
      
      expect(controllers.updateSubTask).toHaveBeenCalledWith(subTaskId, subTaskData);
      expect(result).toEqual(mockSubTask);
    });
  });

  describe('deleteSubTask', () => {
    const subTaskId = 1;

    it('should call the controller method with the correct arguments', async () => {
      // Mock successful response
      vi.mocked(controllers.deleteSubTask).mockResolvedValue(undefined);

      await subTaskService.deleteSubTask(subTaskId);
      
      expect(controllers.deleteSubTask).toHaveBeenCalledWith(subTaskId);
    });
  });

  describe('getCompletedSubTasks', () => {
    const taskId = 1;
    const mockSubTasks: SubTask[] = [
      {
        id: 1,
        task_id: 1,
        title: 'Test Sub-Task 1',
        description: 'Description 1',
        status: 'COMPLETED',
        due_date: '2023-01-01T00:00:00Z',
        created_at: '2023-01-01T00:00:00Z',
        updated_at: '2023-01-01T00:00:00Z'
      },
      {
        id: 2,
        task_id: 1,
        title: 'Test Sub-Task 2',
        description: null,
        status: 'PENDING',
        due_date: null,
        created_at: '2023-01-02T00:00:00Z',
        updated_at: '2023-01-02T00:00:00Z'
      },
      {
        id: 3,
        task_id: 1,
        title: 'Test Sub-Task 3',
        description: 'Description 3',
        status: 'COMPLETED',
        due_date: '2023-01-03T00:00:00Z',
        created_at: '2023-01-03T00:00:00Z',
        updated_at: '2023-01-03T00:00:00Z'
      }
    ];

    it('should filter completed sub-tasks', async () => {
      // Mock successful response
      vi.mocked(controllers.getSubTasksByTaskId).mockResolvedValue(mockSubTasks);

      const result = await subTaskService.getCompletedSubTasks(taskId);
      
      expect(controllers.getSubTasksByTaskId).toHaveBeenCalledWith(taskId);
      expect(result).toEqual([mockSubTasks[0], mockSubTasks[2]]);
      expect(result.every(subTask => subTask.status === 'COMPLETED')).toBe(true);
    });
  });

  describe('getPendingSubTasks', () => {
    const taskId = 1;
    const mockSubTasks: SubTask[] = [
      {
        id: 1,
        task_id: 1,
        title: 'Test Sub-Task 1',
        description: 'Description 1',
        status: 'COMPLETED',
        due_date: '2023-01-01T00:00:00Z',
        created_at: '2023-01-01T00:00:00Z',
        updated_at: '2023-01-01T00:00:00Z'
      },
      {
        id: 2,
        task_id: 1,
        title: 'Test Sub-Task 2',
        description: null,
        status: 'PENDING',
        due_date: null,
        created_at: '2023-01-02T00:00:00Z',
        updated_at: '2023-01-02T00:00:00Z'
      },
      {
        id: 3,
        task_id: 1,
        title: 'Test Sub-Task 3',
        description: 'Description 3',
        status: 'PENDING',
        due_date: '2023-01-03T00:00:00Z',
        created_at: '2023-01-03T00:00:00Z',
        updated_at: '2023-01-03T00:00:00Z'
      }
    ];

    it('should filter pending sub-tasks', async () => {
      // Mock successful response
      vi.mocked(controllers.getSubTasksByTaskId).mockResolvedValue(mockSubTasks);

      const result = await subTaskService.getPendingSubTasks(taskId);
      
      expect(controllers.getSubTasksByTaskId).toHaveBeenCalledWith(taskId);
      expect(result).toEqual([mockSubTasks[1], mockSubTasks[2]]);
      expect(result.every(subTask => subTask.status === 'PENDING')).toBe(true);
    });
  });

  describe('getInProgressSubTasks', () => {
    const taskId = 1;
    const mockSubTasks: SubTask[] = [
      {
        id: 1,
        task_id: 1,
        title: 'Test Sub-Task 1',
        description: 'Description 1',
        status: 'COMPLETED',
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
      },
      {
        id: 3,
        task_id: 1,
        title: 'Test Sub-Task 3',
        description: 'Description 3',
        status: 'IN_PROGRESS',
        due_date: '2023-01-03T00:00:00Z',
        created_at: '2023-01-03T00:00:00Z',
        updated_at: '2023-01-03T00:00:00Z'
      }
    ];

    it('should filter in-progress sub-tasks', async () => {
      // Mock successful response
      vi.mocked(controllers.getSubTasksByTaskId).mockResolvedValue(mockSubTasks);

      const result = await subTaskService.getInProgressSubTasks(taskId);
      
      expect(controllers.getSubTasksByTaskId).toHaveBeenCalledWith(taskId);
      expect(result).toEqual([mockSubTasks[1], mockSubTasks[2]]);
      expect(result.every(subTask => subTask.status === 'IN_PROGRESS')).toBe(true);
    });
  });
});