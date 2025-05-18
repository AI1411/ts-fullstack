import { describe, expect, it } from 'vitest';
import { notificationSchema } from '../../../features/notifications/schemas';

describe('Notification Schemas', () => {
  describe('notificationSchema', () => {
    it('should validate a valid notification with only required fields', () => {
      const validNotification = {
        title: 'Test Notification',
        message: 'This is a test notification',
      };

      const result = notificationSchema.safeParse(validNotification);
      expect(result.success).toBe(true);

      // Check default values
      if (result.success) {
        expect(result.data.is_read).toBe(false);
      }
    });

    it('should validate a valid notification with all fields', () => {
      const validNotification = {
        id: 1,
        user_id: 1,
        title: 'Test Notification',
        message: 'This is a test notification',
        is_read: true,
      };

      const result = notificationSchema.safeParse(validNotification);
      expect(result.success).toBe(true);
    });

    it('should validate a notification with null values for nullable fields', () => {
      const validNotification = {
        title: 'Test Notification',
        message: 'This is a test notification',
        user_id: null,
      };

      const result = notificationSchema.safeParse(validNotification);
      expect(result.success).toBe(true);
    });

    it('should reject a notification with title shorter than 2 characters', () => {
      const invalidNotification = {
        title: 'A', // Too short
        message: 'This is a test notification',
      };

      const result = notificationSchema.safeParse(invalidNotification);
      expect(result.success).toBe(false);
    });

    it('should reject a notification with message shorter than 1 character', () => {
      const invalidNotification = {
        title: 'Test Notification',
        message: '', // Empty message
      };

      const result = notificationSchema.safeParse(invalidNotification);
      expect(result.success).toBe(false);
    });

    it('should reject a notification without a title', () => {
      const invalidNotification = {
        message: 'Missing title',
      };

      const result = notificationSchema.safeParse(invalidNotification);
      expect(result.success).toBe(false);
    });

    it('should reject a notification without a message', () => {
      const invalidNotification = {
        title: 'Missing message',
      };

      const result = notificationSchema.safeParse(invalidNotification);
      expect(result.success).toBe(false);
    });

    it('should reject a notification with invalid field types', () => {
      const invalidNotification = {
        title: 'Test Notification',
        message: 'This is a test notification',
        user_id: 'not-a-number',
      };

      const result = notificationSchema.safeParse(invalidNotification);
      expect(result.success).toBe(false);
    });
  });
});
