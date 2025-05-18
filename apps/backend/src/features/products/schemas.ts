import { z } from 'zod';

export const productSchema = z.object({
  id: z.number().optional(),
  name: z.string().min(1, { message: '商品名は必須です' }),
  description: z.string().optional(),
  price: z.number().min(0, { message: '価格は0以上である必要があります' }),
  stock: z
    .number()
    .min(0, { message: '在庫数は0以上である必要があります' })
    .optional(),
  image_url: z
    .string()
    .url({ message: '有効なURLを入力してください' })
    .optional(),
});

export const productUpdateSchema = productSchema.partial().omit({ id: true });
