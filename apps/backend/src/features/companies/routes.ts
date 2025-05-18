import { OpenAPIHono } from '@hono/zod-openapi';
import { createRoute } from '@hono/zod-openapi';
import { z } from '@hono/zod-openapi';
import {
  createCompany,
  deleteCompany,
  getCompanies,
  getCompanyById,
  updateCompany,
} from './controllers';

// OpenAPIHonoインスタンスを作成
const companyRoutes = new OpenAPIHono();

// OpenAPI用の会社スキーマを定義
const companySchema = z
  .object({
    name: z.string().min(1).openapi({
      description: '会社名',
      example: 'テクノロジー株式会社',
    }),
    description: z.string().optional().openapi({
      description: '会社説明',
      example: 'ITソリューションを提供する会社です。',
    }),
    address: z.string().optional().openapi({
      description: '住所',
      example: '東京都渋谷区1-1-1',
    }),
    phone: z.string().optional().openapi({
      description: '電話番号',
      example: '03-1234-5678',
    }),
    email: z.string().email().optional().openapi({
      description: 'メールアドレス',
      example: 'info@example.com',
    }),
    website: z.string().optional().openapi({
      description: 'ウェブサイト',
      example: 'https://example.com',
    }),
  })
  .openapi('Company');

// レスポンス用の会社スキーマ（IDを含む）
const companyResponseSchema = z
  .object({
    id: z.number().openapi({
      description: '会社ID',
      example: 1,
    }),
    name: z.string().openapi({
      description: '会社名',
      example: 'テクノロジー株式会社',
    }),
    description: z.string().nullable().openapi({
      description: '会社説明',
      example: 'ITソリューションを提供する会社です。',
    }),
    address: z.string().nullable().openapi({
      description: '住所',
      example: '東京都渋谷区1-1-1',
    }),
    phone: z.string().nullable().openapi({
      description: '電話番号',
      example: '03-1234-5678',
    }),
    email: z.string().nullable().openapi({
      description: 'メールアドレス',
      example: 'info@example.com',
    }),
    website: z.string().nullable().openapi({
      description: 'ウェブサイト',
      example: 'https://example.com',
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
  .openapi('CompanyResponse');

// 更新用の会社スキーマ（すべてのフィールドがオプショナル）
const companyUpdateSchema = z
  .object({
    name: z.string().min(1).optional().openapi({
      description: '会社名',
      example: 'テクノロジー株式会社',
    }),
    description: z.string().optional().openapi({
      description: '会社説明',
      example: 'ITソリューションを提供する会社です。',
    }),
    address: z.string().optional().openapi({
      description: '住所',
      example: '東京都渋谷区1-1-1',
    }),
    phone: z.string().optional().openapi({
      description: '電話番号',
      example: '03-1234-5678',
    }),
    email: z.string().email().optional().openapi({
      description: 'メールアドレス',
      example: 'info@example.com',
    }),
    website: z.string().optional().openapi({
      description: 'ウェブサイト',
      example: 'https://example.com',
    }),
  })
  .openapi('CompanyUpdate');

// エラーレスポンススキーマ
const errorResponseSchema = z
  .object({
    error: z.string().openapi({
      description: 'エラーメッセージ',
      example: '入力が無効です',
    }),
  })
  .openapi('ErrorResponse');

// 会社一覧取得ルート
const getCompaniesRoute = createRoute({
  method: 'get',
  path: '/companies',
  tags: ['Companies'],
  summary: '会社一覧を取得する',
  description: 'すべての会社を取得します',
  responses: {
    200: {
      description: '会社一覧',
      content: {
        'application/json': {
          schema: z.object({
            companies: z.array(companyResponseSchema),
          }),
        },
      },
    },
  },
});

// 会社取得ルート
const getCompanyByIdRoute = createRoute({
  method: 'get',
  path: '/companies/{id}',
  tags: ['Companies'],
  summary: '指定IDの会社を取得する',
  description: '指定されたIDの会社を取得します',
  request: {
    params: z.object({
      id: z.string().openapi({
        description: '会社ID',
        example: '1',
      }),
    }),
  },
  responses: {
    200: {
      description: '会社情報',
      content: {
        'application/json': {
          schema: z.object({
            company: companyResponseSchema,
          }),
        },
      },
    },
    404: {
      description: '会社が見つかりません',
      content: {
        'application/json': {
          schema: errorResponseSchema,
        },
      },
    },
  },
});

// 会社作成ルート
const createCompanyRoute = createRoute({
  method: 'post',
  path: '/companies',
  tags: ['Companies'],
  summary: '新しい会社を作成する',
  description: '新しい会社を作成して保存します',
  request: {
    body: {
      content: {
        'application/json': {
          schema: companySchema,
        },
      },
    },
  },
  responses: {
    201: {
      description: '作成された会社',
      content: {
        'application/json': {
          schema: z.object({
            company: companyResponseSchema,
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

// 会社更新ルート
const updateCompanyRoute = createRoute({
  method: 'put',
  path: '/companies/{id}',
  tags: ['Companies'],
  summary: '会社を更新する',
  description: '指定されたIDの会社を更新します',
  request: {
    params: z.object({
      id: z.string().openapi({
        description: '会社ID',
        example: '1',
      }),
    }),
    body: {
      content: {
        'application/json': {
          schema: companyUpdateSchema,
        },
      },
    },
  },
  responses: {
    200: {
      description: '更新された会社',
      content: {
        'application/json': {
          schema: z.object({
            company: companyResponseSchema,
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
    404: {
      description: '会社が見つかりません',
      content: {
        'application/json': {
          schema: errorResponseSchema,
        },
      },
    },
  },
});

// 会社削除ルート
const deleteCompanyRoute = createRoute({
  method: 'delete',
  path: '/companies/{id}',
  tags: ['Companies'],
  summary: '会社を削除する',
  description: '指定されたIDの会社を削除します',
  request: {
    params: z.object({
      id: z.string().openapi({
        description: '会社ID',
        example: '1',
      }),
    }),
  },
  responses: {
    200: {
      description: '削除成功',
      content: {
        'application/json': {
          schema: z.object({
            success: z.boolean(),
            message: z.string(),
          }),
        },
      },
    },
    404: {
      description: '会社が見つかりません',
      content: {
        'application/json': {
          schema: errorResponseSchema,
        },
      },
    },
  },
});

// ルートの実装
companyRoutes.openapi(getCompaniesRoute, getCompanies);
companyRoutes.openapi(getCompanyByIdRoute, getCompanyById);
companyRoutes.openapi(createCompanyRoute, createCompany);
companyRoutes.openapi(updateCompanyRoute, updateCompany);
companyRoutes.openapi(deleteCompanyRoute, deleteCompany);

export default companyRoutes;
