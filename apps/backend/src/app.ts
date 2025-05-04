import { OpenAPIHono } from '@hono/zod-openapi'
import { swaggerUI } from '@hono/swagger-ui'

import baseRoutes from './features/base/routes';
import userRoutes from './features/users/routes';
import todoRoutes from './features/todos/routes';
import teamRoutes from './features/teams/routes';
import taskRoutes from './features/tasks/routes';
import notificationRoutes from './features/notifications/routes';
import subTaskRoutes from './features/sub-tasks/routes';
import { cors } from 'hono/cors';

export type Env = {
  DATABASE_URL: string;
};

// OpenAPI情報の定義
const openApiInfo = {
  title: 'APIタイトル',
  version: 'v1',
  description: 'APIの説明'
}

// app定義をOpenAPIHonoに変更
const app = new OpenAPIHono<{ Bindings: Env }>()

// OpenAPI定義を/docエンドポイントで提供
app.doc('/doc', {
  openapi: '3.0.0',
  info: openApiInfo,
  servers: [{ url: '/' }]
})

// Swagger UIの提供
app.get('/ui', swaggerUI({ url: '/doc' }))

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