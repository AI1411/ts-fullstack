import { client } from '@/common/utils/client';
import type { CreateTaskInput } from '@/features/admin/tasks/controllers';
import { taskRepository } from '@/features/admin/tasks/repositories';
import { beforeEach, describe, expect, it, vi } from 'vitest';

// Define a type for mocked responses
type MockApiResponse = {
  status: number;
  json?: () => Promise<unknown>;
};

// Mock the client
vi.mock('@/common/utils/client', () => ({
  client: {
    tasks: {
      $get: vi.fn(),
      $post: vi.fn(),
      ':id': {
        $get: vi.fn(),
        $put: vi.fn(),
        $delete: vi.fn(),
      },
    },
  },
}));

describe('Task Repository', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('getTasks', () => {
    it('should call the client method', async () => {
      // Mock successful response
      const mockResponse: MockApiResponse = { status: 200 };
      vi.mocked(client.tasks.$get).mockResolvedValue(mockResponse);

      const result = await taskRepository.getTasks();

      expect(client.tasks.$get).toHaveBeenCalled();
      expect(result).toEqual(mockResponse);
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

    it('should call the client method with the correct arguments', async () => {
      // Mock successful response
      const mockResponse: MockApiResponse = { status: 201 };
      vi.mocked(client.tasks.$post).mockResolvedValue(mockResponse);

      const result = await taskRepository.createTask(taskData);

      expect(client.tasks.$post).toHaveBeenCalledWith({
        json: taskData,
      });
      expect(result).toEqual(mockResponse);
    });
  });

  describe('getTaskById', () => {
    const taskId = 1;

    it('should call the client method with the correct arguments', async () => {
      // Mock successful response
      const mockResponse: MockApiResponse = { status: 200 };
      vi.mocked(client.tasks[':id'].$get).mockResolvedValue(mockResponse);

      const result = await taskRepository.getTaskById(taskId);

      expect(client.tasks[':id'].$get).toHaveBeenCalledWith({
        param: { id: taskId.toString() },
      });
      expect(result).toEqual(mockResponse);
    });
  });

  describe('updateTask', () => {
    const taskId = 1;
    const taskData: Partial<CreateTaskInput> = {
      title: 'Updated Task',
      status: 'IN_PROGRESS',
    };

    it('should call the client method with the correct arguments', async () => {
      // Mock successful response
      const mockResponse: MockApiResponse = { status: 200 };
      vi.mocked(client.tasks[':id'].$put).mockResolvedValue(mockResponse);

      const result = await taskRepository.updateTask(taskId, taskData);

      expect(client.tasks[':id'].$put).toHaveBeenCalledWith({
        param: { id: taskId.toString() },
        json: taskData,
      });
      expect(result).toEqual(mockResponse);
    });
  });

  describe('deleteTask', () => {
    const taskId = 1;

    it('should call the client method with the correct arguments', async () => {
      // Mock successful response
      const mockResponse: MockApiResponse = { status: 204 };
      vi.mocked(client.tasks[':id'].$delete).mockResolvedValue(mockResponse);

      const result = await taskRepository.deleteTask(taskId);

      expect(client.tasks[':id'].$delete).toHaveBeenCalledWith({
        param: { id: taskId.toString() },
      });
      expect(result).toEqual(mockResponse);
    });
  });
});
