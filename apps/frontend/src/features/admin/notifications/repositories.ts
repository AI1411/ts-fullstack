// Notification repositories
import {client} from '@/common/utils/client';
import {CreateNotificationInput} from './controllers';

// Notification repository
export const notificationRepository = {
  // Get all notifications
  getNotifications: async () => {
    return client.notifications.$get();
  },

  // Create a new notification
  createNotification: async (notificationData: CreateNotificationInput) => {
    return client.notifications.$post({
      json: notificationData,
    });
  },

  // Get a notification by ID
  getNotificationById: async (id: number) => {
    return client.notifications[':id'].$get({
      param: {id: id.toString()}
    });
  },

  // Update a notification
  updateNotification: async (id: number, notificationData: Partial<CreateNotificationInput>) => {
    return client.notifications[':id'].$put({
      param: {id: id.toString()},
      json: notificationData
    });
  },

  // Delete a notification
  deleteNotification: async (id: number) => {
    return client.notifications[':id'].$delete({
      param: {id: id.toString()}
    });
  }
};
