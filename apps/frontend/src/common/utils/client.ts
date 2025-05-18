import type { AppType } from 'backend/src';
import { hc } from 'hono/client';

// Provide a default value for the API URL in test environments
export const client = hc<AppType>(
  process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api'
);
