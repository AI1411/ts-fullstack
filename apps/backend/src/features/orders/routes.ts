import { OpenAPIHono } from '@hono/zod-openapi';
import { createRoute } from '@hono/zod-openapi';
import { z } from '@hono/zod-openapi';
import {
  cancelOrder,
  createOrder,
  getOrderById,
  getOrders,
  getUserOrders,
  updateOrderStatus,
} from './controllers';

// OpenAPIHonoインスタンスを作成
const orderRoutes = new OpenAPIHono();

// OpenAPI用の注文アイテムスキーマを定義
const orderItemSchema = z
  .object({
    product_id: z.number().positive().openapi({
      description: '商品ID',
      example: 1,
    }),
    quantity: z.number().positive().openapi({
      description: '数量',
      example: 2,
    }),
  })
  .openapi('OrderItem');

// 注文作成用のスキーマ
const createOrderSchema = z
  .object({
    user_id: z.number().positive().openapi({
      description: 'ユーザーID',
      example: 1,
    }),
    items: z
      .array(orderItemSchema)
      .min(1)
      .openapi({
        description: '注文アイテム',
        example: [
          { product_id: 1, quantity: 2 },
          { product_id: 3, quantity: 1 },
        ],
      }),
  })
  .openapi('CreateOrder');

// 注文ステータス更新用のスキーマ
const updateOrderStatusSchema = z
  .object({
    status: z
      .enum(['PENDING', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED'])
      .openapi({
        description: '注文ステータス',
        example: 'PROCESSING',
      }),
  })
  .openapi('UpdateOrderStatus');

// 注文アイテムレスポンス用のスキーマ
const orderItemResponseSchema = z
  .object({
    id: z.number().openapi({
      description: '注文アイテムID',
      example: 1,
    }),
    product_id: z.number().openapi({
      description: '商品ID',
      example: 1,
    }),
    product_name: z.string().openapi({
      description: '商品名',
      example: 'スマートフォン',
    }),
    quantity: z.number().openapi({
      description: '数量',
      example: 2,
    }),
    price: z.number().openapi({
      description: '価格',
      example: 50000,
    }),
  })
  .openapi('OrderItemResponse');

// 注文レスポンス用のスキーマ
const orderResponseSchema = z
  .object({
    id: z.number().openapi({
      description: '注文ID',
      example: 1,
    }),
    user_id: z.number().openapi({
      description: 'ユーザーID',
      example: 1,
    }),
    total_amount: z.number().openapi({
      description: '合計金額',
      example: 100000,
    }),
    status: z.string().openapi({
      description: '注文ステータス',
      example: 'PENDING',
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
  .openapi('OrderResponse');

// 注文詳細レスポンス用のスキーマ
const orderDetailResponseSchema = z
  .object({
    id: z.number().openapi({
      description: '注文ID',
      example: 1,
    }),
    user_id: z.number().openapi({
      description: 'ユーザーID',
      example: 1,
    }),
    total_amount: z.number().openapi({
      description: '合計金額',
      example: 100000,
    }),
    status: z.string().openapi({
      description: '注文ステータス',
      example: 'PENDING',
    }),
    created_at: z.string().openapi({
      description: '作成日時',
      example: '2023-01-01T00:00:00Z',
    }),
    updated_at: z.string().openapi({
      description: '更新日時',
      example: '2023-01-01T00:00:00Z',
    }),
    items: z.array(orderItemResponseSchema).openapi({
      description: '注文アイテム',
      example: [
        {
          id: 1,
          product_id: 1,
          product_name: 'スマートフォン',
          quantity: 2,
          price: 50000,
        },
      ],
    }),
  })
  .openapi('OrderDetailResponse');

// エラーレスポンススキーマ
const errorResponseSchema = z
  .object({
    error: z.string().openapi({
      description: 'エラーメッセージ',
      example: '入力が無効です',
    }),
  })
  .openapi('ErrorResponse');

// 注文一覧取得ルート
const getOrdersRoute = createRoute({
  method: 'get',
  path: '/orders',
  tags: ['Orders'],
  summary: '注文一覧を取得',
  description: 'すべての注文を取得します',
  responses: {
    200: {
      description: '注文一覧',
      content: {
        'application/json': {
          schema: z.object({
            orders: z.array(orderResponseSchema),
          }),
        },
      },
    },
    500: {
      description: 'サーバーエラー',
      content: {
        'application/json': {
          schema: errorResponseSchema,
        },
      },
    },
  },
});

// 注文詳細取得ルート
const getOrderByIdRoute = createRoute({
  method: 'get',
  path: '/orders/:id',
  tags: ['Orders'],
  summary: '注文詳細を取得',
  description: '指定されたIDの注文詳細を取得します',
  request: {
    params: z.object({
      id: z.string().openapi({
        description: '注文ID',
        example: '1',
      }),
    }),
  },
  responses: {
    200: {
      description: '注文詳細',
      content: {
        'application/json': {
          schema: z.object({
            order: orderDetailResponseSchema,
          }),
        },
      },
    },
    404: {
      description: '注文が見つかりません',
      content: {
        'application/json': {
          schema: errorResponseSchema,
        },
      },
    },
    500: {
      description: 'サーバーエラー',
      content: {
        'application/json': {
          schema: errorResponseSchema,
        },
      },
    },
  },
});

// ユーザーの注文履歴取得ルート
const getUserOrdersRoute = createRoute({
  method: 'get',
  path: '/users/:userId/orders',
  tags: ['Orders'],
  summary: 'ユーザーの注文履歴を取得',
  description: '指定されたユーザーIDの注文履歴を取得します',
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
      description: 'ユーザーの注文履歴',
      content: {
        'application/json': {
          schema: z.object({
            orders: z.array(orderResponseSchema),
          }),
        },
      },
    },
    500: {
      description: 'サーバーエラー',
      content: {
        'application/json': {
          schema: errorResponseSchema,
        },
      },
    },
  },
});

// 注文作成ルート
const createOrderRoute = createRoute({
  method: 'post',
  path: '/orders',
  tags: ['Orders'],
  summary: '注文を作成',
  description: '新しい注文を作成します',
  request: {
    body: {
      content: {
        'application/json': {
          schema: createOrderSchema,
        },
      },
    },
  },
  responses: {
    201: {
      description: '注文が作成されました',
      content: {
        'application/json': {
          schema: z.object({
            order: orderResponseSchema,
            items: z.array(
              z.object({
                id: z.number(),
                order_id: z.number(),
                product_id: z.number(),
                quantity: z.number(),
                price: z.number(),
                created_at: z.string(),
                updated_at: z.string(),
              })
            ),
          }),
        },
      },
    },
    400: {
      description: '無効なリクエスト',
      content: {
        'application/json': {
          schema: errorResponseSchema,
        },
      },
    },
    404: {
      description: '商品が見つかりません',
      content: {
        'application/json': {
          schema: errorResponseSchema,
        },
      },
    },
    500: {
      description: 'サーバーエラー',
      content: {
        'application/json': {
          schema: errorResponseSchema,
        },
      },
    },
  },
});

// 注文ステータス更新ルート
const updateOrderStatusRoute = createRoute({
  method: 'patch',
  path: '/orders/:id/status',
  tags: ['Orders'],
  summary: '注文ステータスを更新',
  description: '指定された注文のステータスを更新します',
  request: {
    params: z.object({
      id: z.string().openapi({
        description: '注文ID',
        example: '1',
      }),
    }),
    body: {
      content: {
        'application/json': {
          schema: updateOrderStatusSchema,
        },
      },
    },
  },
  responses: {
    200: {
      description: '注文ステータスが更新されました',
      content: {
        'application/json': {
          schema: z.object({
            order: orderResponseSchema,
          }),
        },
      },
    },
    404: {
      description: '注文が見つかりません',
      content: {
        'application/json': {
          schema: errorResponseSchema,
        },
      },
    },
    500: {
      description: 'サーバーエラー',
      content: {
        'application/json': {
          schema: errorResponseSchema,
        },
      },
    },
  },
});

// 注文キャンセルルート
const cancelOrderRoute = createRoute({
  method: 'post',
  path: '/orders/:id/cancel',
  tags: ['Orders'],
  summary: '注文をキャンセル',
  description: '指定された注文をキャンセルします',
  request: {
    params: z.object({
      id: z.string().openapi({
        description: '注文ID',
        example: '1',
      }),
    }),
  },
  responses: {
    200: {
      description: '注文がキャンセルされました',
      content: {
        'application/json': {
          schema: z.object({
            order: orderResponseSchema,
            message: z.string(),
          }),
        },
      },
    },
    400: {
      description: '無効なリクエスト',
      content: {
        'application/json': {
          schema: errorResponseSchema,
        },
      },
    },
    404: {
      description: '注文が見つかりません',
      content: {
        'application/json': {
          schema: errorResponseSchema,
        },
      },
    },
    500: {
      description: 'サーバーエラー',
      content: {
        'application/json': {
          schema: errorResponseSchema,
        },
      },
    },
  },
});

// ルートを登録
orderRoutes.openapi(getOrdersRoute, getOrders);
orderRoutes.openapi(getOrderByIdRoute, getOrderById);
orderRoutes.openapi(getUserOrdersRoute, getUserOrders);
orderRoutes.openapi(createOrderRoute, createOrder);
orderRoutes.openapi(updateOrderStatusRoute, updateOrderStatus);
orderRoutes.openapi(cancelOrderRoute, cancelOrder);

export default orderRoutes;
