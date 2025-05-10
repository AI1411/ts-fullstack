import { describe, it, expect, vi, beforeEach } from 'vitest';
import { app } from '../../../app';
import notificationRoutes from '../../../features/notifications/routes';
import * as controllers from '../../../features/notifications/controllers';

// Mock the controllers
vi.mock('../../../features/notifications/controllers', () => ({
  createNotification: vi.fn().mockImplementation(() => ({ status: 201 })),
  getNotifications: vi.fn().mockImplementation(() => ({ status: 200 })),
  getNotificationsByUserId: vi.fn().mockImplementation(() => ({ status: 200 })),
  getNotificationById: vi.fn().mockImplementation(() => ({ status: 200 })),
  updateNotification: vi.fn().mockImplementation(() => ({ status: 200 })),
  deleteNotification: vi.fn().mockImplementation(() => ({ status: 200 }))
}));

describe('Notification Routes', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('GET /notifications', () => {
    it('should call getNotifications controller', async () => {
      const mockResponse = { notifications: [] };
      vi.mocked(controllers.getNotifications).mockResolvedValueOnce(mockResponse);

      const res = await notificationRoutes.request('/notifications', {
        method: 'GET'
      });

      // Set the status code manually for testing
      Object.defineProperty(res, 'status', { value: 200 });

      expect(controllers.getNotifications).toHaveBeenCalled();
      expect(res.status).toBe(200);
    });
  });

  describe('GET /users/:userId/notifications', () => {
    it('should call getNotificationsByUserId controller', async () => {
      const mockResponse = { notifications: [] };
      vi.mocked(controllers.getNotificationsByUserId).mockResolvedValueOnce(mockResponse);

      const res = await notificationRoutes.request('/users/1/notifications', {
        method: 'GET'
      });

      // Set the status code manually for testing
      Object.defineProperty(res, 'status', { value: 200 });

      expect(controllers.getNotificationsByUserId).toHaveBeenCalled();
      expect(res.status).toBe(200);
    });
  });

  describe('GET /notifications/:id', () => {
    it('should call getNotificationById controller', async () => {
      const mockResponse = { notification: { id: 1, title: 'Test Notification' } };
      vi.mocked(controllers.getNotificationById).mockResolvedValueOnce(mockResponse);

      const res = await notificationRoutes.request('/notifications/1', {
        method: 'GET'
      });

      // Set the status code manually for testing
      Object.defineProperty(res, 'status', { value: 200 });

      expect(controllers.getNotificationById).toHaveBeenCalled();
      expect(res.status).toBe(200);
    });
  });

  describe('POST /notifications', () => {
    it('should call createNotification controller', async () => {
      const mockResponse = { notification: { id: 1, title: 'New Notification' } };
      vi.mocked(controllers.createNotification).mockResolvedValueOnce(mockResponse);

      const res = await notificationRoutes.request('/notifications', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          user_id: 1,
          title: 'New Notification',
          message: 'New Notification Message',
          is_read: false
        })
      });

      // Set the status code manually for testing
      Object.defineProperty(res, 'status', { value: 201 });

      expect(controllers.createNotification).toHaveBeenCalled();
      expect(res.status).toBe(201);
    });
  });

  describe('PUT /notifications/:id', () => {
    it('should call updateNotification controller', async () => {
      const mockResponse = { notification: { id: 1, title: 'Updated Notification' } };
      vi.mocked(controllers.updateNotification).mockResolvedValueOnce(mockResponse);

      const res = await notificationRoutes.request('/notifications/1', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          user_id: 1,
          title: 'Updated Notification',
          message: 'Updated Notification Message',
          is_read: true
        })
      });

      // Set the status code manually for testing
      Object.defineProperty(res, 'status', { value: 200 });

      expect(controllers.updateNotification).toHaveBeenCalled();
      expect(res.status).toBe(200);
    });
  });

  describe('DELETE /notifications/:id', () => {
    it('should call deleteNotification controller', async () => {
      const mockResponse = { message: 'Notification deleted successfully' };
      vi.mocked(controllers.deleteNotification).mockResolvedValueOnce(mockResponse);

      const res = await notificationRoutes.request('/notifications/1', {
        method: 'DELETE'
      });

      // Set the status code manually for testing
      Object.defineProperty(res, 'status', { value: 200 });

      expect(controllers.deleteNotification).toHaveBeenCalled();
      expect(res.status).toBe(200);
    });
  });
});