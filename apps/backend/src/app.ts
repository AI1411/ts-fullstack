import { Hono } from 'hono';
import { cors } from 'hono/cors';

import baseRoutes from './features/base/routes';
import userRoutes from './features/users/routes';
import todoRoutes from './features/todos/routes';
import teamRoutes from './features/teams/routes';
import taskRoutes from './features/tasks/routes';
import notificationRoutes from './features/notifications/routes';
import subTaskRoutes from './features/sub-tasks/routes';

export type Env = {
  DATABASE_URL: string;
};

const app = new Hono<{ Bindings: Env }>();

// CORSミドルウェアを適用
app.use('*', cors({
  origin: '*'
}));

// すべてのルートを結合
const route = app
  .route('/', baseRoutes)
  .route('/', userRoutes)
  .route('/', todoRoutes)
  .route('/', teamRoutes)
  .route('/', taskRoutes)
  .route('/', notificationRoutes)
  .route('/', subTaskRoutes);

export type AppType = typeof route;

export default app;
