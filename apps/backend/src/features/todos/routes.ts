import { Hono } from 'hono';
import { zValidator } from '@hono/zod-validator';
import { todoSchema } from './schemas';
import { createTodo, deleteTodo, getTodoById, getTodos, updateTodo } from './controllers';

const todoRoutes = new Hono();

// Todo作成
todoRoutes.post('/todos', zValidator('json', todoSchema, (result, c) => {
  if (!result.success) {
    return c.json({ error: result.error.issues[0].message }, 400);
  }
}), createTodo);

// Todo一覧取得
todoRoutes.get('/todos', getTodos);

// Todo取得
todoRoutes.get('/todos/:id', getTodoById);

// Todo更新
todoRoutes.put('/todos/:id', zValidator('json', todoSchema, (result, c) => {
  if (!result.success) {
    return c.json({ error: result.error.issues[0].message }, 400);
  }
}), updateTodo);

// Todo削除
todoRoutes.delete('/todos/:id', deleteTodo);

// 単一のTodo作成用エンドポイント（フロントエンドの互換性のため）
todoRoutes.post('/todo', zValidator('json', todoSchema, (result, c) => {
  if (!result.success) {
    return c.json({ error: result.error.issues[0].message }, 400);
  }
}), createTodo);

export default todoRoutes;
