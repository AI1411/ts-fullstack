import { Hono } from 'hono';
import { zValidator } from '@hono/zod-validator';
import { userSchema } from './schemas';
import { createUser, deleteUser, getUserById, getUsers, updateUser } from './controllers';

const userRoutes = new Hono();

// ユーザー作成
userRoutes.post('/users', zValidator('json', userSchema, (result, c) => {
  if (!result.success) {
    return c.json({ error: result.error.issues[0].message }, 400);
  }
}), createUser);

// ユーザー一覧取得
userRoutes.get('/users', getUsers);

// ユーザー取得
userRoutes.get('/users/:id', getUserById);

// ユーザー更新
userRoutes.put('/users/:id', zValidator('json', userSchema, (result, c) => {
  if (!result.success) {
    return c.json({ error: result.error.issues[0].message }, 400);
  }
}), updateUser);

// ユーザー削除
userRoutes.delete('/users/:id', deleteUser);

export default userRoutes;
