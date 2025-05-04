import { OpenAPIHono } from '@hono/zod-openapi';
import { createRoute } from '@hono/zod-openapi';
import { z } from '@hono/zod-openapi';
import {
  createNotification,
  deleteNotification,
  getNotificationById,
  getNotifications,
  getNotificationsByUserId,
  updateNotification
} from './controllers';

// OpenAPIHonoインスタンスを作成
const notificationRoutes = new OpenAPIHono();

// OpenAPI用の通知スキーマを定義
const notificationSchema = z.object({
  user_id: z.number().nullable().optional().openapi({
    description: '対象ユーザーID',
    example: 1
  }),
  title: z.string().min(2).openapi({
    description: '通知タイトル',
    example: '新しいタスクが割り当てられました'
  }),
  message: z.string().min(1).openapi({
    description: '通知メッセージ',
    example: 'フロントエンド実装のタスクが割り当てられました'
  }),
  is_read: z.boolean().optional().default(false).openapi({
    description: '既読状態',
    example: false
  })
}).openapi('Notification');

// レスポンス用の通知スキーマ（IDを含む）
const notificationResponseSchema = z.object({
  id: z.number().openapi({
    description: '通知ID',
    example: 1
  }),
  user_id: z.number().nullable().openapi({
    description: '対象ユーザーID',
    example: 1
  }),
  title: z.string().openapi({
    description: '通知タイトル',
    example: '新しいタスクが割り当てられました'
  }),
  message: z.string().openapi({
    description: '通知メッセージ',
    example: 'フロントエンド実装のタスクが割り当てられました'
  }),
  is_read: z.boolean().openapi({
    description: '既読状態',
    example: false
  }),
  created_at: z.string().openapi({
    description: '作成日時',
    example: '2023-01-01T00:00:00Z'
  }),
  updated_at: z.string().openapi({
    description: '更新日時',
    example: '2023-01-01T00:00:00Z'
  })
}).openapi('NotificationResponse');

// エラーレスポンススキーマ
const errorResponseSchema = z.object({
  error: z.string().openapi({
    description: 'エラーメッセージ',
    example: '入力が無効です'
  })
}).openapi('ErrorResponse');

// 通知一覧取得ルート
const getNotificationsRoute = createRoute({
  method: 'get',
  path: '/notifications',
  tags: ['Notification'],
  summary: '通知一覧を取得する',
  description: '登録されているすべての通知を取得します',
  responses: {
    200: {
      description: '通知一覧',
      content: {
        'application/json': {
          schema: z.object({
            notifications: z.array(notificationResponseSchema)
          })
        }
      }
    }
  }
});

// ユーザーIDによる通知取得ルート
const getNotificationsByUserIdRoute = createRoute({
  method: 'get',
  path: '/users/{userId}/notifications',
  tags: ['Notification'],
  summary: '指定ユーザーの通知一覧を取得する',
  description: '指定されたユーザーIDに紐づく通知を取得します',
  request: {
    params: z.object({
      userId: z.string().openapi({
        description: 'ユーザーID',
        example: '1'
      })
    })
  },
  responses: {
    200: {
      description: 'ユーザーの通知一覧',
      content: {
        'application/json': {
          schema: z.object({
            notifications: z.array(notificationResponseSchema)
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

// 単一の通知取得ルート
const getNotificationRoute = createRoute({
  method: 'get',
  path: '/notifications/{id}',
  tags: ['Notification'],
  summary: '指定IDの通知を取得する',
  description: '指定されたIDの通知を取得します',
  request: {
    params: z.object({
      id: z.string().openapi({
        description: '通知ID',
        example: '1'
      })
    })
  },
  responses: {
    200: {
      description: '通知情報',
      content: {
        'application/json': {
          schema: z.object({
            notification: notificationResponseSchema
          })
        }
      }
    },
    404: {
      description: '通知が見つかりません',
      content: {
        'application/json': {
          schema: errorResponseSchema
        }
      }
    }
  }
});

// 通知作成ルート
const createNotificationRoute = createRoute({
  method: 'post',
  path: '/notifications',
  tags: ['Notification'],
  summary: '新しい通知を作成する',
  description: '新しい通知を作成して保存します',
  request: {
    body: {
      content: {
        'application/json': {
          schema: notificationSchema
        }
      }
    }
  },
  responses: {
    201: {
      description: '作成された通知',
      content: {
        'application/json': {
          schema: z.object({
            notification: notificationResponseSchema
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

// 通知更新ルート
const updateNotificationRoute = createRoute({
  method: 'put',
  path: '/notifications/{id}',
  tags: ['Notification'],
  summary: '指定IDの通知を更新する',
  description: '指定されたIDの通知を更新します',
  request: {
    params: z.object({
      id: z.string().openapi({
        description: '通知ID',
        example: '1'
      })
    }),
    body: {
      content: {
        'application/json': {
          schema: notificationSchema
        }
      }
    }
  },
  responses: {
    200: {
      description: '更新された通知',
      content: {
        'application/json': {
          schema: z.object({
            notification: notificationResponseSchema
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
      description: '通知が見つかりません',
      content: {
        'application/json': {
          schema: errorResponseSchema
        }
      }
    }
  }
});

// 通知削除ルート
const deleteNotificationRoute = createRoute({
  method: 'delete',
  path: '/notifications/{id}',
  tags: ['Notification'],
  summary: '指定IDの通知を削除する',
  description: '指定されたIDの通知を削除します',
  request: {
    params: z.object({
      id: z.string().openapi({
        description: '通知ID',
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
              example: 'Notification deleted successfully'
            })
          })
        }
      }
    },
    404: {
      description: '通知が見つかりません',
      content: {
        'application/json': {
          schema: errorResponseSchema
        }
      }
    }
  }
});

// ルートの実装
notificationRoutes.openapi(getNotificationsRoute, getNotifications);
notificationRoutes.openapi(getNotificationsByUserIdRoute, getNotificationsByUserId);
notificationRoutes.openapi(getNotificationRoute, getNotificationById);
notificationRoutes.openapi(createNotificationRoute, createNotification);
notificationRoutes.openapi(updateNotificationRoute, updateNotification);
notificationRoutes.openapi(deleteNotificationRoute, deleteNotification);

export default notificationRoutes;
