import { eq } from 'drizzle-orm';
import type { Context } from 'hono';
import { getDB } from '../../common/utils/db';
import { notificationsTable } from '../../db/schema';

// 通知作成
export const createNotification = async (c: Context) => {
  const { user_id, title, message, is_read } = c.req.valid('json');
  const db = getDB(c);
  try {
    const notification = await db
      .insert(notificationsTable)
      .values({
        user_id,
        title,
        message,
        is_read: is_read || false,
      })
      .returning();
    return c.json({ notification: notification[0] });
  } catch (error: any) {
    return c.json({ error: error.message }, 500);
  }
};

// 通知一覧取得
export const getNotifications = async (c: Context) => {
  const db = getDB(c);
  try {
    const notifications = await db.select().from(notificationsTable);
    return c.json({ notifications });
  } catch (error: any) {
    return c.json({ error: error.message }, 500);
  }
};

// ユーザーIDによる通知取得
export const getNotificationsByUserId = async (c: Context) => {
  const userId = Number.parseInt(c.req.param('userId'));
  const db = getDB(c);
  try {
    const notifications = await db
      .select()
      .from(notificationsTable)
      .where(eq(notificationsTable.user_id, userId));
    return c.json({ notifications });
  } catch (error: any) {
    return c.json({ error: error.message }, 500);
  }
};

// 通知取得
export const getNotificationById = async (c: Context) => {
  const id = Number.parseInt(c.req.param('id'));
  const db = getDB(c);
  try {
    const notification = await db
      .select()
      .from(notificationsTable)
      .where(eq(notificationsTable.id, id));
    if (!notification.length) {
      return c.json({ error: 'Notification not found' }, 404);
    }
    return c.json({ notification: notification[0] });
  } catch (error: any) {
    return c.json({ error: error.message }, 500);
  }
};

// 通知更新
export const updateNotification = async (c: Context) => {
  const id = Number.parseInt(c.req.param('id'));
  const { user_id, title, message, is_read } = c.req.valid('json');
  const db = getDB(c);
  try {
    const updatedNotification = await db
      .update(notificationsTable)
      .set({
        user_id,
        title,
        message,
        is_read,
        updated_at: new Date(),
      })
      .where(eq(notificationsTable.id, id))
      .returning();
    if (!updatedNotification.length) {
      return c.json({ error: 'Notification not found' }, 404);
    }
    return c.json({ notification: updatedNotification[0] });
  } catch (error: any) {
    return c.json({ error: error.message }, 500);
  }
};

// 通知削除
export const deleteNotification = async (c: Context) => {
  const id = Number.parseInt(c.req.param('id'));
  const db = getDB(c);
  try {
    const deletedNotification = await db
      .delete(notificationsTable)
      .where(eq(notificationsTable.id, id))
      .returning();
    if (!deletedNotification.length) {
      return c.json({ error: 'Notification not found' }, 404);
    }
    return c.json({ message: 'Notification deleted successfully' });
  } catch (error: any) {
    return c.json({ error: error.message }, 500);
  }
};
