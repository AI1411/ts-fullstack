import { z } from 'zod';

export const subTaskSchema = z.object({
  id: z.number().optional(),
  task_id: z.number(),
  title: z.string().min(2),
  description: z.string().nullable().optional(),
  status: z.string().optional().default('PENDING'),
  due_date: z.string().nullable().optional(),
});
