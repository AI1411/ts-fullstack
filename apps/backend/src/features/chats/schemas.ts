import { z } from 'zod';

export const chatSchema = z.object({
  id: z.number().optional(),
  creator_id: z.number(),
  recipient_id: z.number(),
});

export const chatMessageSchema = z.object({
  id: z.number().optional(),
  chat_id: z.number(),
  sender_id: z.number(),
  content: z.string().min(1),
  is_read: z.boolean().optional().default(false),
});
