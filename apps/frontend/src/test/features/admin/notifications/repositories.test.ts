import { client } from '@/common/utils/client';
import { notificationRepository } from '@/features/admin/notifications/repositories';
import { beforeEach, describe, expect, it, vi } from 'vitest';

// Mock the client
vi.mock('@/common/utils/client', () => ({
  client: {
    notifications: {
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

describe('Notification Repository', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('getNotifications', () => {
    it('should call the client to get notifications', async () => {
      const mockResponse = { status: 200 };
      vi.mocked(client.notifications.$get).mockResolvedValue(mockResponse);

      const result = await notificationRepository.getNotifications();

      expect(client.notifications.$get).toHaveBeenCalledTimes(1);
      expect(result).toBe(mockResponse);
    });
  });

  describe('createNotification', () => {
    it('should call the client to create a notification', async () => {
      const notificationData = {
        title: 'Test Notification',
        message: 'This is a test notification',
        user_id: 1,
        is_read: false,
      };

      const mockResponse = { status: 201 };
      vi.mocked(client.notifications.$post).mockResolvedValue(mockResponse);

      const result =
        await notificationRepository.createNotification(notificationData);

      expect(client.notifications.$post).toHaveBeenCalledWith({
        json: notificationData,
      });
      expect(result).toBe(mockResponse);
    });
  });

  describe('getNotificationById', () => {
    it('should call the client to get a notification by id', async () => {
      const mockResponse = { status: 200 };
      vi.mocked(client.notifications[':id'].$get).mockResolvedValue(
        mockResponse
      );

      const result = await notificationRepository.getNotificationById(1);

      expect(client.notifications[':id'].$get).toHaveBeenCalledWith({
        param: { id: '1' },
      });
      expect(result).toBe(mockResponse);
    });
  });

  describe('updateNotification', () => {
    it('should call the client to update a notification', async () => {
      const notificationData = {
        title: 'Updated Notification',
        message: 'This is an updated notification',
      };

      const mockResponse = { status: 200 };
      vi.mocked(client.notifications[':id'].$put).mockResolvedValue(
        mockResponse
      );

      const result = await notificationRepository.updateNotification(
        1,
        notificationData
      );

      expect(client.notifications[':id'].$put).toHaveBeenCalledWith({
        param: { id: '1' },
        json: notificationData,
      });
      expect(result).toBe(mockResponse);
    });
  });

  describe('deleteNotification', () => {
    it('should call the client to delete a notification', async () => {
      const mockResponse = { status: 204 };
      vi.mocked(client.notifications[':id'].$delete).mockResolvedValue(
        mockResponse
      );

      const result = await notificationRepository.deleteNotification(1);

      expect(client.notifications[':id'].$delete).toHaveBeenCalledWith({
        param: { id: '1' },
      });
      expect(result).toBe(mockResponse);
    });
  });
});
