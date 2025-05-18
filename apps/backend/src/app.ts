import { swaggerUI } from '@hono/swagger-ui';
import { OpenAPIHono } from '@hono/zod-openapi';

import { cors } from 'hono/cors';
import baseRoutes from './features/base/routes';
import baseballGameStatRoutes from './features/baseball-game-stats/routes';
import baseballInjuryRoutes from './features/baseball-injuries/routes';
import baseballPlayerMediaRoutes from './features/baseball-player-media/routes';
import baseballPlayerRoutes from './features/baseball-players/routes';
import baseballTeamRoutes from './features/baseball-teams/routes';
import categoryRoutes from './features/categories/routes';
import chatRoutes from './features/chats/routes';
import companyRoutes from './features/companies/routes';
import contactRoutes from './features/contacts/routes';
import countryRoutes from './features/countries/routes';
import inquiryRoutes from './features/inquiries/routes';
import invoiceRoutes from './features/invoices/routes';
import notificationRoutes from './features/notifications/routes';
import orderRoutes from './features/orders/routes';
import productRoutes from './features/products/routes';
import subTaskRoutes from './features/sub-tasks/routes';
import taskRoutes from './features/tasks/routes';
import teamRoutes from './features/teams/routes';
import todoRoutes from './features/todos/routes';
import userRoutes from './features/users/routes';

export type Env = {
  DATABASE_URL: string;
};

// OpenAPI情報の定義
const openApiInfo = {
  title: 'APIタイトル',
  version: 'v1',
  description: 'APIの説明',
};

// app定義をOpenAPIHonoに変更
const app = new OpenAPIHono<{ Bindings: Env }>();

// OpenAPI定義を/docエンドポイントで提供
app.doc('/doc', {
  openapi: '3.0.0',
  info: openApiInfo,
  servers: [{ url: '/' }],
});

// Swagger UIの提供
app.get('/ui', swaggerUI({ url: '/doc' }));

// CORSミドルウェアを適用
app.use(
  '*',
  cors({
    origin: '*',
  })
);

// すべてのルートを結合
const route = app
  .route('/', baseRoutes)
  .route('/', userRoutes)
  .route('/', todoRoutes)
  .route('/', teamRoutes)
  .route('/', taskRoutes)
  .route('/', notificationRoutes)
  .route('/', subTaskRoutes)
  .route('/', chatRoutes)
  .route('/', productRoutes)
  .route('/', orderRoutes)
  .route('/', categoryRoutes)
  .route('/', inquiryRoutes)
  .route('/', companyRoutes)
  .route('/', countryRoutes)
  .route('/', invoiceRoutes)
  .route('/', contactRoutes)
  .route('/', baseballPlayerRoutes)
  .route('/', baseballGameStatRoutes)
  .route('/', baseballTeamRoutes)
  .route('/', baseballInjuryRoutes)
  .route('/', baseballPlayerMediaRoutes);

export type AppType = typeof route;

export default app;
