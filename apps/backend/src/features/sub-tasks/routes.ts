import { OpenAPIHono } from '@hono/zod-openapi';
import { createRoute } from '@hono/zod-openapi';
import { z } from '@hono/zod-openapi';
import {
  createSubTask,
  deleteSubTask,
  getSubTaskById,
  getSubTasks,
  getSubTasksByTaskId,
  updateSubTask,
} from './controllers';

// OpenAPIHonoインスタンスを作成
const subTaskRoutes = new OpenAPIHono();

// OpenAPI用のサブタスクスキーマを定義
const subTaskSchema = z
  .object({
    task_id: z.number().openapi({
      description: '親タスクID',
      example: 1,
    }),
    title: z.string().min(2).openapi({
      description: 'サブタスクタイトル',
      example: 'UIデザインの実装',
    }),
    description: z.string().nullable().optional().openapi({
      description: 'サブタスクの詳細説明',
      example: 'ユーザー画面のUIデザインを実装する',
    }),
    status: z
      .string()
      .optional()
      .default('PENDING')
      .openapi({
        description: 'サブタスクの状態',
        example: 'PENDING',
        enum: ['PENDING', 'IN_PROGRESS', 'COMPLETED'],
      }),
    due_date: z.string().nullable().optional().openapi({
      description: '期限日',
      example: '2023-12-31',
    }),
  })
  .openapi('SubTask');

// レスポンス用のサブタスクスキーマ（IDを含む）
const subTaskResponseSchema = z
  .object({
    id: z.number().openapi({
      description: 'サブタスクID',
      example: 1,
    }),
    task_id: z.number().openapi({
      description: '親タスクID',
      example: 1,
    }),
    title: z.string().openapi({
      description: 'サブタスクタイトル',
      example: 'UIデザインの実装',
    }),
    description: z.string().nullable().openapi({
      description: 'サブタスクの詳細説明',
      example: 'ユーザー画面のUIデザインを実装する',
    }),
    status: z.string().openapi({
      description: 'サブタスクの状態',
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
  .openapi('SubTaskResponse');

// エラーレスポンススキーマ
const errorResponseSchema = z
  .object({
    error: z.string().openapi({
      description: 'エラーメッセージ',
      example: '入力が無効です',
    }),
  })
  .openapi('ErrorResponse');

// サブタスク一覧取得ルート
const getSubTasksRoute = createRoute({
  method: 'get',
  path: '/sub-tasks',
  tags: ['SubTask'],
  summary: 'サブタスク一覧を取得する',
  description: '登録されているすべてのサブタスクを取得します',
  responses: {
    200: {
      description: 'サブタスク一覧',
      content: {
        'application/json': {
          schema: z.object({
            subTasks: z.array(subTaskResponseSchema),
          }),
        },
      },
    },
  },
});

// タスクIDによるサブタスク取得ルート
const getSubTasksByTaskIdRoute = createRoute({
  method: 'get',
  path: '/tasks/{taskId}/sub-tasks',
  tags: ['SubTask'],
  summary: '指定タスクのサブタスク一覧を取得する',
  description: '指定されたタスクIDに紐づくサブタスクを取得します',
  request: {
    params: z.object({
      taskId: z.string().openapi({
        description: 'タスクID',
        example: '1',
      }),
    }),
  },
  responses: {
    200: {
      description: 'タスクのサブタスク一覧',
      content: {
        'application/json': {
          schema: z.object({
            subTasks: z.array(subTaskResponseSchema),
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

// 単一のサブタスク取得ルート
const getSubTaskRoute = createRoute({
  method: 'get',
  path: '/sub-tasks/{id}',
  tags: ['SubTask'],
  summary: '指定IDのサブタスクを取得する',
  description: '指定されたIDのサブタスクを取得します',
  request: {
    params: z.object({
      id: z.string().openapi({
        description: 'サブタスクID',
        example: '1',
      }),
    }),
  },
  responses: {
    200: {
      description: 'サブタスク情報',
      content: {
        'application/json': {
          schema: z.object({
            subTask: subTaskResponseSchema,
          }),
        },
      },
    },
    404: {
      description: 'サブタスクが見つかりません',
      content: {
        'application/json': {
          schema: errorResponseSchema,
        },
      },
    },
  },
});

// サブタスク作成ルート
const createSubTaskRoute = createRoute({
  method: 'post',
  path: '/sub-tasks',
  tags: ['SubTask'],
  summary: '新しいサブタスクを作成する',
  description: '新しいサブタスクを作成して保存します',
  request: {
    body: {
      content: {
        'application/json': {
          schema: subTaskSchema,
        },
      },
    },
  },
  responses: {
    201: {
      description: '作成されたサブタスク',
      content: {
        'application/json': {
          schema: z.object({
            subTask: subTaskResponseSchema,
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

// サブタスク更新ルート
const updateSubTaskRoute = createRoute({
  method: 'put',
  path: '/sub-tasks/{id}',
  tags: ['SubTask'],
  summary: '指定IDのサブタスクを更新する',
  description: '指定されたIDのサブタスクを更新します',
  request: {
    params: z.object({
      id: z.string().openapi({
        description: 'サブタスクID',
        example: '1',
      }),
    }),
    body: {
      content: {
        'application/json': {
          schema: subTaskSchema,
        },
      },
    },
  },
  responses: {
    200: {
      description: '更新されたサブタスク',
      content: {
        'application/json': {
          schema: z.object({
            subTask: subTaskResponseSchema,
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
      description: 'サブタスクが見つかりません',
      content: {
        'application/json': {
          schema: errorResponseSchema,
        },
      },
    },
  },
});

// サブタスク削除ルート
const deleteSubTaskRoute = createRoute({
  method: 'delete',
  path: '/sub-tasks/{id}',
  tags: ['SubTask'],
  summary: '指定IDのサブタスクを削除する',
  description: '指定されたIDのサブタスクを削除します',
  request: {
    params: z.object({
      id: z.string().openapi({
        description: 'サブタスクID',
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
              example: 'SubTask deleted successfully',
            }),
          }),
        },
      },
    },
    404: {
      description: 'サブタスクが見つかりません',
      content: {
        'application/json': {
          schema: errorResponseSchema,
        },
      },
    },
  },
});

// ルートの実装
subTaskRoutes.openapi(getSubTasksRoute, getSubTasks);
subTaskRoutes.openapi(getSubTasksByTaskIdRoute, getSubTasksByTaskId);
subTaskRoutes.openapi(getSubTaskRoute, getSubTaskById);
subTaskRoutes.openapi(createSubTaskRoute, createSubTask);
subTaskRoutes.openapi(updateSubTaskRoute, updateSubTask);
subTaskRoutes.openapi(deleteSubTaskRoute, deleteSubTask);

export default subTaskRoutes;
