import { describe, it, expect } from 'vitest';
import { INVOICE_ROUTES } from '@/features/admin/invoices/routes';

describe('Invoice Routes', () => {
  it('should have the correct list route', () => {
    expect(INVOICE_ROUTES.list).toBe('/invoices');
  });

  it('should have the correct detail route function', () => {
    expect(INVOICE_ROUTES.detail(1)).toBe('/invoices/1');
    expect(INVOICE_ROUTES.detail('abc')).toBe('/invoices/abc');
  });

  it('should have the correct create route', () => {
    expect(INVOICE_ROUTES.create).toBe('/invoices/create');
  });

  it('should have the correct edit route function', () => {
    expect(INVOICE_ROUTES.edit(1)).toBe('/invoices/1/edit');
    expect(INVOICE_ROUTES.edit('abc')).toBe('/invoices/abc/edit');
  });

  it('should have the correct admin list route', () => {
    expect(INVOICE_ROUTES.adminList).toBe('/admin/invoices');
  });
});