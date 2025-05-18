import { z } from 'zod';

export const contactSchema = z.object({
  name: z.string().min(1, { message: 'お名前は必須です' }),
  email: z
    .string()
    .email({ message: '有効なメールアドレスを入力してください' }),
  phone: z.string().optional(),
  subject: z.string().min(1, { message: '件名は必須です' }),
  message: z.string().min(1, { message: 'メッセージは必須です' }),
});

export const contactResponseSchema = z.object({
  id: z.number(),
  name: z.string(),
  email: z.string(),
  phone: z.string().nullable(),
  subject: z.string(),
  message: z.string(),
  status: z.string(),
  created_at: z.string(),
  updated_at: z.string(),
});

export const updateContactSchema = z.object({
  status: z.string(),
});
