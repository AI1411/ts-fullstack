// Notification services
import {
  type CreateNotificationInput,
  type Notification,
  createNotification as createNotificationController,
  deleteNotification as deleteNotificationController,
  getNotificationById as getNotificationByIdController,
  getNotifications as getNotificationsController,
  toggleNotificationReadStatus as toggleNotificationReadStatusController,
  updateNotification as updateNotificationController,
} from './controllers';

// Notification service
export const notificationService = {
  // Get all notifications
  getNotifications: async (): Promise<Notification[]> => {
    return getNotificationsController();
  },

  // Create a new notification
  createNotification: async (
    notificationData: CreateNotificationInput
  ): Promise<Notification> => {
    return createNotificationController(notificationData);
  },

  // Get a notification by ID
  getNotificationById: async (id: number): Promise<Notification> => {
    return getNotificationByIdController(id);
  },

  // Update a notification
  updateNotification: async (
    id: number,
    notificationData: Partial<CreateNotificationInput>
  ): Promise<Notification> => {
    return updateNotificationController(id, notificationData);
  },

  // Delete a notification
  deleteNotification: async (id: number): Promise<void> => {
    return deleteNotificationController(id);
  },

  // Toggle notification read status
  toggleNotificationReadStatus: async (
    id: number,
    isRead: boolean
  ): Promise<Notification> => {
    return toggleNotificationReadStatusController(id, isRead);
  },

  // Get unread notifications
  getUnreadNotifications: async (): Promise<Notification[]> => {
    const notifications = await getNotificationsController();
    return notifications.filter((notification) => !notification.is_read);
  },

  // Get read notifications
  getReadNotifications: async (): Promise<Notification[]> => {
    const notifications = await getNotificationsController();
    return notifications.filter((notification) => notification.is_read);
  },
};
