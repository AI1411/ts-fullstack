import { TEAM_ROUTES } from '@/features/admin/teams/routes';
import { describe, expect, it } from 'vitest';

describe('Team Routes', () => {
  it('should have the correct route paths', () => {
    expect(TEAM_ROUTES.list).toBe('/teams');
    expect(TEAM_ROUTES.create).toBe('/teams/create');
    expect(TEAM_ROUTES.adminList).toBe('/admin/teams');
  });

  it('should generate correct detail route with numeric ID', () => {
    expect(TEAM_ROUTES.detail(1)).toBe('/teams/1');
  });

  it('should generate correct detail route with string ID', () => {
    expect(TEAM_ROUTES.detail('abc')).toBe('/teams/abc');
  });

  it('should generate correct edit route with numeric ID', () => {
    expect(TEAM_ROUTES.edit(1)).toBe('/teams/1/edit');
  });

  it('should generate correct edit route with string ID', () => {
    expect(TEAM_ROUTES.edit('abc')).toBe('/teams/abc/edit');
  });
});
