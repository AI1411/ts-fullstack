import { TASK_ROUTES } from '@/features/admin/tasks/routes';
import { describe, expect, it } from 'vitest';

describe('Task Routes', () => {
  describe('TASK_ROUTES', () => {
    it('should have the correct route paths', () => {
      expect(TASK_ROUTES.list).toBe('/tasks');
      expect(TASK_ROUTES.detail(1)).toBe('/tasks/1');
      expect(TASK_ROUTES.create).toBe('/tasks/create');
      expect(TASK_ROUTES.edit(1)).toBe('/tasks/1/edit');
      expect(TASK_ROUTES.adminList).toBe('/admin/tasks');
    });

    it('should handle string IDs', () => {
      expect(TASK_ROUTES.detail('abc')).toBe('/tasks/abc');
      expect(TASK_ROUTES.edit('abc')).toBe('/tasks/abc/edit');
    });

    it('should handle numeric IDs', () => {
      expect(TASK_ROUTES.detail(123)).toBe('/tasks/123');
      expect(TASK_ROUTES.edit(123)).toBe('/tasks/123/edit');
    });
  });
});
