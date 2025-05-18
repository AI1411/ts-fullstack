import { OpenAPIHono } from '@hono/zod-openapi';
import { createRoute } from '@hono/zod-openapi';
import { z } from '@hono/zod-openapi';
import {
  createTodo,
  deleteTodo,
  getTodoById,
  getTodos,
  updateTodo,
} from './controllers';

// OpenAPIHonoインスタンスを作成
const todoRoutes = new OpenAPIHono();

// OpenAPI用のTodoスキーマを定義
const todoSchema = z
  .object({
    title: z.string().openapi({
      description: 'Todoのタイトル',
      example: 'プロジェクトの完了',
    }),
    completed: z.boolean().optional().openapi({
      description: '完了状態',
      example: false,
    }),
  })
  .openapi('Todo');

// レスポンス用のTodoスキーマ（IDを含む）
const todoResponseSchema = z
  .object({
    id: z.string().openapi({
      description: 'TodoのID',
      example: '1234-5678-90ab-cdef',
    }),
    title: z.string().openapi({
      description: 'Todoのタイトル',
      example: 'プロジェクトの完了',
    }),
    completed: z.boolean().openapi({
      description: '完了状態',
      example: false,
    }),
  })
  .openapi('TodoResponse');

// エラーレスポンススキーマ
const errorResponseSchema = z
  .object({
    error: z.string().openapi({
      description: 'エラーメッセージ',
      example: '入力が無効です',
    }),
  })
  .openapi('ErrorResponse');

// Todo一覧取得ルート
const getTodosRoute = createRoute({
  method: 'get',
  path: '/todos',
  tags: ['Todo'],
  summary: 'Todo一覧を取得する',
  description: '登録されているすべてのTodoを取得します',
  responses: {
    200: {
      description: 'Todo一覧',
      content: {
        'application/json': {
          schema: z.array(todoResponseSchema),
        },
      },
    },
  },
});

// 単一のTodo取得ルート
const getTodoRoute = createRoute({
  method: 'get',
  path: '/todos/{id}',
  tags: ['Todo'],
  summary: '指定IDのTodoを取得する',
  description: '指定されたIDのTodoを取得します',
  request: {
    params: z.object({
      id: z.string().openapi({
        description: 'TodoのID',
        example: '1234-5678-90ab-cdef',
      }),
    }),
  },
  responses: {
    200: {
      description: 'Todoアイテム',
      content: {
        'application/json': {
          schema: z.object({
            todo: todoResponseSchema,
          }),
        },
      },
    },
    404: {
      description: 'Todoが見つかりません',
      content: {
        'application/json': {
          schema: errorResponseSchema,
        },
      },
    },
  },
});

// Todo作成ルート
const createTodoRoute = createRoute({
  method: 'post',
  path: '/todos',
  tags: ['Todo'],
  summary: '新しいTodoを作成する',
  description: '新しいTodoを作成して保存します',
  request: {
    body: {
      content: {
        'application/json': {
          schema: todoSchema,
        },
      },
    },
  },
  responses: {
    201: {
      description: '作成されたTodo',
      content: {
        'application/json': {
          schema: z.object({
            todo: todoResponseSchema,
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

// Todo更新ルート
const updateTodoRoute = createRoute({
  method: 'put',
  path: '/todos/{id}',
  tags: ['Todo'],
  summary: '指定IDのTodoを更新する',
  description: '指定されたIDのTodoを更新します',
  request: {
    params: z.object({
      id: z.string().openapi({
        description: 'TodoのID',
        example: '1234-5678-90ab-cdef',
      }),
    }),
    body: {
      content: {
        'application/json': {
          schema: todoSchema,
        },
      },
    },
  },
  responses: {
    200: {
      description: '更新されたTodo',
      content: {
        'application/json': {
          schema: z.object({
            todo: todoResponseSchema,
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
      description: 'Todoが見つかりません',
      content: {
        'application/json': {
          schema: errorResponseSchema,
        },
      },
    },
  },
});

// Todo削除ルート
const deleteTodoRoute = createRoute({
  method: 'delete',
  path: '/todos/{id}',
  tags: ['Todo'],
  summary: '指定IDのTodoを削除する',
  description: '指定されたIDのTodoを削除します',
  request: {
    params: z.object({
      id: z.string().openapi({
        description: 'TodoのID',
        example: '1234-5678-90ab-cdef',
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
              example: 'Todo deleted successfully',
            }),
          }),
        },
      },
    },
    404: {
      description: 'Todoが見つかりません',
      content: {
        'application/json': {
          schema: errorResponseSchema,
        },
      },
    },
  },
});

// 互換性のためのTodo作成ルート（/todo）
const createSingleTodoRoute = createRoute({
  method: 'post',
  path: '/todo',
  tags: ['Todo'],
  summary: '新しいTodoを作成する（互換性用）',
  description: '新しいTodoを作成して保存します（フロントエンドの互換性のため）',
  request: {
    body: {
      content: {
        'application/json': {
          schema: todoSchema,
        },
      },
    },
  },
  responses: {
    201: {
      description: '作成されたTodo',
      content: {
        'application/json': {
          schema: z.object({
            todo: todoResponseSchema,
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

// ルートの実装
todoRoutes.openapi(getTodosRoute, getTodos);
todoRoutes.openapi(getTodoRoute, getTodoById);
todoRoutes.openapi(createTodoRoute, createTodo);
todoRoutes.openapi(updateTodoRoute, updateTodo);
todoRoutes.openapi(deleteTodoRoute, deleteTodo);
todoRoutes.openapi(createSingleTodoRoute, createTodo);

export default todoRoutes;
