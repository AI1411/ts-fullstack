import {
  createNotification,
  deleteNotification,
  getNotificationById,
  getNotifications,
  toggleNotificationReadStatus,
  updateNotification,
} from '@/features/admin/notifications/controllers';
import { notificationRepository } from '@/features/admin/notifications/repositories';
import { beforeEach, describe, expect, it, vi } from 'vitest';

// Define a type for mocked responses
type MockResponse = {
  ok: boolean;
  json?: () => Promise<unknown>;
  text?: () => Promise<string>;
};

// Mock the notification repository
vi.mock('@/features/admin/notifications/repositories', () => ({
  notificationRepository: {
    getNotifications: vi.fn(),
    createNotification: vi.fn(),
    getNotificationById: vi.fn(),
    updateNotification: vi.fn(),
    deleteNotification: vi.fn(),
  },
}));

describe('Notification Controllers', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('getNotifications', () => {
    it('should return notifications from the repository', async () => {
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

      const mockResponse: MockResponse = {
        ok: true,
        json: () => Promise.resolve({ notifications: mockNotifications }),
      };

      vi.mocked(notificationRepository.getNotifications).mockResolvedValue(
        mockResponse
      );

      const result = await getNotifications();

      expect(notificationRepository.getNotifications).toHaveBeenCalledTimes(1);
      expect(result).toEqual(mockNotifications);
    });

    it('should handle errors from the repository', async () => {
      vi.mocked(notificationRepository.getNotifications).mockRejectedValue(
        new Error('Network error')
      );

      await expect(getNotifications()).rejects.toThrow('Network error');
      expect(notificationRepository.getNotifications).toHaveBeenCalledTimes(1);
    });
  });

  describe('createNotification', () => {
    it('should create a notification using the repository', async () => {
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

      const mockResponse: MockResponse = {
        ok: true,
        json: () => Promise.resolve({ notification: mockNotification }),
      };

      vi.mocked(notificationRepository.createNotification).mockResolvedValue(
        mockResponse
      );

      const result = await createNotification(notificationData);

      expect(notificationRepository.createNotification).toHaveBeenCalledWith(
        notificationData
      );
      expect(result).toEqual(mockNotification);
    });

    it('should handle errors when response is not ok', async () => {
      const notificationData = {
        title: 'Test Notification',
        message: 'This is a test notification',
        user_id: 1,
        is_read: false,
      };

      const mockResponse: MockResponse = {
        ok: false,
        text: () => Promise.resolve('Invalid notification data'),
      };

      vi.mocked(notificationRepository.createNotification).mockResolvedValue(
        mockResponse
      );

      await expect(createNotification(notificationData)).rejects.toThrow(
        'Invalid notification data'
      );
      expect(notificationRepository.createNotification).toHaveBeenCalledWith(
        notificationData
      );
    });

    it('should handle errors from the repository', async () => {
      const notificationData = {
        title: 'Test Notification',
        message: 'This is a test notification',
        user_id: 1,
        is_read: false,
      };

      vi.mocked(notificationRepository.createNotification).mockRejectedValue(
        new Error('Network error')
      );

      await expect(createNotification(notificationData)).rejects.toThrow(
        'Network error'
      );
      expect(notificationRepository.createNotification).toHaveBeenCalledWith(
        notificationData
      );
    });
  });

  describe('getNotificationById', () => {
    it('should return a notification by id from the repository', async () => {
      const mockNotification = {
        id: 1,
        title: 'Test Notification',
        message: 'This is a test notification',
        user_id: 1,
        is_read: false,
        created_at: '2023-01-01T00:00:00Z',
      };

      const mockResponse: MockResponse = {
        ok: true,
        json: () => Promise.resolve({ notification: mockNotification }),
      };

      vi.mocked(notificationRepository.getNotificationById).mockResolvedValue(
        mockResponse
      );

      const result = await getNotificationById(1);

      expect(notificationRepository.getNotificationById).toHaveBeenCalledWith(
        1
      );
      expect(result).toEqual(mockNotification);
    });

    it('should handle errors when notification is not found', async () => {
      const mockResponse: MockResponse = {
        ok: false,
      };

      vi.mocked(notificationRepository.getNotificationById).mockResolvedValue(
        mockResponse
      );

      await expect(getNotificationById(999)).rejects.toThrow(
        'Notification not found'
      );
      expect(notificationRepository.getNotificationById).toHaveBeenCalledWith(
        999
      );
    });

    it('should handle errors from the repository', async () => {
      vi.mocked(notificationRepository.getNotificationById).mockRejectedValue(
        new Error('Network error')
      );

      await expect(getNotificationById(1)).rejects.toThrow('Network error');
      expect(notificationRepository.getNotificationById).toHaveBeenCalledWith(
        1
      );
    });
  });

  describe('updateNotification', () => {
    it('should update a notification using the repository', async () => {
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

      const mockResponse: MockResponse = {
        ok: true,
        json: () => Promise.resolve({ notification: mockNotification }),
      };

      vi.mocked(notificationRepository.updateNotification).mockResolvedValue(
        mockResponse
      );

      const result = await updateNotification(1, notificationData);

      expect(notificationRepository.updateNotification).toHaveBeenCalledWith(
        1,
        notificationData
      );
      expect(result).toEqual(mockNotification);
    });

    it('should handle errors when response is not ok', async () => {
      const notificationData = {
        title: 'Updated Notification',
        message: 'This is an updated notification',
      };

      const mockResponse: MockResponse = {
        ok: false,
        text: () => Promise.resolve('Invalid notification data'),
      };

      vi.mocked(notificationRepository.updateNotification).mockResolvedValue(
        mockResponse
      );

      await expect(updateNotification(1, notificationData)).rejects.toThrow(
        'Invalid notification data'
      );
      expect(notificationRepository.updateNotification).toHaveBeenCalledWith(
        1,
        notificationData
      );
    });

    it('should handle errors from the repository', async () => {
      const notificationData = {
        title: 'Updated Notification',
        message: 'This is an updated notification',
      };

      vi.mocked(notificationRepository.updateNotification).mockRejectedValue(
        new Error('Network error')
      );

      await expect(updateNotification(1, notificationData)).rejects.toThrow(
        'Network error'
      );
      expect(notificationRepository.updateNotification).toHaveBeenCalledWith(
        1,
        notificationData
      );
    });
  });

  describe('deleteNotification', () => {
    it('should delete a notification using the repository', async () => {
      const mockResponse: MockResponse = {
        ok: true,
      };

      vi.mocked(notificationRepository.deleteNotification).mockResolvedValue(
        mockResponse
      );

      await deleteNotification(1);

      expect(notificationRepository.deleteNotification).toHaveBeenCalledWith(1);
    });

    it('should handle errors when response is not ok', async () => {
      const mockResponse: MockResponse = {
        ok: false,
        text: () => Promise.resolve('Notification not found'),
      };

      vi.mocked(notificationRepository.deleteNotification).mockResolvedValue(
        mockResponse
      );

      await expect(deleteNotification(999)).rejects.toThrow(
        'Notification not found'
      );
      expect(notificationRepository.deleteNotification).toHaveBeenCalledWith(
        999
      );
    });

    it('should handle errors from the repository', async () => {
      vi.mocked(notificationRepository.deleteNotification).mockRejectedValue(
        new Error('Network error')
      );

      await expect(deleteNotification(1)).rejects.toThrow('Network error');
      expect(notificationRepository.deleteNotification).toHaveBeenCalledWith(1);
    });
  });

  describe('toggleNotificationReadStatus', () => {
    it('should toggle notification read status using the repository', async () => {
      const mockNotification = {
        id: 1,
        title: 'Test Notification',
        message: 'This is a test notification',
        user_id: 1,
        is_read: true,
        created_at: '2023-01-01T00:00:00Z',
      };

      const mockResponse: MockResponse = {
        ok: true,
        json: () => Promise.resolve({ notification: mockNotification }),
      };

      vi.mocked(notificationRepository.updateNotification).mockResolvedValue(
        mockResponse
      );

      const result = await toggleNotificationReadStatus(1, true);

      expect(notificationRepository.updateNotification).toHaveBeenCalledWith(
        1,
        { is_read: true }
      );
      expect(result).toEqual(mockNotification);
    });

    it('should handle errors when response is not ok', async () => {
      const mockResponse: MockResponse = {
        ok: false,
        text: () => Promise.resolve('Notification not found'),
      };

      vi.mocked(notificationRepository.updateNotification).mockResolvedValue(
        mockResponse
      );

      await expect(toggleNotificationReadStatus(999, true)).rejects.toThrow(
        'Notification not found'
      );
      expect(notificationRepository.updateNotification).toHaveBeenCalledWith(
        999,
        { is_read: true }
      );
    });

    it('should handle errors from the repository', async () => {
      vi.mocked(notificationRepository.updateNotification).mockRejectedValue(
        new Error('Network error')
      );

      await expect(toggleNotificationReadStatus(1, true)).rejects.toThrow(
        'Network error'
      );
      expect(notificationRepository.updateNotification).toHaveBeenCalledWith(
        1,
        { is_read: true }
      );
    });
  });
});
