import { OpenAPIHono } from '@hono/zod-openapi';
import { createRoute } from '@hono/zod-openapi';
import { z } from '@hono/zod-openapi';
import {
  createBaseballInjury,
  deleteBaseballInjury,
  getActiveBaseballInjuries,
  getBaseballInjuries,
  getBaseballInjuriesByPlayerId,
  getBaseballInjuryById,
  updateBaseballInjury,
} from './controllers';
import {
  baseballInjuryResponseSchema,
  baseballInjurySchema,
  baseballInjuryUpdateSchema,
  errorResponseSchema,
} from './schemas';

// OpenAPIHonoインスタンスを作成
const baseballInjuryRoutes = new OpenAPIHono();

// 怪我記録一覧取得ルート
const getBaseballInjuriesRoute = createRoute({
  method: 'get',
  path: '/baseball-injuries',
  tags: ['BaseballInjuries'],
  summary: '野球選手の怪我記録一覧を取得する',
  description: 'すべての野球選手の怪我記録を取得します',
  responses: {
    200: {
      description: '怪我記録一覧',
      content: {
        'application/json': {
          schema: z.object({
            injuries: z.array(baseballInjuryResponseSchema),
          }),
        },
      },
    },
  },
});

// アクティブな怪我記録一覧取得ルート
const getActiveBaseballInjuriesRoute = createRoute({
  method: 'get',
  path: '/baseball-injuries/active',
  tags: ['BaseballInjuries'],
  summary: '現在療養中の野球選手の怪我記録一覧を取得する',
  description:
    '現在療養中（ステータスがACTIVE）の野球選手の怪我記録を取得します',
  responses: {
    200: {
      description: 'アクティブな怪我記録一覧',
      content: {
        'application/json': {
          schema: z.object({
            injuries: z.array(baseballInjuryResponseSchema),
          }),
        },
      },
    },
  },
});

// 特定の選手の怪我記録一覧取得ルート
const getBaseballInjuriesByPlayerIdRoute = createRoute({
  method: 'get',
  path: '/baseball-players/{playerId}/injuries',
  tags: ['BaseballInjuries'],
  summary: '特定の選手の怪我記録一覧を取得する',
  description: '指定された選手IDの怪我記録をすべて取得します',
  request: {
    params: z.object({
      playerId: z.string().openapi({
        description: '選手ID',
        example: '1',
      }),
    }),
  },
  responses: {
    200: {
      description: '選手の怪我記録一覧',
      content: {
        'application/json': {
          schema: z.object({
            injuries: z.array(baseballInjuryResponseSchema),
          }),
        },
      },
    },
    404: {
      description: '選手が見つかりません',
      content: {
        'application/json': {
          schema: errorResponseSchema,
        },
      },
    },
  },
});

// 怪我記録取得ルート
const getBaseballInjuryByIdRoute = createRoute({
  method: 'get',
  path: '/baseball-injuries/{id}',
  tags: ['BaseballInjuries'],
  summary: '指定IDの怪我記録を取得する',
  description: '指定されたIDの怪我記録を取得します',
  request: {
    params: z.object({
      id: z.string().openapi({
        description: '怪我記録ID',
        example: '1',
      }),
    }),
  },
  responses: {
    200: {
      description: '怪我記録情報',
      content: {
        'application/json': {
          schema: z.object({
            injury: baseballInjuryResponseSchema,
          }),
        },
      },
    },
    404: {
      description: '怪我記録が見つかりません',
      content: {
        'application/json': {
          schema: errorResponseSchema,
        },
      },
    },
  },
});

// 怪我記録作成ルート
const createBaseballInjuryRoute = createRoute({
  method: 'post',
  path: '/baseball-injuries',
  tags: ['BaseballInjuries'],
  summary: '新しい怪我記録を作成する',
  description: '新しい怪我記録を作成して保存します',
  request: {
    body: {
      content: {
        'application/json': {
          schema: baseballInjurySchema,
        },
      },
    },
  },
  responses: {
    201: {
      description: '作成された怪我記録',
      content: {
        'application/json': {
          schema: z.object({
            injury: baseballInjuryResponseSchema,
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
      description: '選手が見つかりません',
      content: {
        'application/json': {
          schema: errorResponseSchema,
        },
      },
    },
  },
});

// 怪我記録更新ルート
const updateBaseballInjuryRoute = createRoute({
  method: 'put',
  path: '/baseball-injuries/{id}',
  tags: ['BaseballInjuries'],
  summary: '怪我記録を更新する',
  description: '指定されたIDの怪我記録を更新します',
  request: {
    params: z.object({
      id: z.string().openapi({
        description: '怪我記録ID',
        example: '1',
      }),
    }),
    body: {
      content: {
        'application/json': {
          schema: baseballInjuryUpdateSchema,
        },
      },
    },
  },
  responses: {
    200: {
      description: '更新された怪我記録',
      content: {
        'application/json': {
          schema: z.object({
            injury: baseballInjuryResponseSchema,
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
      description: '怪我記録または選手が見つかりません',
      content: {
        'application/json': {
          schema: errorResponseSchema,
        },
      },
    },
  },
});

// 怪我記録削除ルート
const deleteBaseballInjuryRoute = createRoute({
  method: 'delete',
  path: '/baseball-injuries/{id}',
  tags: ['BaseballInjuries'],
  summary: '怪我記録を削除する',
  description: '指定されたIDの怪我記録を削除します',
  request: {
    params: z.object({
      id: z.string().openapi({
        description: '怪我記録ID',
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
      description: '怪我記録が見つかりません',
      content: {
        'application/json': {
          schema: errorResponseSchema,
        },
      },
    },
  },
});

// ルートの実装
baseballInjuryRoutes.openapi(getBaseballInjuriesRoute, getBaseballInjuries);
baseballInjuryRoutes.openapi(
  getActiveBaseballInjuriesRoute,
  getActiveBaseballInjuries
);
baseballInjuryRoutes.openapi(
  getBaseballInjuriesByPlayerIdRoute,
  getBaseballInjuriesByPlayerId
);
baseballInjuryRoutes.openapi(getBaseballInjuryByIdRoute, getBaseballInjuryById);
baseballInjuryRoutes.openapi(createBaseballInjuryRoute, createBaseballInjury);
baseballInjuryRoutes.openapi(updateBaseballInjuryRoute, updateBaseballInjury);
baseballInjuryRoutes.openapi(deleteBaseballInjuryRoute, deleteBaseballInjury);

export default baseballInjuryRoutes;
