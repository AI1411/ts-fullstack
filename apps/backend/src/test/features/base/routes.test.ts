import { beforeEach, describe, expect, it } from 'vitest';
import baseRoutes from '../../../features/base/routes';

describe('Base Routes', () => {
  beforeEach(() => {
    // Reset any mocks if needed
  });

  describe('GET /', () => {
    it('should return health check message', async () => {
      const res = await baseRoutes.request('/', {
        method: 'GET',
      });

      expect(res.status).toBe(200);
      const data = await res.json();
      expect(data).toEqual({ message: 'API is running' });
    });
  });

  describe('GET /hello', () => {
    it('should return hello message', async () => {
      const res = await baseRoutes.request('/hello', {
        method: 'GET',
      });

      expect(res.status).toBe(200);
      const data = await res.json();
      expect(data).toEqual({ message: 'Hello Hono!' });
    });
  });
});
