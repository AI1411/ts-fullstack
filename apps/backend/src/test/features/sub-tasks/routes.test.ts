import { describe, it, expect } from 'vitest';
import subTaskRoutes from '../../../features/sub-tasks/routes';

describe('SubTask Routes', () => {
  // Simple test to verify the routes are defined
  it('should have routes defined', () => {
    expect(subTaskRoutes).toBeDefined();

    // Check that the subTaskRoutes object has the expected structure
    expect(typeof subTaskRoutes.route).toBe('function');
    expect(typeof subTaskRoutes.get).toBe('function');
    expect(typeof subTaskRoutes.post).toBe('function');
    expect(typeof subTaskRoutes.put).toBe('function');
    expect(typeof subTaskRoutes.delete).toBe('function');
  });
});
