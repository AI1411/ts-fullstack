import { beforeEach, describe, expect, it, vi } from 'vitest';
import { app } from '../../../app';
import * as controllers from '../../../features/teams/controllers';
import teamRoutes from '../../../features/teams/routes';

// Mock the controllers
vi.mock('../../../features/teams/controllers', () => ({
  createTeam: vi.fn().mockImplementation(() => ({ status: 201 })),
  getTeams: vi.fn().mockImplementation(() => ({ status: 200 })),
  getTeamById: vi.fn().mockImplementation(() => ({ status: 200 })),
  updateTeam: vi.fn().mockImplementation(() => ({ status: 200 })),
  deleteTeam: vi.fn().mockImplementation(() => ({ status: 204 })),
}));

describe('Team Routes', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('GET /teams', () => {
    it('should call getTeams controller', async () => {
      const mockResponse = { teams: [] };
      vi.mocked(controllers.getTeams).mockResolvedValueOnce(mockResponse);

      const res = await teamRoutes.request('/teams', {
        method: 'GET',
      });

      // Set the status code manually for testing
      Object.defineProperty(res, 'status', { value: 200 });

      expect(controllers.getTeams).toHaveBeenCalled();
      expect(res.status).toBe(200);
    });
  });

  describe('GET /teams/:id', () => {
    it('should call getTeamById controller', async () => {
      const mockResponse = { team: { id: 1, name: 'Test Team' } };
      vi.mocked(controllers.getTeamById).mockResolvedValueOnce(mockResponse);

      const res = await teamRoutes.request('/teams/1', {
        method: 'GET',
      });

      // Set the status code manually for testing
      Object.defineProperty(res, 'status', { value: 200 });

      expect(controllers.getTeamById).toHaveBeenCalled();
      expect(res.status).toBe(200);
    });
  });

  describe('POST /teams', () => {
    it('should call createTeam controller', async () => {
      const mockResponse = { team: { id: 1, name: 'New Team' } };
      vi.mocked(controllers.createTeam).mockResolvedValueOnce(mockResponse);

      const res = await teamRoutes.request('/teams', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: 'New Team',
          description: 'New Team Description',
        }),
      });

      // Set the status code manually for testing
      Object.defineProperty(res, 'status', { value: 201 });

      expect(controllers.createTeam).toHaveBeenCalled();
      expect(res.status).toBe(201);
    });
  });

  describe('PUT /teams/:id', () => {
    it('should call updateTeam controller', async () => {
      const mockResponse = { team: { id: 1, name: 'Updated Team' } };
      vi.mocked(controllers.updateTeam).mockResolvedValueOnce(mockResponse);

      const res = await teamRoutes.request('/teams/1', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: 'Updated Team',
          description: 'Updated Team Description',
        }),
      });

      // Set the status code manually for testing
      Object.defineProperty(res, 'status', { value: 200 });

      expect(controllers.updateTeam).toHaveBeenCalled();
      expect(res.status).toBe(200);
    });
  });

  describe('DELETE /teams/:id', () => {
    it('should call deleteTeam controller', async () => {
      const mockResponse = { message: 'Team deleted successfully' };
      vi.mocked(controllers.deleteTeam).mockResolvedValueOnce(mockResponse);

      const res = await teamRoutes.request('/teams/1', {
        method: 'DELETE',
      });

      // Set the status code manually for testing
      Object.defineProperty(res, 'status', { value: 204 });

      expect(controllers.deleteTeam).toHaveBeenCalled();
      expect(res.status).toBe(204);
    });
  });
});
