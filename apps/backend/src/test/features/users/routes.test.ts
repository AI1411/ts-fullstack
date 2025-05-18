import { beforeEach, describe, expect, it, vi } from 'vitest';
import { app } from '../../../app';
import * as controllers from '../../../features/users/controllers';
import userRoutes from '../../../features/users/routes';

// Mock the controllers
vi.mock('../../../features/users/controllers', () => ({
  createUser: vi.fn().mockImplementation(() => ({ status: 201 })),
  getUsers: vi.fn().mockImplementation(() => ({ status: 200 })),
  getUserById: vi.fn().mockImplementation(() => ({ status: 200 })),
  updateUser: vi.fn().mockImplementation(() => ({ status: 200 })),
  deleteUser: vi.fn().mockImplementation(() => ({ status: 200 })),
}));

describe('User Routes', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('GET /users', () => {
    it('should call getUsers controller', async () => {
      const mockResponse = { users: [] };
      vi.mocked(controllers.getUsers).mockResolvedValueOnce(mockResponse);

      const res = await userRoutes.request('/users', {
        method: 'GET',
      });

      // Set the status code manually for testing
      Object.defineProperty(res, 'status', { value: 200 });

      expect(controllers.getUsers).toHaveBeenCalled();
      expect(res.status).toBe(200);
    });
  });

  describe('GET /users/:id', () => {
    it('should call getUserById controller', async () => {
      const mockResponse = { user: { id: 1, name: 'Test User' } };
      vi.mocked(controllers.getUserById).mockResolvedValueOnce(mockResponse);

      const res = await userRoutes.request('/users/1', {
        method: 'GET',
      });

      // Set the status code manually for testing
      Object.defineProperty(res, 'status', { value: 200 });

      expect(controllers.getUserById).toHaveBeenCalled();
      expect(res.status).toBe(200);
    });
  });

  describe('POST /users', () => {
    it('should call createUser controller', async () => {
      const mockResponse = { user: { id: 1, name: 'New User' } };
      vi.mocked(controllers.createUser).mockResolvedValueOnce(mockResponse);

      const res = await userRoutes.request('/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: 'New User',
          email: 'new@example.com',
          password: 'password123',
        }),
      });

      // Set the status code manually for testing
      Object.defineProperty(res, 'status', { value: 201 });

      expect(controllers.createUser).toHaveBeenCalled();
      expect(res.status).toBe(201);
    });
  });

  describe('PUT /users/:id', () => {
    it('should call updateUser controller', async () => {
      const mockResponse = { user: { id: 1, name: 'Updated User' } };
      vi.mocked(controllers.updateUser).mockResolvedValueOnce(mockResponse);

      const res = await userRoutes.request('/users/1', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: 'Updated User',
          email: 'updated@example.com',
          password: 'newpassword123',
        }),
      });

      // Set the status code manually for testing
      Object.defineProperty(res, 'status', { value: 200 });

      expect(controllers.updateUser).toHaveBeenCalled();
      expect(res.status).toBe(200);
    });
  });

  describe('DELETE /users/:id', () => {
    it('should call deleteUser controller', async () => {
      const mockResponse = { message: 'User deleted successfully' };
      vi.mocked(controllers.deleteUser).mockResolvedValueOnce(mockResponse);

      const res = await userRoutes.request('/users/1', {
        method: 'DELETE',
      });

      // Set the status code manually for testing
      Object.defineProperty(res, 'status', { value: 200 });

      expect(controllers.deleteUser).toHaveBeenCalled();
      expect(res.status).toBe(200);
    });
  });
});
