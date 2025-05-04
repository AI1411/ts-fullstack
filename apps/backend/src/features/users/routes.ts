import { OpenAPIHono } from '@hono/zod-openapi';
import { createRoute } from '@hono/zod-openapi';
import { z } from '@hono/zod-openapi';
import { createUser, deleteUser, getUserById, getUsers, updateUser } from './controllers';

// OpenAPIHonoインスタンスを作成
const userRoutes = new OpenAPIHono();

// OpenAPI用のユーザースキーマを定義
const userSchema = z.object({
  name: z.string().min(2).openapi({
    description: 'ユーザー名',
    example: '山田太郎'
  }),
  email: z.string().email().openapi({
    description: 'メールアドレス',
    example: 'user@example.com'
  }),
  password: z.string().min(6).openapi({
    description: 'パスワード（6文字以上）',
    example: 'password123'
  })
}).openapi('User');

// レスポンス用のユーザースキーマ（IDを含む）
const userResponseSchema = z.object({
  id: z.number().openapi({
    description: 'ユーザーID',
    example: 1
  }),
  name: z.string().openapi({
    description: 'ユーザー名',
    example: '山田太郎'
  }),
  email: z.string().email().openapi({
    description: 'メールアドレス',
    example: 'user@example.com'
  }),
  created_at: z.string().openapi({
    description: '作成日時',
    example: '2023-01-01T00:00:00Z'
  }),
  updated_at: z.string().openapi({
    description: '更新日時',
    example: '2023-01-01T00:00:00Z'
  })
}).openapi('UserResponse');

// エラーレスポンススキーマ
const errorResponseSchema = z.object({
  error: z.string().openapi({
    description: 'エラーメッセージ',
    example: '入力が無効です'
  })
}).openapi('ErrorResponse');

// ユーザー一覧取得ルート
const getUsersRoute = createRoute({
  method: 'get',
  path: '/users',
  tags: ['User'],
  summary: 'ユーザー一覧を取得する',
  description: '登録されているすべてのユーザーを取得します',
  responses: {
    200: {
      description: 'ユーザー一覧',
      content: {
        'application/json': {
          schema: z.object({
            users: z.array(userResponseSchema)
          })
        }
      }
    }
  }
});

// 単一のユーザー取得ルート
const getUserRoute = createRoute({
  method: 'get',
  path: '/users/{id}',
  tags: ['User'],
  summary: '指定IDのユーザーを取得する',
  description: '指定されたIDのユーザーを取得します',
  request: {
    params: z.object({
      id: z.string().openapi({
        description: 'ユーザーID',
        example: '1'
      })
    })
  },
  responses: {
    200: {
      description: 'ユーザー情報',
      content: {
        'application/json': {
          schema: z.object({
            user: userResponseSchema
          })
        }
      }
    },
    404: {
      description: 'ユーザーが見つかりません',
      content: {
        'application/json': {
          schema: errorResponseSchema
        }
      }
    }
  }
});

// ユーザー作成ルート
const createUserRoute = createRoute({
  method: 'post',
  path: '/users',
  tags: ['User'],
  summary: '新しいユーザーを作成する',
  description: '新しいユーザーを作成して保存します',
  request: {
    body: {
      content: {
        'application/json': {
          schema: userSchema
        }
      }
    }
  },
  responses: {
    201: {
      description: '作成されたユーザー',
      content: {
        'application/json': {
          schema: z.object({
            user: userResponseSchema
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

// ユーザー更新ルート
const updateUserRoute = createRoute({
  method: 'put',
  path: '/users/{id}',
  tags: ['User'],
  summary: '指定IDのユーザーを更新する',
  description: '指定されたIDのユーザーを更新します',
  request: {
    params: z.object({
      id: z.string().openapi({
        description: 'ユーザーID',
        example: '1'
      })
    }),
    body: {
      content: {
        'application/json': {
          schema: userSchema
        }
      }
    }
  },
  responses: {
    200: {
      description: '更新されたユーザー',
      content: {
        'application/json': {
          schema: z.object({
            user: userResponseSchema
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
      description: 'ユーザーが見つかりません',
      content: {
        'application/json': {
          schema: errorResponseSchema
        }
      }
    }
  }
});

// ユーザー削除ルート
const deleteUserRoute = createRoute({
  method: 'delete',
  path: '/users/{id}',
  tags: ['User'],
  summary: '指定IDのユーザーを削除する',
  description: '指定されたIDのユーザーを削除します',
  request: {
    params: z.object({
      id: z.string().openapi({
        description: 'ユーザーID',
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
              example: 'User deleted successfully'
            })
          })
        }
      }
    },
    404: {
      description: 'ユーザーが見つかりません',
      content: {
        'application/json': {
          schema: errorResponseSchema
        }
      }
    }
  }
});

// ルートの実装
userRoutes.openapi(getUsersRoute, getUsers);
userRoutes.openapi(getUserRoute, getUserById);
userRoutes.openapi(createUserRoute, createUser);
userRoutes.openapi(updateUserRoute, updateUser);
userRoutes.openapi(deleteUserRoute, deleteUser);

export default userRoutes;
