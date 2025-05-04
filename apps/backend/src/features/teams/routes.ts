import { OpenAPIHono } from '@hono/zod-openapi';
import { createRoute } from '@hono/zod-openapi';
import { z } from '@hono/zod-openapi';
import { createTeam, deleteTeam, getTeamById, getTeams, updateTeam } from './controllers';

// OpenAPIHonoインスタンスを作成
const teamRoutes = new OpenAPIHono();

// OpenAPI用のチームスキーマを定義
const teamSchema = z.object({
  name: z.string().min(2).openapi({
    description: 'チーム名',
    example: '開発チーム'
  }),
  description: z.string().nullable().optional().openapi({
    description: 'チームの説明',
    example: 'フロントエンド開発を担当するチーム'
  })
}).openapi('Team');

// レスポンス用のチームスキーマ（IDを含む）
const teamResponseSchema = z.object({
  id: z.number().openapi({
    description: 'チームID',
    example: 1
  }),
  name: z.string().openapi({
    description: 'チーム名',
    example: '開発チーム'
  }),
  description: z.string().nullable().openapi({
    description: 'チームの説明',
    example: 'フロントエンド開発を担当するチーム'
  }),
  created_at: z.string().openapi({
    description: '作成日時',
    example: '2023-01-01T00:00:00Z'
  }),
  updated_at: z.string().openapi({
    description: '更新日時',
    example: '2023-01-01T00:00:00Z'
  })
}).openapi('TeamResponse');

// エラーレスポンススキーマ
const errorResponseSchema = z.object({
  error: z.string().openapi({
    description: 'エラーメッセージ',
    example: '入力が無効です'
  })
}).openapi('ErrorResponse');

// チーム一覧取得ルート
const getTeamsRoute = createRoute({
  method: 'get',
  path: '/teams',
  tags: ['Team'],
  summary: 'チーム一覧を取得する',
  description: '登録されているすべてのチームを取得します',
  responses: {
    200: {
      description: 'チーム一覧',
      content: {
        'application/json': {
          schema: z.object({
            teams: z.array(teamResponseSchema)
          })
        }
      }
    }
  }
});

// 単一のチーム取得ルート
const getTeamRoute = createRoute({
  method: 'get',
  path: '/teams/{id}',
  tags: ['Team'],
  summary: '指定IDのチームを取得する',
  description: '指定されたIDのチームを取得します',
  request: {
    params: z.object({
      id: z.string().openapi({
        description: 'チームID',
        example: '1'
      })
    })
  },
  responses: {
    200: {
      description: 'チーム情報',
      content: {
        'application/json': {
          schema: z.object({
            team: teamResponseSchema
          })
        }
      }
    },
    404: {
      description: 'チームが見つかりません',
      content: {
        'application/json': {
          schema: errorResponseSchema
        }
      }
    }
  }
});

// チーム作成ルート
const createTeamRoute = createRoute({
  method: 'post',
  path: '/teams',
  tags: ['Team'],
  summary: '新しいチームを作成する',
  description: '新しいチームを作成して保存します',
  request: {
    body: {
      content: {
        'application/json': {
          schema: teamSchema
        }
      }
    }
  },
  responses: {
    201: {
      description: '作成されたチーム',
      content: {
        'application/json': {
          schema: z.object({
            team: teamResponseSchema
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

// チーム更新ルート
const updateTeamRoute = createRoute({
  method: 'put',
  path: '/teams/{id}',
  tags: ['Team'],
  summary: '指定IDのチームを更新する',
  description: '指定されたIDのチームを更新します',
  request: {
    params: z.object({
      id: z.string().openapi({
        description: 'チームID',
        example: '1'
      })
    }),
    body: {
      content: {
        'application/json': {
          schema: teamSchema
        }
      }
    }
  },
  responses: {
    200: {
      description: '更新されたチーム',
      content: {
        'application/json': {
          schema: z.object({
            team: teamResponseSchema
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
      description: 'チームが見つかりません',
      content: {
        'application/json': {
          schema: errorResponseSchema
        }
      }
    }
  }
});

// チーム削除ルート
const deleteTeamRoute = createRoute({
  method: 'delete',
  path: '/teams/{id}',
  tags: ['Team'],
  summary: '指定IDのチームを削除する',
  description: '指定されたIDのチームを削除します',
  request: {
    params: z.object({
      id: z.string().openapi({
        description: 'チームID',
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
            message: z.string().openapi({
              description: '成功メッセージ',
              example: 'Team deleted successfully'
            })
          })
        }
      }
    },
    404: {
      description: 'チームが見つかりません',
      content: {
        'application/json': {
          schema: errorResponseSchema
        }
      }
    }
  }
});

// ルートの実装
teamRoutes.openapi(getTeamsRoute, getTeams);
teamRoutes.openapi(getTeamRoute, getTeamById);
teamRoutes.openapi(createTeamRoute, createTeam);
teamRoutes.openapi(updateTeamRoute, updateTeam);
teamRoutes.openapi(deleteTeamRoute, deleteTeam);

export default teamRoutes;
