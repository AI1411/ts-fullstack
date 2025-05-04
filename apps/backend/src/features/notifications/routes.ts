import { Hono } from 'hono';
import { zValidator } from '@hono/zod-validator';
import { notificationSchema } from './schemas';
import { 
  createNotification, 
  deleteNotification, 
  getNotificationById, 
  getNotifications, 
  getNotificationsByUserId, 
  updateNotification 
} from './controllers';

const notificationRoutes = new Hono();

// 通知作成
notificationRoutes.post('/notifications', zValidator('json', notificationSchema, (result, c) => {
  if (!result.success) {
    return c.json({ error: result.error.issues[0].message }, 400);
  }
}), createNotification);

// 通知一覧取得
notificationRoutes.get('/notifications', getNotifications);

// ユーザーIDによる通知取得
notificationRoutes.get('/users/:userId/notifications', getNotificationsByUserId);

// 通知取得
notificationRoutes.get('/notifications/:id', getNotificationById);

// 通知更新
notificationRoutes.put('/notifications/:id', zValidator('json', notificationSchema, (result, c) => {
  if (!result.success) {
    return c.json({ error: result.error.issues[0].message }, 400);
  }
}), updateNotification);

// 通知削除
notificationRoutes.delete('/notifications/:id', deleteNotification);

export default notificationRoutes;
