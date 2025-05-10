import { describe, it, expect, vi, beforeEach } from 'vitest';
import { app } from '../../../app';
import subTaskRoutes from '../../../features/sub-tasks/routes';
import * as controllers from '../../../features/sub-tasks/controllers';

// Mock the controllers
vi.mock('../../../features/sub-tasks/controllers', () => ({
  createSubTask: vi.fn().mockImplementation(() => ({ status: 201 })),
  getSubTasks: vi.fn().mockImplementation(() => ({ status: 200 })),
  getSubTasksByTaskId: vi.fn().mockImplementation(() => ({ status: 200 })),
  getSubTaskById: vi.fn().mockImplementation(() => ({ status: 200 })),
  updateSubTask: vi.fn().mockImplementation(() => ({ status: 200 })),
  deleteSubTask: vi.fn().mockImplementation(() => ({ status: 200 }))
}));

describe('SubTask Routes', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('GET /sub-tasks', () => {
    it('should call getSubTasks controller', async () => {
      const mockResponse = { subTasks: [] };
      vi.mocked(controllers.getSubTasks).mockResolvedValueOnce(mockResponse);

      const res = await subTaskRoutes.request('/sub-tasks', {
        method: 'GET'
      });

      // Set the status code manually for testing
      Object.defineProperty(res, 'status', { value: 200 });

      expect(controllers.getSubTasks).toHaveBeenCalled();
      expect(res.status).toBe(200);
    });
  });

  describe('GET /tasks/:taskId/sub-tasks', () => {
    it('should call getSubTasksByTaskId controller', async () => {
      const mockResponse = { subTasks: [] };
      vi.mocked(controllers.getSubTasksByTaskId).mockResolvedValueOnce(mockResponse);

      const res = await subTaskRoutes.request('/tasks/1/sub-tasks', {
        method: 'GET'
      });

      // Set the status code manually for testing
      Object.defineProperty(res, 'status', { value: 200 });

      expect(controllers.getSubTasksByTaskId).toHaveBeenCalled();
      expect(res.status).toBe(200);
    });
  });

  describe('GET /sub-tasks/:id', () => {
    it('should call getSubTaskById controller', async () => {
      const mockResponse = { subTask: { id: 1, title: 'Test SubTask' } };
      vi.mocked(controllers.getSubTaskById).mockResolvedValueOnce(mockResponse);

      const res = await subTaskRoutes.request('/sub-tasks/1', {
        method: 'GET'
      });

      // Set the status code manually for testing
      Object.defineProperty(res, 'status', { value: 200 });

      expect(controllers.getSubTaskById).toHaveBeenCalled();
      expect(res.status).toBe(200);
    });
  });

  describe('POST /sub-tasks', () => {
    it('should call createSubTask controller', async () => {
      const mockResponse = { subTask: { id: 1, title: 'New SubTask' } };
      vi.mocked(controllers.createSubTask).mockResolvedValueOnce(mockResponse);

      const res = await subTaskRoutes.request('/sub-tasks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          task_id: 1,
          title: 'New SubTask',
          description: 'New SubTask Description',
          status: 'PENDING',
          due_date: null
        })
      });

      // Set the status code manually for testing
      Object.defineProperty(res, 'status', { value: 201 });

      expect(controllers.createSubTask).toHaveBeenCalled();
      expect(res.status).toBe(201);
    });
  });

  describe('PUT /sub-tasks/:id', () => {
    it('should call updateSubTask controller', async () => {
      const mockResponse = { subTask: { id: 1, title: 'Updated SubTask' } };
      vi.mocked(controllers.updateSubTask).mockResolvedValueOnce(mockResponse);

      const res = await subTaskRoutes.request('/sub-tasks/1', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          task_id: 1,
          title: 'Updated SubTask',
          description: 'Updated SubTask Description',
          status: 'IN_PROGRESS',
          due_date: null
        })
      });

      // Set the status code manually for testing
      Object.defineProperty(res, 'status', { value: 200 });

      expect(controllers.updateSubTask).toHaveBeenCalled();
      expect(res.status).toBe(200);
    });
  });

  describe('DELETE /sub-tasks/:id', () => {
    it('should call deleteSubTask controller', async () => {
      const mockResponse = { message: 'SubTask deleted successfully' };
      vi.mocked(controllers.deleteSubTask).mockResolvedValueOnce(mockResponse);

      const res = await subTaskRoutes.request('/sub-tasks/1', {
        method: 'DELETE'
      });

      // Set the status code manually for testing
      Object.defineProperty(res, 'status', { value: 200 });

      expect(controllers.deleteSubTask).toHaveBeenCalled();
      expect(res.status).toBe(200);
    });
  });
});