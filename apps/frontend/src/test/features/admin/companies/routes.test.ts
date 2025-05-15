import { describe, it, expect } from 'vitest';
import { COMPANY_ROUTES } from '@/features/admin/companies/routes';

describe('Company Routes', () => {
  it('should have the correct route paths', () => {
    expect(COMPANY_ROUTES.list).toBe('/companies');
    expect(COMPANY_ROUTES.create).toBe('/companies/create');
    expect(COMPANY_ROUTES.adminList).toBe('/admin/companies');
  });

  it('should generate correct detail route', () => {
    expect(COMPANY_ROUTES.detail(1)).toBe('/companies/1');
    expect(COMPANY_ROUTES.detail('abc')).toBe('/companies/abc');
  });

  it('should generate correct edit route', () => {
    expect(COMPANY_ROUTES.edit(1)).toBe('/companies/1/edit');
    expect(COMPANY_ROUTES.edit('abc')).toBe('/companies/abc/edit');
  });
});