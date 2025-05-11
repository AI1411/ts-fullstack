import { OpenAPIHono } from '@hono/zod-openapi';
import { createRoute } from '@hono/zod-openapi';
import { z } from '@hono/zod-openapi';
import {
  getCategories,
  getCategoryById,
  getProductsByCategory,
  createCategory,
  updateCategory,
  deleteCategory
} from './controllers';

// OpenAPIHonoインスタンスを作成
const categoryRoutes = new OpenAPIHono();

// OpenAPI用のカテゴリスキーマを定義
const categorySchema = z.object({
  name: z.string().min(1).openapi({
    description: 'カテゴリ名',
    example: '電子機器'
  }),
  description: z.string().optional().openapi({
    description: 'カテゴリ説明',
    example: '電子機器に関する商品カテゴリです。'
  })
}).openapi('Category');

// レスポンス用のカテゴリスキーマ（IDを含む）
const categoryResponseSchema = z.object({
  id: z.number().openapi({
    description: 'カテゴリID',
    example: 1
  }),
  name: z.string().openapi({
    description: 'カテゴリ名',
    example: '電子機器'
  }),
  description: z.string().nullable().openapi({
    description: 'カテゴリ説明',
    example: '電子機器に関する商品カテゴリです。'
  }),
  created_at: z.string().openapi({
    description: '作成日時',
    example: '2023-01-01T00:00:00Z'
  }),
  updated_at: z.string().openapi({
    description: '更新日時',
    example: '2023-01-01T00:00:00Z'
  })
}).openapi('CategoryResponse');

// 更新用のカテゴリスキーマ（すべてのフィールドがオプショナル）
const categoryUpdateSchema = z.object({
  name: z.string().min(1).optional().openapi({
    description: 'カテゴリ名',
    example: '電子機器'
  }),
  description: z.string().optional().openapi({
    description: 'カテゴリ説明',
    example: '電子機器に関する商品カテゴリです。'
  })
}).openapi('CategoryUpdate');

// エラーレスポンススキーマ
const errorResponseSchema = z.object({
  error: z.string().openapi({
    description: 'エラーメッセージ',
    example: '入力が無効です'
  })
}).openapi('ErrorResponse');

// 商品レスポンススキーマ（カテゴリに属する商品を取得するため）
const productResponseSchema = z.object({
  id: z.number().openapi({
    description: '商品ID',
    example: 1
  }),
  category_id: z.number().nullable().openapi({
    description: 'カテゴリID',
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

// カテゴリ一覧取得ルート
const getCategoriesRoute = createRoute({
  method: 'get',
  path: '/categories',
  tags: ['Categories'],
  summary: 'カテゴリ一覧を取得する',
  description: 'すべてのカテゴリを取得します',
  responses: {
    200: {
      description: 'カテゴリ一覧',
      content: {
        'application/json': {
          schema: z.object({
            categories: z.array(categoryResponseSchema)
          })
        }
      }
    }
  }
});

// カテゴリ取得ルート
const getCategoryByIdRoute = createRoute({
  method: 'get',
  path: '/categories/{id}',
  tags: ['Categories'],
  summary: '指定IDのカテゴリを取得する',
  description: '指定されたIDのカテゴリを取得します',
  request: {
    params: z.object({
      id: z.string().openapi({
        description: 'カテゴリID',
        example: '1'
      })
    })
  },
  responses: {
    200: {
      description: 'カテゴリ情報',
      content: {
        'application/json': {
          schema: z.object({
            category: categoryResponseSchema
          })
        }
      }
    },
    404: {
      description: 'カテゴリが見つかりません',
      content: {
        'application/json': {
          schema: errorResponseSchema
        }
      }
    }
  }
});

// カテゴリに属する商品取得ルート
const getProductsByCategoryRoute = createRoute({
  method: 'get',
  path: '/categories/{id}/products',
  tags: ['Categories'],
  summary: '指定カテゴリに属する商品を取得する',
  description: '指定されたカテゴリに属するすべての商品を取得します',
  request: {
    params: z.object({
      id: z.string().openapi({
        description: 'カテゴリID',
        example: '1'
      })
    })
  },
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
    },
    404: {
      description: 'カテゴリが見つかりません',
      content: {
        'application/json': {
          schema: errorResponseSchema
        }
      }
    }
  }
});

// カテゴリ作成ルート
const createCategoryRoute = createRoute({
  method: 'post',
  path: '/categories',
  tags: ['Categories'],
  summary: '新しいカテゴリを作成する',
  description: '新しいカテゴリを作成して保存します',
  request: {
    body: {
      content: {
        'application/json': {
          schema: categorySchema
        }
      }
    }
  },
  responses: {
    201: {
      description: '作成されたカテゴリ',
      content: {
        'application/json': {
          schema: z.object({
            category: categoryResponseSchema
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

// カテゴリ更新ルート
const updateCategoryRoute = createRoute({
  method: 'put',
  path: '/categories/{id}',
  tags: ['Categories'],
  summary: 'カテゴリを更新する',
  description: '指定されたIDのカテゴリを更新します',
  request: {
    params: z.object({
      id: z.string().openapi({
        description: 'カテゴリID',
        example: '1'
      })
    }),
    body: {
      content: {
        'application/json': {
          schema: categoryUpdateSchema
        }
      }
    }
  },
  responses: {
    200: {
      description: '更新されたカテゴリ',
      content: {
        'application/json': {
          schema: z.object({
            category: categoryResponseSchema
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
      description: 'カテゴリが見つかりません',
      content: {
        'application/json': {
          schema: errorResponseSchema
        }
      }
    }
  }
});

// カテゴリ削除ルート
const deleteCategoryRoute = createRoute({
  method: 'delete',
  path: '/categories/{id}',
  tags: ['Categories'],
  summary: 'カテゴリを削除する',
  description: '指定されたIDのカテゴリを削除します',
  request: {
    params: z.object({
      id: z.string().openapi({
        description: 'カテゴリID',
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
      description: 'カテゴリが見つかりません',
      content: {
        'application/json': {
          schema: errorResponseSchema
        }
      }
    }
  }
});

// ルートの実装
categoryRoutes.openapi(getCategoriesRoute, getCategories);
categoryRoutes.openapi(getCategoryByIdRoute, getCategoryById);
categoryRoutes.openapi(getProductsByCategoryRoute, getProductsByCategory);
categoryRoutes.openapi(createCategoryRoute, createCategory);
categoryRoutes.openapi(updateCategoryRoute, updateCategory);
categoryRoutes.openapi(deleteCategoryRoute, deleteCategory);

export default categoryRoutes;