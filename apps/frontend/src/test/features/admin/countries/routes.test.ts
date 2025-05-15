import { describe, it, expect } from 'vitest';
import { COUNTRY_ROUTES } from '@/features/admin/countries/routes';

describe('Country Routes', () => {
  it('should have the correct list route', () => {
    expect(COUNTRY_ROUTES.list).toBe('/countries');
  });

  it('should have the correct detail route function', () => {
    expect(COUNTRY_ROUTES.detail(1)).toBe('/countries/1');
    expect(COUNTRY_ROUTES.detail('abc')).toBe('/countries/abc');
  });

  it('should have the correct create route', () => {
    expect(COUNTRY_ROUTES.create).toBe('/countries/create');
  });

  it('should have the correct edit route function', () => {
    expect(COUNTRY_ROUTES.edit(1)).toBe('/countries/1/edit');
    expect(COUNTRY_ROUTES.edit('abc')).toBe('/countries/abc/edit');
  });

  it('should have the correct admin list route', () => {
    expect(COUNTRY_ROUTES.adminList).toBe('/admin/countries');
  });
});