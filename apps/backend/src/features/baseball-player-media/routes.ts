import { OpenAPIHono } from '@hono/zod-openapi';
import { createRoute } from '@hono/zod-openapi';
import { z } from '@hono/zod-openapi';
import {
  createBaseballPlayerMedia,
  deleteBaseballPlayerMedia,
  getBaseballPlayerMedia,
  getBaseballPlayerMediaById,
  getBaseballPlayerMediaByPlayerId,
  getFeaturedBaseballPlayerMedia,
  updateBaseballPlayerMedia,
} from './controllers';
import {
  baseballPlayerMediaResponseSchema,
  baseballPlayerMediaSchema,
  baseballPlayerMediaUpdateSchema,
  errorResponseSchema,
} from './schemas';

// OpenAPIHonoインスタンスを作成
const baseballPlayerMediaRoutes = new OpenAPIHono();

// メディアコンテンツ一覧取得ルート
const getBaseballPlayerMediaRoute = createRoute({
  method: 'get',
  path: '/baseball-player-media',
  tags: ['BaseballPlayerMedia'],
  summary: '野球選手のメディアコンテンツ一覧を取得する',
  description: 'すべての野球選手のメディアコンテンツを取得します',
  responses: {
    200: {
      description: 'メディアコンテンツ一覧',
      content: {
        'application/json': {
          schema: z.object({
            media: z.array(baseballPlayerMediaResponseSchema),
          }),
        },
      },
    },
  },
});

// 注目メディアコンテンツ一覧取得ルート
const getFeaturedBaseballPlayerMediaRoute = createRoute({
  method: 'get',
  path: '/baseball-player-media/featured',
  tags: ['BaseballPlayerMedia'],
  summary: '注目メディアコンテンツ一覧を取得する',
  description: '注目（is_featuredがtrue）のメディアコンテンツを取得します',
  responses: {
    200: {
      description: '注目メディアコンテンツ一覧',
      content: {
        'application/json': {
          schema: z.object({
            media: z.array(baseballPlayerMediaResponseSchema),
          }),
        },
      },
    },
  },
});

// 特定の選手のメディアコンテンツ一覧取得ルート
const getBaseballPlayerMediaByPlayerIdRoute = createRoute({
  method: 'get',
  path: '/baseball-players/{playerId}/media',
  tags: ['BaseballPlayerMedia'],
  summary: '特定の選手のメディアコンテンツ一覧を取得する',
  description: '指定された選手IDのメディアコンテンツをすべて取得します',
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
      description: '選手のメディアコンテンツ一覧',
      content: {
        'application/json': {
          schema: z.object({
            media: z.array(baseballPlayerMediaResponseSchema),
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

// メディアコンテンツ取得ルート
const getBaseballPlayerMediaByIdRoute = createRoute({
  method: 'get',
  path: '/baseball-player-media/{id}',
  tags: ['BaseballPlayerMedia'],
  summary: '指定IDのメディアコンテンツを取得する',
  description: '指定されたIDのメディアコンテンツを取得します',
  request: {
    params: z.object({
      id: z.string().openapi({
        description: 'メディアコンテンツID',
        example: '1',
      }),
    }),
  },
  responses: {
    200: {
      description: 'メディアコンテンツ情報',
      content: {
        'application/json': {
          schema: z.object({
            media: baseballPlayerMediaResponseSchema,
          }),
        },
      },
    },
    404: {
      description: 'メディアコンテンツが見つかりません',
      content: {
        'application/json': {
          schema: errorResponseSchema,
        },
      },
    },
  },
});

// メディアコンテンツ作成ルート
const createBaseballPlayerMediaRoute = createRoute({
  method: 'post',
  path: '/baseball-player-media',
  tags: ['BaseballPlayerMedia'],
  summary: '新しいメディアコンテンツを作成する',
  description: '新しいメディアコンテンツを作成して保存します',
  request: {
    body: {
      content: {
        'application/json': {
          schema: baseballPlayerMediaSchema,
        },
      },
    },
  },
  responses: {
    201: {
      description: '作成されたメディアコンテンツ',
      content: {
        'application/json': {
          schema: z.object({
            media: baseballPlayerMediaResponseSchema,
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

// メディアコンテンツ更新ルート
const updateBaseballPlayerMediaRoute = createRoute({
  method: 'put',
  path: '/baseball-player-media/{id}',
  tags: ['BaseballPlayerMedia'],
  summary: 'メディアコンテンツを更新する',
  description: '指定されたIDのメディアコンテンツを更新します',
  request: {
    params: z.object({
      id: z.string().openapi({
        description: 'メディアコンテンツID',
        example: '1',
      }),
    }),
    body: {
      content: {
        'application/json': {
          schema: baseballPlayerMediaUpdateSchema,
        },
      },
    },
  },
  responses: {
    200: {
      description: '更新されたメディアコンテンツ',
      content: {
        'application/json': {
          schema: z.object({
            media: baseballPlayerMediaResponseSchema,
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
      description: 'メディアコンテンツまたは選手が見つかりません',
      content: {
        'application/json': {
          schema: errorResponseSchema,
        },
      },
    },
  },
});

// メディアコンテンツ削除ルート
const deleteBaseballPlayerMediaRoute = createRoute({
  method: 'delete',
  path: '/baseball-player-media/{id}',
  tags: ['BaseballPlayerMedia'],
  summary: 'メディアコンテンツを削除する',
  description: '指定されたIDのメディアコンテンツを削除します',
  request: {
    params: z.object({
      id: z.string().openapi({
        description: 'メディアコンテンツID',
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
      description: 'メディアコンテンツが見つかりません',
      content: {
        'application/json': {
          schema: errorResponseSchema,
        },
      },
    },
  },
});

// ルートの実装
baseballPlayerMediaRoutes.openapi(
  getBaseballPlayerMediaRoute,
  getBaseballPlayerMedia
);
baseballPlayerMediaRoutes.openapi(
  getFeaturedBaseballPlayerMediaRoute,
  getFeaturedBaseballPlayerMedia
);
baseballPlayerMediaRoutes.openapi(
  getBaseballPlayerMediaByPlayerIdRoute,
  getBaseballPlayerMediaByPlayerId
);
baseballPlayerMediaRoutes.openapi(
  getBaseballPlayerMediaByIdRoute,
  getBaseballPlayerMediaById
);
baseballPlayerMediaRoutes.openapi(
  createBaseballPlayerMediaRoute,
  createBaseballPlayerMedia
);
baseballPlayerMediaRoutes.openapi(
  updateBaseballPlayerMediaRoute,
  updateBaseballPlayerMedia
);
baseballPlayerMediaRoutes.openapi(
  deleteBaseballPlayerMediaRoute,
  deleteBaseballPlayerMedia
);

export default baseballPlayerMediaRoutes;
