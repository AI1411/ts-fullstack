import { z } from 'zod';

export const notificationSchema = z.object({
  id: z.number().optional(),
  user_id: z.number().nullable().optional(),
  title: z.string().min(2),
  message: z.string().min(1),
  is_read: z.boolean().optional().default(false),
});
