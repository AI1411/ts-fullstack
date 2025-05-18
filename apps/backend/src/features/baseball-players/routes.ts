import { OpenAPIHono } from '@hono/zod-openapi';
import { createRoute } from '@hono/zod-openapi';
import { z } from '@hono/zod-openapi';
import {
  getBaseballPlayers,
  getBaseballPlayerById,
  createBaseballPlayer,
  updateBaseballPlayer,
  deleteBaseballPlayer
} from './controllers';
import {
  baseballPlayerSchema,
  baseballPlayerResponseSchema,
  baseballPlayerUpdateSchema,
  errorResponseSchema
} from './schemas';

// OpenAPIHonoインスタンスを作成
const baseballPlayerRoutes = new OpenAPIHono();

// 野球選手一覧取得ルート
const getBaseballPlayersRoute = createRoute({
  method: 'get',
  path: '/baseball-players',
  tags: ['BaseballPlayers'],
  summary: '野球選手一覧を取得する',
  description: 'すべての野球選手を取得します',
  responses: {
    200: {
      description: '野球選手一覧',
      content: {
        'application/json': {
          schema: z.object({
            players: z.array(baseballPlayerResponseSchema)
          })
        }
      }
    }
  }
});

// 野球選手取得ルート
const getBaseballPlayerByIdRoute = createRoute({
  method: 'get',
  path: '/baseball-players/{id}',
  tags: ['BaseballPlayers'],
  summary: '指定IDの野球選手を取得する',
  description: '指定されたIDの野球選手を取得します',
  request: {
    params: z.object({
      id: z.string().openapi({
        description: '野球選手ID',
        example: '1'
      })
    })
  },
  responses: {
    200: {
      description: '野球選手情報',
      content: {
        'application/json': {
          schema: z.object({
            player: baseballPlayerResponseSchema
          })
        }
      }
    },
    404: {
      description: '野球選手が見つかりません',
      content: {
        'application/json': {
          schema: errorResponseSchema
        }
      }
    }
  }
});

// 野球選手作成ルート
const createBaseballPlayerRoute = createRoute({
  method: 'post',
  path: '/baseball-players',
  tags: ['BaseballPlayers'],
  summary: '新しい野球選手を作成する',
  description: '新しい野球選手を作成して保存します',
  request: {
    body: {
      content: {
        'application/json': {
          schema: baseballPlayerSchema
        }
      }
    }
  },
  responses: {
    201: {
      description: '作成された野球選手',
      content: {
        'application/json': {
          schema: z.object({
            player: baseballPlayerResponseSchema
          })
        }
      }
    },
    400: {
      description: 'バリデーションエラー',
      content: {
        'application/json': {
          schema: errorResponseSchema
        }
      }
    }
  }
});

// 野球選手更新ルート
const updateBaseballPlayerRoute = createRoute({
  method: 'put',
  path: '/baseball-players/{id}',
  tags: ['BaseballPlayers'],
  summary: '野球選手を更新する',
  description: '指定されたIDの野球選手を更新します',
  request: {
    params: z.object({
      id: z.string().openapi({
        description: '野球選手ID',
        example: '1'
      })
    }),
    body: {
      content: {
        'application/json': {
          schema: baseballPlayerUpdateSchema
        }
      }
    }
  },
  responses: {
    200: {
      description: '更新された野球選手',
      content: {
        'application/json': {
          schema: z.object({
            player: baseballPlayerResponseSchema
          })
        }
      }
    },
    400: {
      description: 'バリデーションエラー',
      content: {
        'application/json': {
          schema: errorResponseSchema
        }
      }
    },
    404: {
      description: '野球選手が見つかりません',
      content: {
        'application/json': {
          schema: errorResponseSchema
        }
      }
    }
  }
});

// 野球選手削除ルート
const deleteBaseballPlayerRoute = createRoute({
  method: 'delete',
  path: '/baseball-players/{id}',
  tags: ['BaseballPlayers'],
  summary: '野球選手を削除する',
  description: '指定されたIDの野球選手を削除します',
  request: {
    params: z.object({
      id: z.string().openapi({
        description: '野球選手ID',
        example: '1'
      })
    })
  },
  responses: {
    200: {
      description: '削除成功',
      content: {
        'application/json': {
          schema: z.object({
            success: z.boolean(),
            message: z.string()
          })
        }
      }
    },
    404: {
      description: '野球選手が見つかりません',
      content: {
        'application/json': {
          schema: errorResponseSchema
        }
      }
    }
  }
});

// ルートの実装
baseballPlayerRoutes.openapi(getBaseballPlayersRoute, getBaseballPlayers);
baseballPlayerRoutes.openapi(getBaseballPlayerByIdRoute, getBaseballPlayerById);
baseballPlayerRoutes.openapi(createBaseballPlayerRoute, createBaseballPlayer);
baseballPlayerRoutes.openapi(updateBaseballPlayerRoute, updateBaseballPlayer);
baseballPlayerRoutes.openapi(deleteBaseballPlayerRoute, deleteBaseballPlayer);

export default baseballPlayerRoutes;