import { Hono } from 'hono';
import { zValidator } from '@hono/zod-validator';
import { subTaskSchema } from './schemas';
import { 
  createSubTask, 
  deleteSubTask, 
  getSubTaskById, 
  getSubTasks, 
  getSubTasksByTaskId, 
  updateSubTask 
} from './controllers';

const subTaskRoutes = new Hono();

// サブタスク作成
subTaskRoutes.post('/sub-tasks', zValidator('json', subTaskSchema, (result, c) => {
  if (!result.success) {
    return c.json({ error: result.error.issues[0].message }, 400);
  }
}), createSubTask);

// サブタスク一覧取得
subTaskRoutes.get('/sub-tasks', getSubTasks);

// タスクIDによるサブタスク取得
subTaskRoutes.get('/tasks/:taskId/sub-tasks', getSubTasksByTaskId);

// サブタスク取得
subTaskRoutes.get('/sub-tasks/:id', getSubTaskById);

// サブタスク更新
subTaskRoutes.put('/sub-tasks/:id', zValidator('json', subTaskSchema, (result, c) => {
  if (!result.success) {
    return c.json({ error: result.error.issues[0].message }, 400);
  }
}), updateSubTask);

// サブタスク削除
subTaskRoutes.delete('/sub-tasks/:id', deleteSubTask);

export default subTaskRoutes;
