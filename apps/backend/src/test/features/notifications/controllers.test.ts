import { describe, it, expect, vi, beforeEach } from 'vitest';
import { createNotification, getNotifications, getNotificationsByUserId, getNotificationById, updateNotification, deleteNotification } from '../../../features/notifications/controllers';
import { notificationsTable } from '../../../db/schema';
import * as dbModule from '../../../common/utils/db';

// Mock notification data
const mockNotification = {
  id: 1,
  user_id: 1,
  title: 'Test Notification',
  message: 'Test Message',
  is_read: false,
  created_at: new Date(),
  updated_at: new Date()
};

// Mock the database module
vi.mock('../../../common/utils/db', () => ({
  getDB: vi.fn()
}));

// Mock context
const createMockContext = (body = {}, params = {}) => ({
  req: {
    valid: vi.fn().mockReturnValue(body),
    param: vi.fn((key) => params[key])
  },
  json: vi.fn().mockImplementation((data, status) => ({ data, status })),
  env: {
    DATABASE_URL: 'postgres://test:test@localhost:5432/test'
  }
});

// Mock DB client
const mockDbClient = {
  select: vi.fn().mockReturnThis(),
  from: vi.fn().mockReturnThis(),
  where: vi.fn().mockReturnThis(),
  insert: vi.fn().mockReturnThis(),
  values: vi.fn().mockReturnThis(),
  update: vi.fn().mockReturnThis(),
  set: vi.fn().mockReturnThis(),
  delete: vi.fn().mockReturnThis(),
  returning: vi.fn().mockResolvedValue([mockNotification])
};

describe('Notification Controllers', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(dbModule.getDB).mockReturnValue(mockDbClient);
  });

  describe('createNotification', () => {
    it('should create a new notification and return it', async () => {
      const mockBody = {
        user_id: 1,
        title: 'Test Notification',
        message: 'Test Message',
        is_read: false
      };
      const mockContext = createMockContext(mockBody);

      const result = await createNotification(mockContext);

      expect(mockContext.req.valid).toHaveBeenCalledWith('json');
      expect(mockContext.json).toHaveBeenCalledWith({ notification: mockNotification });
    });

    it('should handle errors', async () => {
      const mockBody = {
        user_id: 1,
        title: 'Test Notification',
        message: 'Test Message',
        is_read: false
      };
      const mockContext = createMockContext(mockBody);

      // Override the mock to throw an error
      mockDbClient.returning.mockRejectedValueOnce(new Error('Database error'));

      const result = await createNotification(mockContext);

      expect(mockContext.json).toHaveBeenCalledWith({ error: 'Database error' }, 500);
    });
  });

  describe('getNotifications', () => {
    it('should return all notifications', async () => {
      const mockContext = createMockContext();
      mockDbClient.select.mockReturnThis();
      mockDbClient.from.mockReturnThis();
      mockDbClient.from.mockResolvedValueOnce([mockNotification]);

      const result = await getNotifications(mockContext);

      expect(mockContext.json).toHaveBeenCalledWith({ notifications: [mockNotification] });
    });

    it('should handle errors', async () => {
      const mockContext = createMockContext();
      mockDbClient.select.mockReturnThis();
      mockDbClient.from.mockRejectedValueOnce(new Error('Database error'));

      const result = await getNotifications(mockContext);

      expect(mockContext.json).toHaveBeenCalledWith({ error: 'Database error' }, 500);
    });
  });

  describe('getNotificationsByUserId', () => {
    it('should return notifications for a specific user', async () => {
      const mockParams = { userId: '1' };
      const mockContext = createMockContext({}, mockParams);
      mockDbClient.select.mockReturnThis();
      mockDbClient.from.mockReturnThis();
      mockDbClient.where.mockResolvedValueOnce([mockNotification]);

      const result = await getNotificationsByUserId(mockContext);

      expect(mockContext.req.param).toHaveBeenCalledWith('userId');
      expect(mockContext.json).toHaveBeenCalledWith({ notifications: [mockNotification] });
    });

    it('should handle errors', async () => {
      const mockParams = { userId: '1' };
      const mockContext = createMockContext({}, mockParams);
      mockDbClient.select.mockReturnThis();
      mockDbClient.from.mockReturnThis();
      mockDbClient.where.mockRejectedValueOnce(new Error('Database error'));

      const result = await getNotificationsByUserId(mockContext);

      expect(mockContext.json).toHaveBeenCalledWith({ error: 'Database error' }, 500);
    });
  });

  describe('getNotificationById', () => {
    it('should return a notification by id', async () => {
      const mockParams = { id: '1' };
      const mockContext = createMockContext({}, mockParams);
      mockDbClient.select.mockReturnThis();
      mockDbClient.from.mockReturnThis();
      mockDbClient.where.mockResolvedValueOnce([mockNotification]);

      const result = await getNotificationById(mockContext);

      expect(mockContext.req.param).toHaveBeenCalledWith('id');
      expect(mockContext.json).toHaveBeenCalledWith({ notification: mockNotification });
    });

    it('should return 404 if notification not found', async () => {
      const mockParams = { id: '999' };
      const mockContext = createMockContext({}, mockParams);
      mockDbClient.select.mockReturnThis();
      mockDbClient.from.mockReturnThis();
      mockDbClient.where.mockResolvedValueOnce([]);

      const result = await getNotificationById(mockContext);

      expect(mockContext.json).toHaveBeenCalledWith({ error: 'Notification not found' }, 404);
    });

    it('should handle errors', async () => {
      const mockParams = { id: '1' };
      const mockContext = createMockContext({}, mockParams);
      mockDbClient.select.mockReturnThis();
      mockDbClient.from.mockReturnThis();
      mockDbClient.where.mockRejectedValueOnce(new Error('Database error'));

      const result = await getNotificationById(mockContext);

      expect(mockContext.json).toHaveBeenCalledWith({ error: 'Database error' }, 500);
    });
  });

  describe('updateNotification', () => {
    it('should update a notification and return it', async () => {
      const mockParams = { id: '1' };
      const mockBody = {
        user_id: 1,
        title: 'Updated Notification',
        message: 'Updated Message',
        is_read: true
      };
      const mockContext = createMockContext(mockBody, mockParams);

      const result = await updateNotification(mockContext);

      expect(mockContext.req.param).toHaveBeenCalledWith('id');
      expect(mockContext.req.valid).toHaveBeenCalledWith('json');
      expect(mockContext.json).toHaveBeenCalledWith({ notification: mockNotification });
    });

    it('should return 404 if notification not found', async () => {
      const mockParams = { id: '999' };
      const mockBody = {
        user_id: 1,
        title: 'Updated Notification',
        message: 'Updated Message',
        is_read: true
      };
      const mockContext = createMockContext(mockBody, mockParams);
      mockDbClient.returning.mockResolvedValueOnce([]);

      const result = await updateNotification(mockContext);

      expect(mockContext.json).toHaveBeenCalledWith({ error: 'Notification not found' }, 404);
    });

    it('should handle errors', async () => {
      const mockParams = { id: '1' };
      const mockBody = {
        user_id: 1,
        title: 'Updated Notification',
        message: 'Updated Message',
        is_read: true
      };
      const mockContext = createMockContext(mockBody, mockParams);
      mockDbClient.returning.mockRejectedValueOnce(new Error('Database error'));

      const result = await updateNotification(mockContext);

      expect(mockContext.json).toHaveBeenCalledWith({ error: 'Database error' }, 500);
    });
  });

  describe('deleteNotification', () => {
    it('should delete a notification and return success message', async () => {
      const mockParams = { id: '1' };
      const mockContext = createMockContext({}, mockParams);

      const result = await deleteNotification(mockContext);

      expect(mockContext.req.param).toHaveBeenCalledWith('id');
      expect(mockContext.json).toHaveBeenCalledWith({ message: 'Notification deleted successfully' });
    });

    it('should return 404 if notification not found', async () => {
      const mockParams = { id: '999' };
      const mockContext = createMockContext({}, mockParams);
      mockDbClient.returning.mockResolvedValueOnce([]);

      const result = await deleteNotification(mockContext);

      expect(mockContext.json).toHaveBeenCalledWith({ error: 'Notification not found' }, 404);
    });

    it('should handle errors', async () => {
      const mockParams = { id: '1' };
      const mockContext = createMockContext({}, mockParams);
      mockDbClient.returning.mockRejectedValueOnce(new Error('Database error'));

      const result = await deleteNotification(mockContext);

      expect(mockContext.json).toHaveBeenCalledWith({ error: 'Database error' }, 500);
    });
  });
});