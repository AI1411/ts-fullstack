import { OpenAPIHono } from '@hono/zod-openapi';
import { createRoute } from '@hono/zod-openapi';
import { z } from '@hono/zod-openapi';
import {
  getBaseballTeams,
  getBaseballTeamById,
  createBaseballTeam,
  updateBaseballTeam,
  deleteBaseballTeam
} from './controllers';
import {
  baseballTeamSchema,
  baseballTeamResponseSchema,
  baseballTeamUpdateSchema,
  errorResponseSchema
} from './schemas';

// OpenAPIHonoインスタンスを作成
const baseballTeamRoutes = new OpenAPIHono();

// 野球チーム一覧取得ルート
const getBaseballTeamsRoute = createRoute({
  method: 'get',
  path: '/baseball-teams',
  tags: ['BaseballTeams'],
  summary: '野球チーム一覧を取得する',
  description: 'すべての野球チームを取得します',
  responses: {
    200: {
      description: '野球チーム一覧',
      content: {
        'application/json': {
          schema: z.object({
            teams: z.array(baseballTeamResponseSchema)
          })
        }
      }
    }
  }
});

// 野球チーム取得ルート
const getBaseballTeamByIdRoute = createRoute({
  method: 'get',
  path: '/baseball-teams/{id}',
  tags: ['BaseballTeams'],
  summary: '指定IDの野球チームを取得する',
  description: '指定されたIDの野球チームを取得します',
  request: {
    params: z.object({
      id: z.string().openapi({
        description: '野球チームID',
        example: '1'
      })
    })
  },
  responses: {
    200: {
      description: '野球チーム情報',
      content: {
        'application/json': {
          schema: z.object({
            team: baseballTeamResponseSchema
          })
        }
      }
    },
    404: {
      description: '野球チームが見つかりません',
      content: {
        'application/json': {
          schema: errorResponseSchema
        }
      }
    }
  }
});

// 野球チーム作成ルート
const createBaseballTeamRoute = createRoute({
  method: 'post',
  path: '/baseball-teams',
  tags: ['BaseballTeams'],
  summary: '新しい野球チームを作成する',
  description: '新しい野球チームを作成して保存します',
  request: {
    body: {
      content: {
        'application/json': {
          schema: baseballTeamSchema
        }
      }
    }
  },
  responses: {
    201: {
      description: '作成された野球チーム',
      content: {
        'application/json': {
          schema: z.object({
            team: baseballTeamResponseSchema
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

// 野球チーム更新ルート
const updateBaseballTeamRoute = createRoute({
  method: 'put',
  path: '/baseball-teams/{id}',
  tags: ['BaseballTeams'],
  summary: '野球チームを更新する',
  description: '指定されたIDの野球チームを更新します',
  request: {
    params: z.object({
      id: z.string().openapi({
        description: '野球チームID',
        example: '1'
      })
    }),
    body: {
      content: {
        'application/json': {
          schema: baseballTeamUpdateSchema
        }
      }
    }
  },
  responses: {
    200: {
      description: '更新された野球チーム',
      content: {
        'application/json': {
          schema: z.object({
            team: baseballTeamResponseSchema
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
      description: '野球チームが見つかりません',
      content: {
        'application/json': {
          schema: errorResponseSchema
        }
      }
    }
  }
});

// 野球チーム削除ルート
const deleteBaseballTeamRoute = createRoute({
  method: 'delete',
  path: '/baseball-teams/{id}',
  tags: ['BaseballTeams'],
  summary: '野球チームを削除する',
  description: '指定されたIDの野球チームを削除します',
  request: {
    params: z.object({
      id: z.string().openapi({
        description: '野球チームID',
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
      description: '野球チームが見つかりません',
      content: {
        'application/json': {
          schema: errorResponseSchema
        }
      }
    }
  }
});

// ルートの実装
baseballTeamRoutes.openapi(getBaseballTeamsRoute, getBaseballTeams);
baseballTeamRoutes.openapi(getBaseballTeamByIdRoute, getBaseballTeamById);
baseballTeamRoutes.openapi(createBaseballTeamRoute, createBaseballTeam);
baseballTeamRoutes.openapi(updateBaseballTeamRoute, updateBaseballTeam);
baseballTeamRoutes.openapi(deleteBaseballTeamRoute, deleteBaseballTeam);

export default baseballTeamRoutes;