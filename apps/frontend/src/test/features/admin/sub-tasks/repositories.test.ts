import { describe, it, expect, vi, beforeEach } from 'vitest';
import { subTaskRepository } from '@/features/admin/sub-tasks/repositories';
import { client } from '@/common/utils/client';
import { CreateSubTaskInput } from '@/features/admin/sub-tasks/controllers';

// Define a type for mock responses to avoid using 'any'
type MockResponse = {
  data: string;
  [key: string]: unknown;
};

// Mock the client utility
vi.mock('@/common/utils/client', () => ({
  client: {
    'sub-tasks': {
      $get: vi.fn(),
      $post: vi.fn(),
      ':id': {
        $get: vi.fn(),
        $put: vi.fn(),
        $delete: vi.fn()
      }
    },
    tasks: {
      ':taskId': {
        'sub-tasks': {
          $get: vi.fn()
        }
      }
    }
  }
}));

describe('Sub-Task Repository', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('getSubTasks', () => {
    const mockResponse = { data: 'mock data' };

    it('should call the correct API endpoint', async () => {
      // Mock successful response
      vi.mocked(client['sub-tasks'].$get).mockResolvedValue(mockResponse as MockResponse);

      const result = await subTaskRepository.getSubTasks();

      expect(client['sub-tasks'].$get).toHaveBeenCalled();
      expect(result).toEqual(mockResponse);
    });
  });

  describe('getSubTasksByTaskId', () => {
    const taskId = 1;
    const mockResponse = { data: 'mock data' };

    it('should call the correct API endpoint with the right parameters', async () => {
      // Mock successful response
      vi.mocked(client.tasks[':taskId']['sub-tasks'].$get).mockResolvedValue(mockResponse as MockResponse);

      const result = await subTaskRepository.getSubTasksByTaskId(taskId);

      expect(client.tasks[':taskId']['sub-tasks'].$get).toHaveBeenCalledWith({
        param: { taskId: taskId.toString() }
      });
      expect(result).toEqual(mockResponse);
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
    const mockResponse = { data: 'mock data' };

    it('should call the correct API endpoint with the right data', async () => {
      // Mock successful response
      vi.mocked(client['sub-tasks'].$post).mockResolvedValue(mockResponse as MockResponse);

      const result = await subTaskRepository.createSubTask(subTaskData);

      expect(client['sub-tasks'].$post).toHaveBeenCalledWith({
        json: subTaskData
      });
      expect(result).toEqual(mockResponse);
    });
  });

  describe('getSubTaskById', () => {
    const subTaskId = 1;
    const mockResponse = { data: 'mock data' };

    it('should call the correct API endpoint with the right parameters', async () => {
      // Mock successful response
      vi.mocked(client['sub-tasks'][':id'].$get).mockResolvedValue(mockResponse as MockResponse);

      const result = await subTaskRepository.getSubTaskById(subTaskId);

      expect(client['sub-tasks'][':id'].$get).toHaveBeenCalledWith({
        param: { id: subTaskId.toString() }
      });
      expect(result).toEqual(mockResponse);
    });
  });

  describe('updateSubTask', () => {
    const subTaskId = 1;
    const subTaskData: Partial<CreateSubTaskInput> = {
      title: 'Updated Sub-Task',
      status: 'COMPLETED'
    };
    const mockResponse = { data: 'mock data' };

    it('should call the correct API endpoint with the right parameters and data', async () => {
      // Mock successful response
      vi.mocked(client['sub-tasks'][':id'].$put).mockResolvedValue(mockResponse as MockResponse);

      const result = await subTaskRepository.updateSubTask(subTaskId, subTaskData);

      expect(client['sub-tasks'][':id'].$put).toHaveBeenCalledWith({
        param: { id: subTaskId.toString() },
        json: subTaskData
      });
      expect(result).toEqual(mockResponse);
    });
  });

  describe('deleteSubTask', () => {
    const subTaskId = 1;
    const mockResponse = { data: 'mock data' };

    it('should call the correct API endpoint with the right parameters', async () => {
      // Mock successful response
      vi.mocked(client['sub-tasks'][':id'].$delete).mockResolvedValue(mockResponse as MockResponse);

      const result = await subTaskRepository.deleteSubTask(subTaskId);

      expect(client['sub-tasks'][':id'].$delete).toHaveBeenCalledWith({
        param: { id: subTaskId.toString() }
      });
      expect(result).toEqual(mockResponse);
    });
  });
});