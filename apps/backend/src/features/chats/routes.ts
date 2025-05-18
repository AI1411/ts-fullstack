import { OpenAPIHono } from '@hono/zod-openapi';
import { createRoute } from '@hono/zod-openapi';
import { z } from '@hono/zod-openapi';
import {
  createChat,
  createChatMessage,
  getChatById,
  getChatMessages,
  getUnreadMessageCount,
  getUserChats,
  markMessagesAsRead,
} from './controllers';

// OpenAPIHonoインスタンスを作成
const chatRoutes = new OpenAPIHono();

// OpenAPI用のチャットスキーマを定義
const chatSchema = z
  .object({
    creator_id: z.number().openapi({
      description: 'チャット作成者ID',
      example: 1,
    }),
    recipient_id: z.number().openapi({
      description: '受信者ID',
      example: 2,
    }),
  })
  .openapi('Chat');

// レスポンス用のチャットスキーマ（IDを含む）
const chatResponseSchema = z
  .object({
    id: z.number().openapi({
      description: 'チャットID',
      example: 1,
    }),
    creator_id: z.number().openapi({
      description: 'チャット作成者ID',
      example: 1,
    }),
    recipient_id: z.number().openapi({
      description: '受信者ID',
      example: 2,
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
  .openapi('ChatResponse');

// チャットメッセージスキーマ
const chatMessageSchema = z
  .object({
    chat_id: z.number().openapi({
      description: 'チャットID',
      example: 1,
    }),
    sender_id: z.number().openapi({
      description: '送信者ID',
      example: 1,
    }),
    content: z.string().min(1).openapi({
      description: 'メッセージ内容',
      example: 'こんにちは！',
    }),
    is_read: z.boolean().optional().default(false).openapi({
      description: '既読状態',
      example: false,
    }),
  })
  .openapi('ChatMessage');

// レスポンス用のチャットメッセージスキーマ（IDを含む）
const chatMessageResponseSchema = z
  .object({
    id: z.number().openapi({
      description: 'メッセージID',
      example: 1,
    }),
    chat_id: z.number().openapi({
      description: 'チャットID',
      example: 1,
    }),
    sender_id: z.number().openapi({
      description: '送信者ID',
      example: 1,
    }),
    content: z.string().openapi({
      description: 'メッセージ内容',
      example: 'こんにちは！',
    }),
    is_read: z.boolean().openapi({
      description: '既読状態',
      example: false,
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
  .openapi('ChatMessageResponse');

// エラーレスポンススキーマ
const errorResponseSchema = z
  .object({
    error: z.string().openapi({
      description: 'エラーメッセージ',
      example: '入力が無効です',
    }),
  })
  .openapi('ErrorResponse');

// チャット作成ルート
const createChatRoute = createRoute({
  method: 'post',
  path: '/chats',
  tags: ['Chat'],
  summary: '新しいチャットを作成する',
  description: '新しいチャットを作成して保存します',
  request: {
    body: {
      content: {
        'application/json': {
          schema: chatSchema,
        },
      },
    },
  },
  responses: {
    201: {
      description: '作成されたチャット',
      content: {
        'application/json': {
          schema: z.object({
            chat: chatResponseSchema,
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

// ユーザーのチャット一覧取得ルート
const getUserChatsRoute = createRoute({
  method: 'get',
  path: '/users/{userId}/chats',
  tags: ['Chat'],
  summary: 'ユーザーのチャット一覧を取得する',
  description: '指定されたユーザーIDに関連するすべてのチャットを取得します',
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
      description: 'ユーザーのチャット一覧',
      content: {
        'application/json': {
          schema: z.object({
            chats: z.array(
              z.object({
                chat: chatResponseSchema,
                otherUser: z.object({
                  id: z.number(),
                  name: z.string(),
                }),
              })
            ),
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

// チャット取得ルート
const getChatByIdRoute = createRoute({
  method: 'get',
  path: '/chats/{id}',
  tags: ['Chat'],
  summary: '指定IDのチャットを取得する',
  description: '指定されたIDのチャットを取得します',
  request: {
    params: z.object({
      id: z.string().openapi({
        description: 'チャットID',
        example: '1',
      }),
    }),
  },
  responses: {
    200: {
      description: 'チャット情報',
      content: {
        'application/json': {
          schema: z.object({
            chat: chatResponseSchema,
          }),
        },
      },
    },
    404: {
      description: 'チャットが見つかりません',
      content: {
        'application/json': {
          schema: errorResponseSchema,
        },
      },
    },
  },
});

// チャットメッセージ作成ルート
const createChatMessageRoute = createRoute({
  method: 'post',
  path: '/chats/{chatId}/messages',
  tags: ['Chat'],
  summary: '新しいチャットメッセージを作成する',
  description: '指定されたチャットに新しいメッセージを作成して保存します',
  request: {
    params: z.object({
      chatId: z.string().openapi({
        description: 'チャットID',
        example: '1',
      }),
    }),
    body: {
      content: {
        'application/json': {
          schema: z.object({
            sender_id: z.number(),
            content: z.string().min(1),
            is_read: z.boolean().optional(),
          }),
        },
      },
    },
  },
  responses: {
    201: {
      description: '作成されたメッセージ',
      content: {
        'application/json': {
          schema: z.object({
            message: chatMessageResponseSchema,
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
      description: 'チャットが見つかりません',
      content: {
        'application/json': {
          schema: errorResponseSchema,
        },
      },
    },
  },
});

// チャットメッセージ一覧取得ルート
const getChatMessagesRoute = createRoute({
  method: 'get',
  path: '/chats/{chatId}/messages',
  tags: ['Chat'],
  summary: 'チャットのメッセージ一覧を取得する',
  description: '指定されたチャットIDに関連するすべてのメッセージを取得します',
  request: {
    params: z.object({
      chatId: z.string().openapi({
        description: 'チャットID',
        example: '1',
      }),
    }),
  },
  responses: {
    200: {
      description: 'チャットのメッセージ一覧',
      content: {
        'application/json': {
          schema: z.object({
            messages: z.array(
              z.object({
                message: chatMessageResponseSchema,
                sender: z.object({
                  id: z.number(),
                  name: z.string(),
                }),
              })
            ),
          }),
        },
      },
    },
    404: {
      description: 'チャットが見つかりません',
      content: {
        'application/json': {
          schema: errorResponseSchema,
        },
      },
    },
  },
});

// メッセージを既読にするルート
const markMessagesAsReadRoute = createRoute({
  method: 'put',
  path: '/chats/{chatId}/users/{userId}/read',
  tags: ['Chat'],
  summary: 'チャットのメッセージを既読にする',
  description: '指定されたチャットの未読メッセージを既読状態に更新します',
  request: {
    params: z.object({
      chatId: z.string().openapi({
        description: 'チャットID',
        example: '1',
      }),
      userId: z.string().openapi({
        description: 'ユーザーID',
        example: '1',
      }),
    }),
  },
  responses: {
    200: {
      description: '更新結果',
      content: {
        'application/json': {
          schema: z.object({
            success: z.boolean(),
            count: z.number(),
            messages: z.array(chatMessageResponseSchema),
          }),
        },
      },
    },
    404: {
      description: 'チャットが見つかりません',
      content: {
        'application/json': {
          schema: errorResponseSchema,
        },
      },
    },
  },
});

// 未読メッセージ数取得ルート
const getUnreadMessageCountRoute = createRoute({
  method: 'get',
  path: '/users/{userId}/unread-messages',
  tags: ['Chat'],
  summary: 'ユーザーの未読メッセージ数を取得する',
  description: '指定されたユーザーの未読メッセージ数を取得します',
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
      description: '未読メッセージ数',
      content: {
        'application/json': {
          schema: z.object({
            unreadCount: z.number(),
            chats: z.array(z.number()),
          }),
        },
      },
    },
  },
});

// ルートの実装
chatRoutes.openapi(createChatRoute, createChat);
chatRoutes.openapi(getUserChatsRoute, getUserChats);
chatRoutes.openapi(getChatByIdRoute, getChatById);
chatRoutes.openapi(createChatMessageRoute, createChatMessage);
chatRoutes.openapi(getChatMessagesRoute, getChatMessages);
chatRoutes.openapi(markMessagesAsReadRoute, markMessagesAsRead);
chatRoutes.openapi(getUnreadMessageCountRoute, getUnreadMessageCount);

// テスト用の追加ルート
// POST /chats/messages/read - markMessagesAsRead用
chatRoutes.post('/chats/messages/read', async (c) => {
  const body = await c.req.json();
  const chatId = body.chat_id;
  const userId = body.user_id;

  // パラメータをセット
  c.req.param = (key) => {
    if (key === 'chatId') return String(chatId);
    if (key === 'userId') return String(userId);
    return '';
  };

  return markMessagesAsRead(c);
});

// GET /chats/user/:userId/unread - getUnreadMessageCount用
chatRoutes.get('/chats/user/:userId/unread', async (c) => {
  return getUnreadMessageCount(c);
});

export default chatRoutes;
