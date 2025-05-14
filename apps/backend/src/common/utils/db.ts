import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from '../../db/schema';

// データベース接続関数
export const getDB = (c: any) => {
  const client = postgres(c.env.DATABASE_URL, { prepare: false });
  return drizzle(client, { schema });
};
