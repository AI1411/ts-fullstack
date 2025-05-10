import { describe, it, expect, vi, beforeEach } from 'vitest';
import { OpenAPIHono } from '@hono/zod-openapi';
import { swaggerUI } from '@hono/swagger-ui';
import { cors } from 'hono/cors';

// Mock all the imported modules
vi.mock('@hono/zod-openapi', () => ({
  OpenAPIHono: vi.fn(() => ({
    doc: vi.fn().mockReturnThis(),
    get: vi.fn().mockReturnThis(),
    use: vi.fn().mockReturnThis(),
    route: vi.fn().mockReturnThis()
  }))
}));

vi.mock('@hono/swagger-ui', () => ({
  swaggerUI: vi.fn(() => 'mocked-swagger-ui')
}));

vi.mock('hono/cors', () => ({
  cors: vi.fn(() => 'mocked-cors-middleware')
}));

// Mock all route modules
vi.mock('../features/base/routes', () => ({ default: 'mocked-base-routes' }));
vi.mock('../features/users/routes', () => ({ default: 'mocked-user-routes' }));
vi.mock('../features/todos/routes', () => ({ default: 'mocked-todo-routes' }));
vi.mock('../features/teams/routes', () => ({ default: 'mocked-team-routes' }));
vi.mock('../features/tasks/routes', () => ({ default: 'mocked-task-routes' }));
vi.mock('../features/notifications/routes', () => ({ default: 'mocked-notification-routes' }));
vi.mock('../features/sub-tasks/routes', () => ({ default: 'mocked-sub-task-routes' }));
vi.mock('../features/chats/routes', () => ({ default: 'mocked-chat-routes' }));
vi.mock('../features/products/routes', () => ({ default: 'mocked-product-routes' }));
vi.mock('../features/orders/routes', () => ({ default: 'mocked-order-routes' }));

describe('App Configuration', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should configure the app with OpenAPI, Swagger UI, CORS, and routes', async () => {
    // Import the app after mocking all dependencies
    const { default: app } = await import('../app');

    // Verify OpenAPIHono was called
    expect(OpenAPIHono).toHaveBeenCalled();

    // Verify doc method was called with correct parameters
    expect(app.doc).toHaveBeenCalledWith('/doc', {
      openapi: '3.0.0',
      info: {
        title: 'APIタイトル',
        version: 'v1',
        description: 'APIの説明'
      },
      servers: [{ url: '/' }]
    });

    // Verify Swagger UI was set up
    expect(swaggerUI).toHaveBeenCalledWith({ url: '/doc' });
    expect(app.get).toHaveBeenCalledWith('/ui', 'mocked-swagger-ui');

    // Verify CORS middleware was applied
    expect(cors).toHaveBeenCalledWith({ origin: '*' });
    expect(app.use).toHaveBeenCalledWith('*', 'mocked-cors-middleware');

    // Verify all routes were combined
    expect(app.route).toHaveBeenCalledWith('/', 'mocked-base-routes');
    expect(app.route).toHaveBeenCalledWith('/', 'mocked-user-routes');
    expect(app.route).toHaveBeenCalledWith('/', 'mocked-todo-routes');
    expect(app.route).toHaveBeenCalledWith('/', 'mocked-team-routes');
    expect(app.route).toHaveBeenCalledWith('/', 'mocked-task-routes');
    expect(app.route).toHaveBeenCalledWith('/', 'mocked-notification-routes');
    expect(app.route).toHaveBeenCalledWith('/', 'mocked-sub-task-routes');
    expect(app.route).toHaveBeenCalledWith('/', 'mocked-chat-routes');
    expect(app.route).toHaveBeenCalledWith('/', 'mocked-product-routes');
    expect(app.route).toHaveBeenCalledWith('/', 'mocked-order-routes');
  });
});