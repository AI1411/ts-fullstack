import { OpenAPIHono } from '@hono/zod-openapi';
import { createRoute } from '@hono/zod-openapi';
import { z } from '@hono/zod-openapi';
import {
  createTask,
  deleteTask,
  getTaskById,
  getTasks,
  getTasksByTeamId,
  getTasksByUserId,
  updateTask,
} from './controllers';

// OpenAPIHonoインスタンスを作成
const taskRoutes = new OpenAPIHono();

// OpenAPI用のタスクスキーマを定義
const taskSchema = z
  .object({
    user_id: z.number().nullable().optional().openapi({
      description: '担当ユーザーID',
      example: 1,
    }),
    team_id: z.number().nullable().optional().openapi({
      description: '所属チームID',
      example: 1,
    }),
    title: z.string().min(2).openapi({
      description: 'タスクタイトル',
      example: 'フロントエンド実装',
    }),
    description: z.string().nullable().optional().openapi({
      description: 'タスクの詳細説明',
      example: 'ユーザー画面の実装を行う',
    }),
    status: z
      .string()
      .optional()
      .default('PENDING')
      .openapi({
        description: 'タスクの状態',
        example: 'PENDING',
        enum: ['PENDING', 'IN_PROGRESS', 'COMPLETED'],
      }),
    due_date: z.string().nullable().optional().openapi({
      description: '期限日',
      example: '2023-12-31',
    }),
  })
  .openapi('Task');

// レスポンス用のタスクスキーマ（IDを含む）
const taskResponseSchema = z
  .object({
    id: z.number().openapi({
      description: 'タスクID',
      example: 1,
    }),
    user_id: z.number().nullable().openapi({
      description: '担当ユーザーID',
      example: 1,
    }),
    team_id: z.number().nullable().openapi({
      description: '所属チームID',
      example: 1,
    }),
    title: z.string().openapi({
      description: 'タスクタイトル',
      example: 'フロントエンド実装',
    }),
    description: z.string().nullable().openapi({
      description: 'タスクの詳細説明',
      example: 'ユーザー画面の実装を行う',
    }),
    status: z.string().openapi({
      description: 'タスクの状態',
      example: 'PENDING',
      enum: ['PENDING', 'IN_PROGRESS', 'COMPLETED'],
    }),
    due_date: z.string().nullable().openapi({
      description: '期限日',
      example: '2023-12-31',
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
  .openapi('TaskResponse');

// エラーレスポンススキーマ
const errorResponseSchema = z
  .object({
    error: z.string().openapi({
      description: 'エラーメッセージ',
      example: '入力が無効です',
    }),
  })
  .openapi('ErrorResponse');

// タスク一覧取得ルート
const getTasksRoute = createRoute({
  method: 'get',
  path: '/tasks',
  tags: ['Task'],
  summary: 'タスク一覧を取得する',
  description: '登録されているすべてのタスクを取得します',
  responses: {
    200: {
      description: 'タスク一覧',
      content: {
        'application/json': {
          schema: z.object({
            tasks: z.array(taskResponseSchema),
          }),
        },
      },
    },
  },
});

// ユーザーIDによるタスク取得ルート
const getTasksByUserIdRoute = createRoute({
  method: 'get',
  path: '/users/{userId}/tasks',
  tags: ['Task'],
  summary: '指定ユーザーのタスク一覧を取得する',
  description: '指定されたユーザーIDに紐づくタスクを取得します',
  request: {
    params: z.object({
      userId: z.string().openapi({
        description: 'ユーザーID',
        example: '1',
      }),
    }),
  },
  responses: {
    200: {
      description: 'ユーザーのタスク一覧',
      content: {
        'application/json': {
          schema: z.object({
            tasks: z.array(taskResponseSchema),
          }),
        },
      },
    },
    404: {
      description: 'ユーザーが見つかりません',
      content: {
        'application/json': {
          schema: errorResponseSchema,
        },
      },
    },
  },
});

// チームIDによるタスク取得ルート
const getTasksByTeamIdRoute = createRoute({
  method: 'get',
  path: '/teams/{teamId}/tasks',
  tags: ['Task'],
  summary: '指定チームのタスク一覧を取得する',
  description: '指定されたチームIDに紐づくタスクを取得します',
  request: {
    params: z.object({
      teamId: z.string().openapi({
        description: 'チームID',
        example: '1',
      }),
    }),
  },
  responses: {
    200: {
      description: 'チームのタスク一覧',
      content: {
        'application/json': {
          schema: z.object({
            tasks: z.array(taskResponseSchema),
          }),
        },
      },
    },
    404: {
      description: 'チームが見つかりません',
      content: {
        'application/json': {
          schema: errorResponseSchema,
        },
      },
    },
  },
});

// 単一のタスク取得ルート
const getTaskRoute = createRoute({
  method: 'get',
  path: '/tasks/{id}',
  tags: ['Task'],
  summary: '指定IDのタスクを取得する',
  description: '指定されたIDのタスクを取得します',
  request: {
    params: z.object({
      id: z.string().openapi({
        description: 'タスクID',
        example: '1',
      }),
    }),
  },
  responses: {
    200: {
      description: 'タスク情報',
      content: {
        'application/json': {
          schema: z.object({
            task: taskResponseSchema,
          }),
        },
      },
    },
    404: {
      description: 'タスクが見つかりません',
      content: {
        'application/json': {
          schema: errorResponseSchema,
        },
      },
    },
  },
});

// タスク作成ルート
const createTaskRoute = createRoute({
  method: 'post',
  path: '/tasks',
  tags: ['Task'],
  summary: '新しいタスクを作成する',
  description: '新しいタスクを作成して保存します',
  request: {
    body: {
      content: {
        'application/json': {
          schema: taskSchema,
        },
      },
    },
  },
  responses: {
    201: {
      description: '作成されたタスク',
      content: {
        'application/json': {
          schema: z.object({
            task: taskResponseSchema,
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

// タスク更新ルート
const updateTaskRoute = createRoute({
  method: 'put',
  path: '/tasks/{id}',
  tags: ['Task'],
  summary: '指定IDのタスクを更新する',
  description: '指定されたIDのタスクを更新します',
  request: {
    params: z.object({
      id: z.string().openapi({
        description: 'タスクID',
        example: '1',
      }),
    }),
    body: {
      content: {
        'application/json': {
          schema: taskSchema,
        },
      },
    },
  },
  responses: {
    200: {
      description: '更新されたタスク',
      content: {
        'application/json': {
          schema: z.object({
            task: taskResponseSchema,
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
      description: 'タスクが見つかりません',
      content: {
        'application/json': {
          schema: errorResponseSchema,
        },
      },
    },
  },
});

// タスク削除ルート
const deleteTaskRoute = createRoute({
  method: 'delete',
  path: '/tasks/{id}',
  tags: ['Task'],
  summary: '指定IDのタスクを削除する',
  description: '指定されたIDのタスクを削除します',
  request: {
    params: z.object({
      id: z.string().openapi({
        description: 'タスクID',
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
            message: z.string().openapi({
              description: '成功メッセージ',
              example: 'Task deleted successfully',
            }),
          }),
        },
      },
    },
    404: {
      description: 'タスクが見つかりません',
      content: {
        'application/json': {
          schema: errorResponseSchema,
        },
      },
    },
  },
});

// ルートの実装
taskRoutes.openapi(getTasksRoute, getTasks);
taskRoutes.openapi(getTasksByUserIdRoute, getTasksByUserId);
taskRoutes.openapi(getTasksByTeamIdRoute, getTasksByTeamId);
taskRoutes.openapi(getTaskRoute, getTaskById);
taskRoutes.openapi(createTaskRoute, createTask);
taskRoutes.openapi(updateTaskRoute, updateTask);
taskRoutes.openapi(deleteTaskRoute, deleteTask);

export default taskRoutes;
