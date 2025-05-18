import { swaggerUI } from '@hono/swagger-ui';
import { OpenAPIHono } from '@hono/zod-openapi';
import { cors } from 'hono/cors';
import { describe, expect, it } from 'vitest';

// Simple test to verify the app exists
describe('App Configuration', () => {
  it('should have a valid app structure', async () => {
    // Import the app
    const { default: app } = await import('../app');

    // Basic assertions that don't require mocking
    expect(app).toBeDefined();
    expect(typeof app.route).toBe('function');
    expect(typeof app.get).toBe('function');
    expect(typeof app.use).toBe('function');
  });
});
