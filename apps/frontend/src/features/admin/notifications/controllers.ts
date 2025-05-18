// Notification controllers
import { notificationRepository } from './repositories';

// Types
export interface Notification {
  id: number;
  user_id: number | null;
  title: string;
  message: string;
  is_read: boolean;
  created_at: string;
}

export interface CreateNotificationInput {
  title: string;
  message: string;
  user_id?: number | null;
  is_read?: boolean;
}

// Get all notifications
export const getNotifications = async (): Promise<Notification[]> => {
  try {
    const response = await notificationRepository.getNotifications();
    const { notifications } = await response.json();
    return notifications;
  } catch (error) {
    console.error('Error fetching notifications:', error);
    throw error;
  }
};

// Create a new notification
export const createNotification = async (
  notificationData: CreateNotificationInput
): Promise<Notification> => {
  try {
    const response =
      await notificationRepository.createNotification(notificationData);
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(errorText);
    }
    const { notification } = await response.json();
    return notification;
  } catch (error) {
    console.error('Error creating notification:', error);
    throw error;
  }
};

// Get a notification by ID
export const getNotificationById = async (
  id: number
): Promise<Notification> => {
  try {
    const response = await notificationRepository.getNotificationById(id);
    if (!response.ok) {
      throw new Error('Notification not found');
    }
    const { notification } = await response.json();
    return notification;
  } catch (error) {
    console.error(`Error fetching notification ${id}:`, error);
    throw error;
  }
};

// Update a notification
export const updateNotification = async (
  id: number,
  notificationData: Partial<CreateNotificationInput>
): Promise<Notification> => {
  try {
    const response = await notificationRepository.updateNotification(
      id,
      notificationData
    );
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(errorText);
    }
    const { notification } = await response.json();
    return notification;
  } catch (error) {
    console.error(`Error updating notification ${id}:`, error);
    throw error;
  }
};

// Delete a notification
export const deleteNotification = async (id: number): Promise<void> => {
  try {
    const response = await notificationRepository.deleteNotification(id);
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(errorText);
    }
  } catch (error) {
    console.error(`Error deleting notification ${id}:`, error);
    throw error;
  }
};

// Toggle notification read status
export const toggleNotificationReadStatus = async (
  id: number,
  isRead: boolean
): Promise<Notification> => {
  try {
    const response = await notificationRepository.updateNotification(id, {
      is_read: isRead,
    });
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(errorText);
    }
    const { notification } = await response.json();
    return notification;
  } catch (error) {
    console.error(`Error toggling notification read status ${id}:`, error);
    throw error;
  }
};
