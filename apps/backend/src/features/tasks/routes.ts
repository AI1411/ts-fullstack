import { Hono } from 'hono';
import { zValidator } from '@hono/zod-validator';
import { taskSchema } from './schemas';
import { 
  createTask, 
  deleteTask, 
  getTaskById, 
  getTasks, 
  getTasksByTeamId, 
  getTasksByUserId, 
  updateTask 
} from './controllers';

const taskRoutes = new Hono();

// タスク作成
taskRoutes.post('/tasks', zValidator('json', taskSchema, (result, c) => {
  if (!result.success) {
    return c.json({ error: result.error.issues[0].message }, 400);
  }
}), createTask);

// タスク一覧取得
taskRoutes.get('/tasks', getTasks);

// ユーザーIDによるタスク取得
taskRoutes.get('/users/:userId/tasks', getTasksByUserId);

// チームIDによるタスク取得
taskRoutes.get('/teams/:teamId/tasks', getTasksByTeamId);

// タスク取得
taskRoutes.get('/tasks/:id', getTaskById);

// タスク更新
taskRoutes.put('/tasks/:id', zValidator('json', taskSchema, (result, c) => {
  if (!result.success) {
    return c.json({ error: result.error.issues[0].message }, 400);
  }
}), updateTask);

// タスク削除
taskRoutes.delete('/tasks/:id', deleteTask);

export default taskRoutes;
