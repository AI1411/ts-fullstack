import { OpenAPIHono } from '@hono/zod-openapi';
import { createRoute } from '@hono/zod-openapi';
import { z } from '@hono/zod-openapi';
import {
  getInvoices,
  getInvoiceById,
  createInvoice,
  updateInvoice,
  deleteInvoice
} from './controllers';

// OpenAPIHonoインスタンスを作成
const invoiceRoutes = new OpenAPIHono();

// OpenAPI用の領収書スキーマを定義
const invoiceSchema = z.object({
  order_id: z.number().optional().openapi({
    description: '注文ID',
    example: 1
  }),
  invoice_number: z.string().min(1).openapi({
    description: '領収書番号',
    example: 'INV-2023-001'
  }),
  issue_date: z.string().optional().openapi({
    description: '発行日',
    example: '2023-01-01T00:00:00Z'
  }),
  due_date: z.string().optional().openapi({
    description: '支払期限',
    example: '2023-01-31T00:00:00Z'
  }),
  total_amount: z.number().openapi({
    description: '合計金額',
    example: 10000
  }),
  status: z.string().optional().openapi({
    description: 'ステータス',
    example: 'PENDING'
  }),
  payment_method: z.string().optional().openapi({
    description: '支払方法',
    example: 'クレジットカード'
  }),
  notes: z.string().optional().openapi({
    description: '備考',
    example: '特記事項なし'
  })
}).openapi('Invoice');

// レスポンス用の領収書スキーマ（IDを含む）
const invoiceResponseSchema = z.object({
  id: z.number().openapi({
    description: '領収書ID',
    example: 1
  }),
  order_id: z.number().nullable().openapi({
    description: '注文ID',
    example: 1
  }),
  invoice_number: z.string().openapi({
    description: '領収書番号',
    example: 'INV-2023-001'
  }),
  issue_date: z.string().openapi({
    description: '発行日',
    example: '2023-01-01T00:00:00Z'
  }),
  due_date: z.string().nullable().openapi({
    description: '支払期限',
    example: '2023-01-31T00:00:00Z'
  }),
  total_amount: z.number().openapi({
    description: '合計金額',
    example: 10000
  }),
  status: z.string().openapi({
    description: 'ステータス',
    example: 'PENDING'
  }),
  payment_method: z.string().nullable().openapi({
    description: '支払方法',
    example: 'クレジットカード'
  }),
  notes: z.string().nullable().openapi({
    description: '備考',
    example: '特記事項なし'
  }),
  created_at: z.string().openapi({
    description: '作成日時',
    example: '2023-01-01T00:00:00Z'
  }),
  updated_at: z.string().openapi({
    description: '更新日時',
    example: '2023-01-01T00:00:00Z'
  })
}).openapi('InvoiceResponse');

// 更新用の領収書スキーマ（すべてのフィールドがオプショナル）
const invoiceUpdateSchema = z.object({
  order_id: z.number().optional().openapi({
    description: '注文ID',
    example: 1
  }),
  invoice_number: z.string().min(1).optional().openapi({
    description: '領収書番号',
    example: 'INV-2023-001'
  }),
  issue_date: z.string().optional().openapi({
    description: '発行日',
    example: '2023-01-01T00:00:00Z'
  }),
  due_date: z.string().optional().openapi({
    description: '支払期限',
    example: '2023-01-31T00:00:00Z'
  }),
  total_amount: z.number().optional().openapi({
    description: '合計金額',
    example: 10000
  }),
  status: z.string().optional().openapi({
    description: 'ステータス',
    example: 'PENDING'
  }),
  payment_method: z.string().optional().openapi({
    description: '支払方法',
    example: 'クレジットカード'
  }),
  notes: z.string().optional().openapi({
    description: '備考',
    example: '特記事項なし'
  })
}).openapi('InvoiceUpdate');

// エラーレスポンススキーマ
const errorResponseSchema = z.object({
  error: z.string().openapi({
    description: 'エラーメッセージ',
    example: '入力が無効です'
  })
}).openapi('ErrorResponse');

// 成功レスポンススキーマ
const successResponseSchema = z.object({
  success: z.boolean().openapi({
    description: '成功フラグ',
    example: true
  }),
  message: z.string().openapi({
    description: '成功メッセージ',
    example: '領収書が削除されました'
  })
}).openapi('SuccessResponse');

// 領収書一覧取得
const getInvoicesRoute = createRoute({
  method: 'get',
  path: '/invoices',
  tags: ['invoices'],
  summary: '領収書一覧を取得',
  description: 'すべての領収書を取得します',
  responses: {
    200: {
      description: '領収書一覧',
      content: {
        'application/json': {
          schema: z.object({
            invoices: z.array(invoiceResponseSchema)
          })
        }
      }
    },
    500: {
      description: 'サーバーエラー',
      content: {
        'application/json': {
          schema: errorResponseSchema
        }
      }
    }
  }
});

// 領収書取得
const getInvoiceByIdRoute = createRoute({
  method: 'get',
  path: '/invoices/:id',
  tags: ['invoices'],
  summary: '領収書を取得',
  description: '指定されたIDの領収書を取得します',
  request: {
    params: z.object({
      id: z.string().openapi({
        description: '領収書ID',
        example: '1'
      })
    })
  },
  responses: {
    200: {
      description: '領収書',
      content: {
        'application/json': {
          schema: z.object({
            invoice: invoiceResponseSchema
          })
        }
      }
    },
    404: {
      description: '領収書が見つかりません',
      content: {
        'application/json': {
          schema: errorResponseSchema
        }
      }
    },
    500: {
      description: 'サーバーエラー',
      content: {
        'application/json': {
          schema: errorResponseSchema
        }
      }
    }
  }
});

// 領収書作成
const createInvoiceRoute = createRoute({
  method: 'post',
  path: '/invoices',
  tags: ['invoices'],
  summary: '領収書を作成',
  description: '新しい領収書を作成します',
  request: {
    body: {
      content: {
        'application/json': {
          schema: invoiceSchema
        }
      }
    }
  },
  responses: {
    201: {
      description: '領収書が作成されました',
      content: {
        'application/json': {
          schema: z.object({
            invoice: invoiceResponseSchema
          })
        }
      }
    },
    404: {
      description: '注文が見つかりません',
      content: {
        'application/json': {
          schema: errorResponseSchema
        }
      }
    },
    500: {
      description: 'サーバーエラー',
      content: {
        'application/json': {
          schema: errorResponseSchema
        }
      }
    }
  }
});

// 領収書更新
const updateInvoiceRoute = createRoute({
  method: 'put',
  path: '/invoices/:id',
  tags: ['invoices'],
  summary: '領収書を更新',
  description: '指定されたIDの領収書を更新します',
  request: {
    params: z.object({
      id: z.string().openapi({
        description: '領収書ID',
        example: '1'
      })
    }),
    body: {
      content: {
        'application/json': {
          schema: invoiceUpdateSchema
        }
      }
    }
  },
  responses: {
    200: {
      description: '領収書が更新されました',
      content: {
        'application/json': {
          schema: z.object({
            invoice: invoiceResponseSchema
          })
        }
      }
    },
    404: {
      description: '領収書または注文が見つかりません',
      content: {
        'application/json': {
          schema: errorResponseSchema
        }
      }
    },
    500: {
      description: 'サーバーエラー',
      content: {
        'application/json': {
          schema: errorResponseSchema
        }
      }
    }
  }
});

// 領収書削除
const deleteInvoiceRoute = createRoute({
  method: 'delete',
  path: '/invoices/:id',
  tags: ['invoices'],
  summary: '領収書を削除',
  description: '指定されたIDの領収書を削除します',
  request: {
    params: z.object({
      id: z.string().openapi({
        description: '領収書ID',
        example: '1'
      })
    })
  },
  responses: {
    200: {
      description: '領収書が削除されました',
      content: {
        'application/json': {
          schema: successResponseSchema
        }
      }
    },
    404: {
      description: '領収書が見つかりません',
      content: {
        'application/json': {
          schema: errorResponseSchema
        }
      }
    },
    500: {
      description: 'サーバーエラー',
      content: {
        'application/json': {
          schema: errorResponseSchema
        }
      }
    }
  }
});

// ルートの登録
invoiceRoutes.openapi(getInvoicesRoute, getInvoices);
invoiceRoutes.openapi(getInvoiceByIdRoute, getInvoiceById);
invoiceRoutes.openapi(createInvoiceRoute, createInvoice);
invoiceRoutes.openapi(updateInvoiceRoute, updateInvoice);
invoiceRoutes.openapi(deleteInvoiceRoute, deleteInvoice);

export default invoiceRoutes;
