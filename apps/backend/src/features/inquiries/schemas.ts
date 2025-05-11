import { z } from 'zod';

export const inquirySchema = z.object({
  name: z.string().min(1, { message: "お名前は必須です" }),
  email: z.string().email({ message: "有効なメールアドレスを入力してください" }),
  subject: z.string().min(1, { message: "件名は必須です" }),
  message: z.string().min(1, { message: "メッセージは必須です" }),
});

export const inquiryResponseSchema = z.object({
  id: z.number(),
  name: z.string(),
  email: z.string(),
  subject: z.string(),
  message: z.string(),
  status: z.string(),
  created_at: z.string(),
  updated_at: z.string(),
});