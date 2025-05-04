import { z } from 'zod';

export const todoSchema = z.object({
  id: z.number().optional(),
  user_id: z.number().nullable().optional(),
  title: z.string().min(2),
  description: z.string().nullable().optional(),
  status: z.string().optional().default('PENDING'),
});
