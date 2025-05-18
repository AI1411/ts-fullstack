import { OpenAPIHono } from '@hono/zod-openapi';
import { createRoute } from '@hono/zod-openapi';
import { z } from '@hono/zod-openapi';

const baseRoutes = new OpenAPIHono();

// レスポーススキーマの定義
const messageResponseSchema = z
  .object({
    message: z.string().openapi({
      description: 'レスポンスメッセージ',
      example: 'API is running',
    }),
  })
  .openapi('MessageResponse');

// ヘルスチェックルート
const healthCheckRoute = createRoute({
  method: 'get',
  path: '/',
  tags: ['Base'],
  summary: 'APIヘルスチェック',
  description: 'APIが正常に動作しているかを確認します',
  responses: {
    200: {
      description: '正常なレスポンス',
      content: {
        'application/json': {
          schema: messageResponseSchema,
        },
      },
    },
  },
});

// Helloルート
const helloRoute = createRoute({
  method: 'get',
  path: '/hello',
  tags: ['Base'],
  summary: 'Hello APIエンドポイント',
  description: 'テスト用のHelloエンドポイント',
  responses: {
    200: {
      description: '正常なレスポンス',
      content: {
        'application/json': {
          schema: messageResponseSchema,
        },
      },
    },
  },
});

// ルートの実装
baseRoutes.openapi(healthCheckRoute, (c) => {
  return c.json({ message: 'API is running' });
});

baseRoutes.openapi(helloRoute, (c) => {
  return c.json({ message: 'Hello Hono!' });
});

export default baseRoutes;
