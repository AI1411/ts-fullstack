import { OpenAPIHono } from '@hono/zod-openapi';
import { createRoute } from '@hono/zod-openapi';
import { z } from '@hono/zod-openapi';
import {
  createContact,
  getContacts,
  getContactById,
  updateContact,
  deleteContact
} from './controllers';

// OpenAPIHonoインスタンスを作成
const contactRoutes = new OpenAPIHono();

// OpenAPI用のお問い合わせスキーマを定義
const contactSchema = z.object({
  name: z.string().min(1).openapi({
    description: 'お名前',
    example: '山田太郎'
  }),
  email: z.string().email().openapi({
    description: 'メールアドレス',
    example: 'example@example.com'
  }),
  phone: z.string().optional().openapi({
    description: '電話番号',
    example: '090-1234-5678'
  }),
  subject: z.string().min(1).openapi({
    description: '件名',
    example: '商品について'
  }),
  message: z.string().min(1).openapi({
    description: 'メッセージ',
    example: '商品の詳細について質問があります。'
  })
}).openapi('Contact');

// レスポンス用のお問い合わせスキーマ（IDを含む）
const contactResponseSchema = z.object({
  id: z.number().openapi({
    description: 'お問い合わせID',
    example: 1
  }),
  name: z.string().openapi({
    description: 'お名前',
    example: '山田太郎'
  }),
  email: z.string().openapi({
    description: 'メールアドレス',
    example: 'example@example.com'
  }),
  phone: z.string().nullable().openapi({
    description: '電話番号',
    example: '090-1234-5678'
  }),
  subject: z.string().openapi({
    description: '件名',
    example: '商品について'
  }),
  message: z.string().openapi({
    description: 'メッセージ',
    example: '商品の詳細について質問があります。'
  }),
  status: z.string().openapi({
    description: 'ステータス',
    example: 'PENDING'
  }),
  created_at: z.string().openapi({
    description: '作成日時',
    example: '2023-01-01T00:00:00Z'
  }),
  updated_at: z.string().openapi({
    description: '更新日時',
    example: '2023-01-01T00:00:00Z'
  })
}).openapi('ContactResponse');

// 更新用スキーマ
const updateContactSchema = z.object({
  status: z.string().openapi({
    description: 'ステータス',
    example: 'COMPLETED'
  })
}).openapi('UpdateContact');

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
  })
}).openapi('SuccessResponse');

// お問い合わせ送信ルート
const createContactRoute = createRoute({
  method: 'post',
  path: '/contacts',
  tags: ['Contacts'],
  summary: 'お問い合わせを送信する',
  description: 'ユーザーからのお問い合わせを送信します',
  request: {
    body: {
      content: {
        'application/json': {
          schema: contactSchema
        }
      }
    }
  },
  responses: {
    201: {
      description: '送信されたお問い合わせ',
      content: {
        'application/json': {
          schema: z.object({
            contact: contactResponseSchema
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

// 管理者用: お問い合わせ一覧取得ルート
const getContactsRoute = createRoute({
  method: 'get',
  path: '/admin/contacts',
  tags: ['Admin', 'Contacts'],
  summary: 'お問い合わせ一覧を取得する',
  description: '管理者用: すべてのお問い合わせを取得します',
  responses: {
    200: {
      description: 'お問い合わせ一覧',
      content: {
        'application/json': {
          schema: z.object({
            contacts: z.array(contactResponseSchema)
          })
        }
      }
    }
  }
});

// 管理者用: お問い合わせ詳細取得ルート
const getContactByIdRoute = createRoute({
  method: 'get',
  path: '/admin/contacts/{id}',
  tags: ['Admin', 'Contacts'],
  summary: '指定IDのお問い合わせを取得する',
  description: '管理者用: 指定されたIDのお問い合わせを取得します',
  request: {
    params: z.object({
      id: z.string().openapi({
        description: 'お問い合わせID',
        example: '1'
      })
    })
  },
  responses: {
    200: {
      description: 'お問い合わせ情報',
      content: {
        'application/json': {
          schema: z.object({
            contact: contactResponseSchema
          })
        }
      }
    },
    404: {
      description: 'お問い合わせが見つかりません',
      content: {
        'application/json': {
          schema: errorResponseSchema
        }
      }
    }
  }
});

// 管理者用: お問い合わせ更新ルート
const updateContactRoute = createRoute({
  method: 'put',
  path: '/admin/contacts/{id}',
  tags: ['Admin', 'Contacts'],
  summary: 'お問い合わせを更新する',
  description: '管理者用: 指定されたIDのお問い合わせを更新します',
  request: {
    params: z.object({
      id: z.string().openapi({
        description: 'お問い合わせID',
        example: '1'
      })
    }),
    body: {
      content: {
        'application/json': {
          schema: updateContactSchema
        }
      }
    }
  },
  responses: {
    200: {
      description: '更新されたお問い合わせ',
      content: {
        'application/json': {
          schema: z.object({
            contact: contactResponseSchema
          })
        }
      }
    },
    404: {
      description: 'お問い合わせが見つかりません',
      content: {
        'application/json': {
          schema: errorResponseSchema
        }
      }
    }
  }
});

// 管理者用: お問い合わせ削除ルート
const deleteContactRoute = createRoute({
  method: 'delete',
  path: '/admin/contacts/{id}',
  tags: ['Admin', 'Contacts'],
  summary: 'お問い合わせを削除する',
  description: '管理者用: 指定されたIDのお問い合わせを削除します',
  request: {
    params: z.object({
      id: z.string().openapi({
        description: 'お問い合わせID',
        example: '1'
      })
    })
  },
  responses: {
    200: {
      description: '削除成功',
      content: {
        'application/json': {
          schema: successResponseSchema
        }
      }
    },
    404: {
      description: 'お問い合わせが見つかりません',
      content: {
        'application/json': {
          schema: errorResponseSchema
        }
      }
    }
  }
});

// ルートの実装
contactRoutes.openapi(createContactRoute, createContact);
contactRoutes.openapi(getContactsRoute, getContacts);
contactRoutes.openapi(getContactByIdRoute, getContactById);
contactRoutes.openapi(updateContactRoute, updateContact);
contactRoutes.openapi(deleteContactRoute, deleteContact);

export default contactRoutes;