import { OpenAPIHono } from '@hono/zod-openapi';
import { createRoute } from '@hono/zod-openapi';
import { z } from '@hono/zod-openapi';
import { createInquiry, getInquiries, getInquiryById } from './controllers';

// OpenAPIHonoインスタンスを作成
const inquiryRoutes = new OpenAPIHono();

// OpenAPI用のお問い合わせスキーマを定義
const inquirySchema = z
  .object({
    name: z.string().min(1).openapi({
      description: 'お名前',
      example: '山田太郎',
    }),
    email: z.string().email().openapi({
      description: 'メールアドレス',
      example: 'example@example.com',
    }),
    subject: z.string().min(1).openapi({
      description: '件名',
      example: '商品について',
    }),
    message: z.string().min(1).openapi({
      description: 'メッセージ',
      example: '商品の詳細について質問があります。',
    }),
  })
  .openapi('Inquiry');

// レスポンス用のお問い合わせスキーマ（IDを含む）
const inquiryResponseSchema = z
  .object({
    id: z.number().openapi({
      description: 'お問い合わせID',
      example: 1,
    }),
    name: z.string().openapi({
      description: 'お名前',
      example: '山田太郎',
    }),
    email: z.string().openapi({
      description: 'メールアドレス',
      example: 'example@example.com',
    }),
    subject: z.string().openapi({
      description: '件名',
      example: '商品について',
    }),
    message: z.string().openapi({
      description: 'メッセージ',
      example: '商品の詳細について質問があります。',
    }),
    status: z.string().openapi({
      description: 'ステータス',
      example: 'PENDING',
    }),
    created_at: z.string().openapi({
      description: '作成日時',
      example: '2023-01-01T00:00:00Z',
    }),
    updated_at: z.string().openapi({
      description: '更新日時',
      example: '2023-01-01T00:00:00Z',
    }),
  })
  .openapi('InquiryResponse');

// エラーレスポンススキーマ
const errorResponseSchema = z
  .object({
    error: z.string().openapi({
      description: 'エラーメッセージ',
      example: '入力が無効です',
    }),
  })
  .openapi('ErrorResponse');

// お問い合わせ送信ルート
const createInquiryRoute = createRoute({
  method: 'post',
  path: '/inquiries',
  tags: ['Inquiries'],
  summary: 'お問い合わせを送信する',
  description: 'ユーザーからのお問い合わせを送信します',
  request: {
    body: {
      content: {
        'application/json': {
          schema: inquirySchema,
        },
      },
    },
  },
  responses: {
    201: {
      description: '送信されたお問い合わせ',
      content: {
        'application/json': {
          schema: z.object({
            inquiry: inquiryResponseSchema,
          }),
        },
      },
    },
    400: {
      description: 'バリデーションエラー',
      content: {
        'application/json': {
          schema: errorResponseSchema,
        },
      },
    },
  },
});

// 管理者用: お問い合わせ一覧取得ルート
const getInquiriesRoute = createRoute({
  method: 'get',
  path: '/admin/inquiries',
  tags: ['Admin', 'Inquiries'],
  summary: 'お問い合わせ一覧を取得する',
  description: '管理者用: すべてのお問い合わせを取得します',
  responses: {
    200: {
      description: 'お問い合わせ一覧',
      content: {
        'application/json': {
          schema: z.object({
            inquiries: z.array(inquiryResponseSchema),
          }),
        },
      },
    },
  },
});

// 管理者用: お問い合わせ詳細取得ルート
const getInquiryByIdRoute = createRoute({
  method: 'get',
  path: '/admin/inquiries/{id}',
  tags: ['Admin', 'Inquiries'],
  summary: '指定IDのお問い合わせを取得する',
  description: '管理者用: 指定されたIDのお問い合わせを取得します',
  request: {
    params: z.object({
      id: z.string().openapi({
        description: 'お問い合わせID',
        example: '1',
      }),
    }),
  },
  responses: {
    200: {
      description: 'お問い合わせ情報',
      content: {
        'application/json': {
          schema: z.object({
            inquiry: inquiryResponseSchema,
          }),
        },
      },
    },
    404: {
      description: 'お問い合わせが見つかりません',
      content: {
        'application/json': {
          schema: errorResponseSchema,
        },
      },
    },
  },
});

// ルートの実装
inquiryRoutes.openapi(createInquiryRoute, createInquiry);
inquiryRoutes.openapi(getInquiriesRoute, getInquiries);
inquiryRoutes.openapi(getInquiryByIdRoute, getInquiryById);

export default inquiryRoutes;
