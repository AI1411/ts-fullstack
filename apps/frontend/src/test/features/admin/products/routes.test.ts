import { describe, it, expect } from 'vitest';
import { PRODUCT_ROUTES } from '@/features/admin/products/routes';

describe('Product Routes', () => {
  it('should have the correct route paths', () => {
    expect(PRODUCT_ROUTES.list).toBe('/products');
    expect(PRODUCT_ROUTES.create).toBe('/products/create');
    expect(PRODUCT_ROUTES.adminList).toBe('/admin/products');
  });

  it('should generate correct detail route with numeric ID', () => {
    expect(PRODUCT_ROUTES.detail(1)).toBe('/products/1');
  });

  it('should generate correct detail route with string ID', () => {
    expect(PRODUCT_ROUTES.detail('abc')).toBe('/products/abc');
  });

  it('should generate correct edit route with numeric ID', () => {
    expect(PRODUCT_ROUTES.edit(1)).toBe('/products/1/edit');
  });

  it('should generate correct edit route with string ID', () => {
    expect(PRODUCT_ROUTES.edit('abc')).toBe('/products/abc/edit');
  });
});