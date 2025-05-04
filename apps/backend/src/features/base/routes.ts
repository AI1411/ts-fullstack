import { Hono } from 'hono';

const baseRoutes = new Hono();

// ヘルスチェック
baseRoutes.get('/', (c) => {
  return c.json({ message: 'API is running' });
});

// Hello
baseRoutes.get('/hello', (c) => {
  return c.json({ message: 'Hello Hono!' });
});

export default baseRoutes;
