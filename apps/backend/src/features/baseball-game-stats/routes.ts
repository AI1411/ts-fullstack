import { OpenAPIHono } from '@hono/zod-openapi';
import { createRoute } from '@hono/zod-openapi';
import { z } from '@hono/zod-openapi';
import {
  createBaseballGameStat,
  deleteBaseballGameStat,
  getBaseballGameStatById,
  getBaseballGameStats,
  getBaseballGameStatsByPlayerId,
  updateBaseballGameStat,
} from './controllers';
import {
  baseballGameStatResponseSchema,
  baseballGameStatSchema,
  baseballGameStatUpdateSchema,
  errorResponseSchema,
} from './schemas';

// OpenAPIHonoインスタンスを作成
const baseballGameStatRoutes = new OpenAPIHono();

// 試合統計一覧取得ルート
const getBaseballGameStatsRoute = createRoute({
  method: 'get',
  path: '/baseball-game-stats',
  tags: ['BaseballGameStats'],
  summary: '野球選手の試合統計一覧を取得する',
  description: 'すべての野球選手の試合統計を取得します',
  responses: {
    200: {
      description: '試合統計一覧',
      content: {
        'application/json': {
          schema: z.object({
            stats: z.array(baseballGameStatResponseSchema),
          }),
        },
      },
    },
  },
});

// 特定の選手の試合統計一覧取得ルート
const getBaseballGameStatsByPlayerIdRoute = createRoute({
  method: 'get',
  path: '/baseball-players/{playerId}/game-stats',
  tags: ['BaseballGameStats'],
  summary: '特定の選手の試合統計一覧を取得する',
  description: '指定された選手IDの試合統計をすべて取得します',
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
      description: '選手の試合統計一覧',
      content: {
        'application/json': {
          schema: z.object({
            stats: z.array(baseballGameStatResponseSchema),
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

// 特定の試合統計取得ルート
const getBaseballGameStatByIdRoute = createRoute({
  method: 'get',
  path: '/baseball-game-stats/{id}',
  tags: ['BaseballGameStats'],
  summary: '指定IDの試合統計を取得する',
  description: '指定されたIDの試合統計を取得します',
  request: {
    params: z.object({
      id: z.string().openapi({
        description: '試合統計ID',
        example: '1',
      }),
    }),
  },
  responses: {
    200: {
      description: '試合統計情報',
      content: {
        'application/json': {
          schema: z.object({
            stat: baseballGameStatResponseSchema,
          }),
        },
      },
    },
    404: {
      description: '試合統計が見つかりません',
      content: {
        'application/json': {
          schema: errorResponseSchema,
        },
      },
    },
  },
});

// 試合統計作成ルート
const createBaseballGameStatRoute = createRoute({
  method: 'post',
  path: '/baseball-game-stats',
  tags: ['BaseballGameStats'],
  summary: '新しい試合統計を作成する',
  description: '新しい試合統計を作成して保存します',
  request: {
    body: {
      content: {
        'application/json': {
          schema: baseballGameStatSchema,
        },
      },
    },
  },
  responses: {
    201: {
      description: '作成された試合統計',
      content: {
        'application/json': {
          schema: z.object({
            stat: baseballGameStatResponseSchema,
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

// 試合統計更新ルート
const updateBaseballGameStatRoute = createRoute({
  method: 'put',
  path: '/baseball-game-stats/{id}',
  tags: ['BaseballGameStats'],
  summary: '試合統計を更新する',
  description: '指定されたIDの試合統計を更新します',
  request: {
    params: z.object({
      id: z.string().openapi({
        description: '試合統計ID',
        example: '1',
      }),
    }),
    body: {
      content: {
        'application/json': {
          schema: baseballGameStatUpdateSchema,
        },
      },
    },
  },
  responses: {
    200: {
      description: '更新された試合統計',
      content: {
        'application/json': {
          schema: z.object({
            stat: baseballGameStatResponseSchema,
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
      description: '試合統計または選手が見つかりません',
      content: {
        'application/json': {
          schema: errorResponseSchema,
        },
      },
    },
  },
});

// 試合統計削除ルート
const deleteBaseballGameStatRoute = createRoute({
  method: 'delete',
  path: '/baseball-game-stats/{id}',
  tags: ['BaseballGameStats'],
  summary: '試合統計を削除する',
  description: '指定されたIDの試合統計を削除します',
  request: {
    params: z.object({
      id: z.string().openapi({
        description: '試合統計ID',
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
      description: '試合統計が見つかりません',
      content: {
        'application/json': {
          schema: errorResponseSchema,
        },
      },
    },
  },
});

// ルートの実装
baseballGameStatRoutes.openapi(getBaseballGameStatsRoute, getBaseballGameStats);
baseballGameStatRoutes.openapi(
  getBaseballGameStatsByPlayerIdRoute,
  getBaseballGameStatsByPlayerId
);
baseballGameStatRoutes.openapi(
  getBaseballGameStatByIdRoute,
  getBaseballGameStatById
);
baseballGameStatRoutes.openapi(
  createBaseballGameStatRoute,
  createBaseballGameStat
);
baseballGameStatRoutes.openapi(
  updateBaseballGameStatRoute,
  updateBaseballGameStat
);
baseballGameStatRoutes.openapi(
  deleteBaseballGameStatRoute,
  deleteBaseballGameStat
);

export default baseballGameStatRoutes;
