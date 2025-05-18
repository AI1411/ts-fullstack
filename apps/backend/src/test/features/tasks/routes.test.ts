import { describe, expect, it } from 'vitest';
import taskRoutes from '../../../features/tasks/routes';

describe('Task Routes', () => {
  // Simple test to verify the routes are defined
  it('should have routes defined', () => {
    expect(taskRoutes).toBeDefined();

    // Check that the taskRoutes object has the expected structure
    expect(typeof taskRoutes.route).toBe('function');
    expect(typeof taskRoutes.get).toBe('function');
    expect(typeof taskRoutes.post).toBe('function');
    expect(typeof taskRoutes.put).toBe('function');
    expect(typeof taskRoutes.delete).toBe('function');
  });
});
