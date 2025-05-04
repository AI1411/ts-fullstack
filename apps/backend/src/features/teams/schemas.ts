import { z } from 'zod';

export const teamSchema = z.object({
  id: z.number().optional(),
  name: z.string().min(2),
  description: z.string().nullable().optional(),
});
