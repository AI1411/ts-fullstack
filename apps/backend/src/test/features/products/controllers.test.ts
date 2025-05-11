import { describe, it, expect } from 'vitest';
import { createProduct, getProducts, getProductById, updateProduct, deleteProduct } from '../../../features/products/controllers';

describe('Product Controllers', () => {
  // Simple test to verify the controllers are defined
  it('should have controllers defined', () => {
    expect(createProduct).toBeDefined();
    expect(getProducts).toBeDefined();
    expect(getProductById).toBeDefined();
    expect(updateProduct).toBeDefined();
    expect(deleteProduct).toBeDefined();

    // Check that the controllers are functions
    expect(typeof createProduct).toBe('function');
    expect(typeof getProducts).toBe('function');
    expect(typeof getProductById).toBe('function');
    expect(typeof updateProduct).toBe('function');
    expect(typeof deleteProduct).toBe('function');
  });
});
