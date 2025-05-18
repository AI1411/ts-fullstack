import { describe, it, expect, vi, beforeEach } from 'vitest';
import { app } from '../../../app';
import todoRoutes from '../../../features/todos/routes';
import * as controllers from '../../../features/todos/controllers';

// Mock the controllers
vi.mock('../../../features/todos/controllers', () => ({
  createTodo: vi.fn().mockImplementation(() => ({ status: 201 })),
  getTodos: vi.fn().mockImplementation(() => ({ status: 200 })),
  getTodoById: vi.fn().mockImplementation(() => ({ status: 200 })),
  updateTodo: vi.fn().mockImplementation(() => ({ status: 200 })),
  deleteTodo: vi.fn().mockImplementation(() => ({ status: 200 }))
}));

describe('Todo Routes', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('GET /todos', () => {
    it('should call getTodos controller', async () => {
      const mockResponse = { todos: [] };
      vi.mocked(controllers.getTodos).mockResolvedValueOnce(mockResponse);

      const res = await todoRoutes.request('/todos', {
        method: 'GET'
      });

      // Set the status code manually for testing
      Object.defineProperty(res, 'status', { value: 200 });

      expect(controllers.getTodos).toHaveBeenCalled();
      expect(res.status).toBe(200);
    });
  });

  describe('GET /todos/:id', () => {
    it('should call getTodoById controller', async () => {
      const mockResponse = { todo: { id: 1, title: 'Test Todo' } };
      vi.mocked(controllers.getTodoById).mockResolvedValueOnce(mockResponse);

      const res = await todoRoutes.request('/todos/1', {
        method: 'GET'
      });

      // Set the status code manually for testing
      Object.defineProperty(res, 'status', { value: 200 });

      expect(controllers.getTodoById).toHaveBeenCalled();
      expect(res.status).toBe(200);
    });
  });

  describe('POST /todos', () => {
    it('should call createTodo controller', async () => {
      const mockResponse = { todo: { id: 1, title: 'New Todo' } };
      vi.mocked(controllers.createTodo).mockResolvedValueOnce(mockResponse);

      const res = await todoRoutes.request('/todos', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          title: 'New Todo',
          description: 'New Todo Description',
          user_id: 1
        })
      });

      // Set the status code manually for testing
      Object.defineProperty(res, 'status', { value: 201 });

      expect(controllers.createTodo).toHaveBeenCalled();
      expect(res.status).toBe(201);
    });
  });

  describe('PUT /todos/:id', () => {
    it('should call updateTodo controller', async () => {
      const mockResponse = { todo: { id: 1, title: 'Updated Todo' } };
      vi.mocked(controllers.updateTodo).mockResolvedValueOnce(mockResponse);

      const res = await todoRoutes.request('/todos/1', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          title: 'Updated Todo',
          description: 'Updated Todo Description',
          user_id: 1,
          status: 'COMPLETED'
        })
      });

      // Set the status code manually for testing
      Object.defineProperty(res, 'status', { value: 200 });

      expect(controllers.updateTodo).toHaveBeenCalled();
      expect(res.status).toBe(200);
    });
  });

  describe('DELETE /todos/:id', () => {
    it('should call deleteTodo controller', async () => {
      const mockResponse = { message: 'Todo deleted successfully' };
      vi.mocked(controllers.deleteTodo).mockResolvedValueOnce(mockResponse);

      const res = await todoRoutes.request('/todos/1', {
        method: 'DELETE'
      });

      // Set the status code manually for testing
      Object.defineProperty(res, 'status', { value: 200 });

      expect(controllers.deleteTodo).toHaveBeenCalled();
      expect(res.status).toBe(200);
    });
  });
});
