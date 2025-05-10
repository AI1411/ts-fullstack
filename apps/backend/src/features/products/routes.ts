import { OpenAPIHono } from '@hono/zod-openapi';
import { createRoute } from '@hono/zod-openapi';
import { z } from '@hono/zod-openapi';
import {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct
} from './controllers';

// OpenAPIHonoインスタンスを作成
const productRoutes = new OpenAPIHono();

// OpenAPI用の商品スキーマを定義
const productSchema = z.object({
  name: z.string().min(1).openapi({
    description: '商品名',
    example: 'スマートフォン'
  }),
  description: z.string().optional().openapi({
    description: '商品説明',
    example: '最新モデルのスマートフォンです。'
  }),
  price: z.number().min(0).openapi({
    description: '価格',
    example: 50000
  }),
  stock: z.number().min(0).optional().openapi({
    description: '在庫数',
    example: 100
  }),
  image_url: z.string().url().optional().openapi({
    description: '商品画像URL',
    example: 'https://example.com/images/smartphone.jpg'
  })
}).openapi('Product');

// レスポンス用の商品スキーマ（IDを含む）
const productResponseSchema = z.object({
  id: z.number().openapi({
    description: '商品ID',
    example: 1
  }),
  name: z.string().openapi({
    description: '商品名',
    example: 'スマートフォン'
  }),
  description: z.string().nullable().openapi({
    description: '商品説明',
    example: '最新モデルのスマートフォンです。'
  }),
  price: z.number().openapi({
    description: '価格',
    example: 50000
  }),
  stock: z.number().openapi({
    description: '在庫数',
    example: 100
  }),
  image_url: z.string().nullable().openapi({
    description: '商品画像URL',
    example: 'https://example.com/images/smartphone.jpg'
  }),
  created_at: z.string().openapi({
    description: '作成日時',
    example: '2023-01-01T00:00:00Z'
  }),
  updated_at: z.string().openapi({
    description: '更新日時',
    example: '2023-01-01T00:00:00Z'
  })
}).openapi('ProductResponse');

// 更新用の商品スキーマ（すべてのフィールドがオプショナル）
const productUpdateSchema = z.object({
  name: z.string().min(1).optional().openapi({
    description: '商品名',
    example: 'スマートフォン'
  }),
  description: z.string().optional().openapi({
    description: '商品説明',
    example: '最新モデルのスマートフォンです。'
  }),
  price: z.number().min(0).optional().openapi({
    description: '価格',
    example: 50000
  }),
  stock: z.number().min(0).optional().openapi({
    description: '在庫数',
    example: 100
  }),
  image_url: z.string().url().optional().openapi({
    description: '商品画像URL',
    example: 'https://example.com/images/smartphone.jpg'
  })
}).openapi('ProductUpdate');

// エラーレスポンススキーマ
const errorResponseSchema = z.object({
  error: z.string().openapi({
    description: 'エラーメッセージ',
    example: '入力が無効です'
  })
}).openapi('ErrorResponse');

// 商品一覧取得ルート
const getProductsRoute = createRoute({
  method: 'get',
  path: '/products',
  tags: ['Products'],
  summary: '商品一覧を取得する',
  description: 'すべての商品を取得します',
  responses: {
    200: {
      description: '商品一覧',
      content: {
        'application/json': {
          schema: z.object({
            products: z.array(productResponseSchema)
          })
        }
      }
    }
  }
});

// 商品取得ルート
const getProductByIdRoute = createRoute({
  method: 'get',
  path: '/products/{id}',
  tags: ['Products'],
  summary: '指定IDの商品を取得する',
  description: '指定されたIDの商品を取得します',
  request: {
    params: z.object({
      id: z.string().openapi({
        description: '商品ID',
        example: '1'
      })
    })
  },
  responses: {
    200: {
      description: '商品情報',
      content: {
        'application/json': {
          schema: z.object({
            product: productResponseSchema
          })
        }
      }
    },
    404: {
      description: '商品が見つかりません',
      content: {
        'application/json': {
          schema: errorResponseSchema
        }
      }
    }
  }
});

// 商品作成ルート
const createProductRoute = createRoute({
  method: 'post',
  path: '/products',
  tags: ['Products'],
  summary: '新しい商品を作成する',
  description: '新しい商品を作成して保存します',
  request: {
    body: {
      content: {
        'application/json': {
          schema: productSchema
        }
      }
    }
  },
  responses: {
    201: {
      description: '作成された商品',
      content: {
        'application/json': {
          schema: z.object({
            product: productResponseSchema
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

// 商品更新ルート
const updateProductRoute = createRoute({
  method: 'put',
  path: '/products/{id}',
  tags: ['Products'],
  summary: '商品を更新する',
  description: '指定されたIDの商品を更新します',
  request: {
    params: z.object({
      id: z.string().openapi({
        description: '商品ID',
        example: '1'
      })
    }),
    body: {
      content: {
        'application/json': {
          schema: productUpdateSchema
        }
      }
    }
  },
  responses: {
    200: {
      description: '更新された商品',
      content: {
        'application/json': {
          schema: z.object({
            product: productResponseSchema
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
      description: '商品が見つかりません',
      content: {
        'application/json': {
          schema: errorResponseSchema
        }
      }
    }
  }
});

// 商品削除ルート
const deleteProductRoute = createRoute({
  method: 'delete',
  path: '/products/{id}',
  tags: ['Products'],
  summary: '商品を削除する',
  description: '指定されたIDの商品を削除します',
  request: {
    params: z.object({
      id: z.string().openapi({
        description: '商品ID',
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
      description: '商品が見つかりません',
      content: {
        'application/json': {
          schema: errorResponseSchema
        }
      }
    }
  }
});

// ルートの実装
productRoutes.openapi(getProductsRoute, getProducts);
productRoutes.openapi(getProductByIdRoute, getProductById);
productRoutes.openapi(createProductRoute, createProduct);
productRoutes.openapi(updateProductRoute, updateProduct);
productRoutes.openapi(deleteProductRoute, deleteProduct);

export default productRoutes;