import { describe, it, expect } from 'vitest';
import productRoutes from '../../../features/products/routes';

describe('Product Routes', () => {
  // Simple test to verify the routes are defined
  it('should have routes defined', () => {
    expect(productRoutes).toBeDefined();

    // Check that the productRoutes object has the expected structure for OpenAPIHono
    expect(typeof productRoutes.openapi).toBe('function');
    expect(typeof productRoutes.get).toBe('function');
    expect(typeof productRoutes.post).toBe('function');
    expect(typeof productRoutes.put).toBe('function');
    expect(typeof productRoutes.delete).toBe('function');
  });
});
