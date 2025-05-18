import * as controllers from '@/features/admin/notifications/controllers';
import { notificationService } from '@/features/admin/notifications/services';
import { beforeEach, describe, expect, it, vi } from 'vitest';

// Mock the controllers
vi.mock('@/features/admin/notifications/controllers', () => ({
  getNotifications: vi.fn(),
  createNotification: vi.fn(),
  getNotificationById: vi.fn(),
  updateNotification: vi.fn(),
  deleteNotification: vi.fn(),
  toggleNotificationReadStatus: vi.fn(),
}));

describe('Notification Service', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('getNotifications', () => {
    it('should call the controller to get notifications', async () => {
      const mockNotifications = [
        {
          id: 1,
          title: 'Test Notification',
          message: 'This is a test notification',
          user_id: 1,
          is_read: false,
          created_at: '2023-01-01T00:00:00Z',
        },
      ];

      vi.mocked(controllers.getNotifications).mockResolvedValue(
        mockNotifications
      );

      const result = await notificationService.getNotifications();

      expect(controllers.getNotifications).toHaveBeenCalledTimes(1);
      expect(result).toBe(mockNotifications);
    });
  });

  describe('createNotification', () => {
    it('should call the controller to create a notification', async () => {
      const notificationData = {
        title: 'Test Notification',
        message: 'This is a test notification',
        user_id: 1,
        is_read: false,
      };

      const mockNotification = {
        id: 1,
        ...notificationData,
        created_at: '2023-01-01T00:00:00Z',
      };

      vi.mocked(controllers.createNotification).mockResolvedValue(
        mockNotification
      );

      const result =
        await notificationService.createNotification(notificationData);

      expect(controllers.createNotification).toHaveBeenCalledWith(
        notificationData
      );
      expect(result).toBe(mockNotification);
    });
  });

  describe('getNotificationById', () => {
    it('should call the controller to get a notification by id', async () => {
      const mockNotification = {
        id: 1,
        title: 'Test Notification',
        message: 'This is a test notification',
        user_id: 1,
        is_read: false,
        created_at: '2023-01-01T00:00:00Z',
      };

      vi.mocked(controllers.getNotificationById).mockResolvedValue(
        mockNotification
      );

      const result = await notificationService.getNotificationById(1);

      expect(controllers.getNotificationById).toHaveBeenCalledWith(1);
      expect(result).toBe(mockNotification);
    });
  });

  describe('updateNotification', () => {
    it('should call the controller to update a notification', async () => {
      const notificationData = {
        title: 'Updated Notification',
        message: 'This is an updated notification',
      };

      const mockNotification = {
        id: 1,
        title: 'Updated Notification',
        message: 'This is an updated notification',
        user_id: 1,
        is_read: false,
        created_at: '2023-01-01T00:00:00Z',
      };

      vi.mocked(controllers.updateNotification).mockResolvedValue(
        mockNotification
      );

      const result = await notificationService.updateNotification(
        1,
        notificationData
      );

      expect(controllers.updateNotification).toHaveBeenCalledWith(
        1,
        notificationData
      );
      expect(result).toBe(mockNotification);
    });
  });

  describe('deleteNotification', () => {
    it('should call the controller to delete a notification', async () => {
      vi.mocked(controllers.deleteNotification).mockResolvedValue(undefined);

      await notificationService.deleteNotification(1);

      expect(controllers.deleteNotification).toHaveBeenCalledWith(1);
    });
  });

  describe('toggleNotificationReadStatus', () => {
    it('should call the controller to toggle notification read status', async () => {
      const mockNotification = {
        id: 1,
        title: 'Test Notification',
        message: 'This is a test notification',
        user_id: 1,
        is_read: true,
        created_at: '2023-01-01T00:00:00Z',
      };

      vi.mocked(controllers.toggleNotificationReadStatus).mockResolvedValue(
        mockNotification
      );

      const result = await notificationService.toggleNotificationReadStatus(
        1,
        true
      );

      expect(controllers.toggleNotificationReadStatus).toHaveBeenCalledWith(
        1,
        true
      );
      expect(result).toBe(mockNotification);
    });
  });

  describe('getUnreadNotifications', () => {
    it('should return only unread notifications', async () => {
      const mockNotifications = [
        {
          id: 1,
          title: 'Test Notification 1',
          message: 'This is test notification 1',
          user_id: 1,
          is_read: false,
          created_at: '2023-01-01T00:00:00Z',
        },
        {
          id: 2,
          title: 'Test Notification 2',
          message: 'This is test notification 2',
          user_id: 2,
          is_read: true,
          created_at: '2023-01-02T00:00:00Z',
        },
      ];

      vi.mocked(controllers.getNotifications).mockResolvedValue(
        mockNotifications
      );

      const result = await notificationService.getUnreadNotifications();

      expect(controllers.getNotifications).toHaveBeenCalledTimes(1);
      expect(result).toEqual([mockNotifications[0]]);
    });
  });

  describe('getReadNotifications', () => {
    it('should return only read notifications', async () => {
      const mockNotifications = [
        {
          id: 1,
          title: 'Test Notification 1',
          message: 'This is test notification 1',
          user_id: 1,
          is_read: false,
          created_at: '2023-01-01T00:00:00Z',
        },
        {
          id: 2,
          title: 'Test Notification 2',
          message: 'This is test notification 2',
          user_id: 2,
          is_read: true,
          created_at: '2023-01-02T00:00:00Z',
        },
      ];

      vi.mocked(controllers.getNotifications).mockResolvedValue(
        mockNotifications
      );

      const result = await notificationService.getReadNotifications();

      expect(controllers.getNotifications).toHaveBeenCalledTimes(1);
      expect(result).toEqual([mockNotifications[1]]);
    });
  });
});
