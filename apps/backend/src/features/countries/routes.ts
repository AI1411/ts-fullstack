import { OpenAPIHono } from '@hono/zod-openapi';
import { createRoute } from '@hono/zod-openapi';
import { z } from '@hono/zod-openapi';
import {
  createCountry,
  deleteCountry,
  getCountries,
  getCountryById,
  updateCountry,
} from './controllers';

// OpenAPIHonoインスタンスを作成
const countryRoutes = new OpenAPIHono();

// OpenAPI用の国スキーマを定義
const countrySchema = z
  .object({
    name: z.string().min(1).openapi({
      description: '国名',
      example: '日本',
    }),
    code: z.string().optional().openapi({
      description: '国コード',
      example: 'JP',
    }),
    flag_url: z.string().optional().openapi({
      description: '国旗のURL',
      example: 'https://example.com/flags/jp.png',
    }),
  })
  .openapi('Country');

// レスポンス用の国スキーマ（IDを含む）
const countryResponseSchema = z
  .object({
    id: z.number().openapi({
      description: '国ID',
      example: 1,
    }),
    name: z.string().openapi({
      description: '国名',
      example: '日本',
    }),
    code: z.string().nullable().openapi({
      description: '国コード',
      example: 'JP',
    }),
    flag_url: z.string().nullable().openapi({
      description: '国旗のURL',
      example: 'https://example.com/flags/jp.png',
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
  .openapi('CountryResponse');

// 更新用の国スキーマ（すべてのフィールドがオプショナル）
const countryUpdateSchema = z
  .object({
    name: z.string().min(1).optional().openapi({
      description: '国名',
      example: '日本',
    }),
    code: z.string().optional().openapi({
      description: '国コード',
      example: 'JP',
    }),
    flag_url: z.string().optional().openapi({
      description: '国旗のURL',
      example: 'https://example.com/flags/jp.png',
    }),
  })
  .openapi('CountryUpdate');

// エラーレスポンススキーマ
const errorResponseSchema = z
  .object({
    error: z.string().openapi({
      description: 'エラーメッセージ',
      example: '入力が無効です',
    }),
  })
  .openapi('ErrorResponse');

// 国一覧取得ルート
const getCountriesRoute = createRoute({
  method: 'get',
  path: '/countries',
  tags: ['Countries'],
  summary: '国一覧を取得する',
  description: 'すべての国を取得します',
  responses: {
    200: {
      description: '国一覧',
      content: {
        'application/json': {
          schema: z.object({
            countries: z.array(countryResponseSchema),
          }),
        },
      },
    },
  },
});

// 国取得ルート
const getCountryByIdRoute = createRoute({
  method: 'get',
  path: '/countries/{id}',
  tags: ['Countries'],
  summary: '指定IDの国を取得する',
  description: '指定されたIDの国を取得します',
  request: {
    params: z.object({
      id: z.string().openapi({
        description: '国ID',
        example: '1',
      }),
    }),
  },
  responses: {
    200: {
      description: '国情報',
      content: {
        'application/json': {
          schema: z.object({
            country: countryResponseSchema,
          }),
        },
      },
    },
    404: {
      description: '国が見つかりません',
      content: {
        'application/json': {
          schema: errorResponseSchema,
        },
      },
    },
  },
});

// 国作成ルート
const createCountryRoute = createRoute({
  method: 'post',
  path: '/countries',
  tags: ['Countries'],
  summary: '新しい国を作成する',
  description: '新しい国を作成して保存します',
  request: {
    body: {
      content: {
        'application/json': {
          schema: countrySchema,
        },
      },
    },
  },
  responses: {
    201: {
      description: '作成された国',
      content: {
        'application/json': {
          schema: z.object({
            country: countryResponseSchema,
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

// 国更新ルート
const updateCountryRoute = createRoute({
  method: 'put',
  path: '/countries/{id}',
  tags: ['Countries'],
  summary: '国を更新する',
  description: '指定されたIDの国を更新します',
  request: {
    params: z.object({
      id: z.string().openapi({
        description: '国ID',
        example: '1',
      }),
    }),
    body: {
      content: {
        'application/json': {
          schema: countryUpdateSchema,
        },
      },
    },
  },
  responses: {
    200: {
      description: '更新された国',
      content: {
        'application/json': {
          schema: z.object({
            country: countryResponseSchema,
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
      description: '国が見つかりません',
      content: {
        'application/json': {
          schema: errorResponseSchema,
        },
      },
    },
  },
});

// 国削除ルート
const deleteCountryRoute = createRoute({
  method: 'delete',
  path: '/countries/{id}',
  tags: ['Countries'],
  summary: '国を削除する',
  description: '指定されたIDの国を削除します',
  request: {
    params: z.object({
      id: z.string().openapi({
        description: '国ID',
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
      description: '国が見つかりません',
      content: {
        'application/json': {
          schema: errorResponseSchema,
        },
      },
    },
  },
});

// ルートの実装
countryRoutes.openapi(getCountriesRoute, getCountries);
countryRoutes.openapi(getCountryByIdRoute, getCountryById);
countryRoutes.openapi(createCountryRoute, createCountry);
countryRoutes.openapi(updateCountryRoute, updateCountry);
countryRoutes.openapi(deleteCountryRoute, deleteCountry);

export default countryRoutes;
