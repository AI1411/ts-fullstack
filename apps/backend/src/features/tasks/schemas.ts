import { z } from 'zod';

export const taskSchema = z.object({
  id: z.number().optional(),
  user_id: z.number().nullable().optional(),
  team_id: z.number().nullable().optional(),
  title: z.string().min(2),
  description: z.string().nullable().optional(),
  status: z.string().optional().default('PENDING'),
  due_date: z.string().nullable().optional(),
});
