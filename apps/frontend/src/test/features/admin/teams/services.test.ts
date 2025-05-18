import * as controllers from '@/features/admin/teams/controllers';
import type { CreateTeamInput, Team } from '@/features/admin/teams/controllers';
import { teamService } from '@/features/admin/teams/services';
import { beforeEach, describe, expect, it, vi } from 'vitest';

// Mock the controllers
vi.mock('@/features/admin/teams/controllers', () => ({
  getTeams: vi.fn(),
  createTeam: vi.fn(),
  getTeamById: vi.fn(),
  updateTeam: vi.fn(),
  deleteTeam: vi.fn(),
  // Re-export types
  Team: {},
  CreateTeamInput: {},
}));

describe('Team Service', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('getTeams', () => {
    const mockTeams: Team[] = [
      {
        id: 1,
        name: 'Test Team',
        description: 'Test Description',
        created_at: '2023-01-01T00:00:00Z',
      },
    ];

    it('should call the controller method', async () => {
      // Mock successful response
      vi.mocked(controllers.getTeams).mockResolvedValue(mockTeams);

      const result = await teamService.getTeams();

      expect(controllers.getTeams).toHaveBeenCalled();
      expect(result).toEqual(mockTeams);
    });
  });

  describe('createTeam', () => {
    const teamData: CreateTeamInput = {
      name: 'Test Team',
      description: 'Test Description',
    };
    const mockTeam: Team = {
      id: 1,
      name: 'Test Team',
      description: 'Test Description',
      created_at: '2023-01-01T00:00:00Z',
    };

    it('should call the controller method with the correct arguments', async () => {
      // Mock successful response
      vi.mocked(controllers.createTeam).mockResolvedValue(mockTeam);

      const result = await teamService.createTeam(teamData);

      expect(controllers.createTeam).toHaveBeenCalledWith(teamData);
      expect(result).toEqual(mockTeam);
    });
  });

  describe('getTeamById', () => {
    const teamId = 1;
    const mockTeam: Team = {
      id: 1,
      name: 'Test Team',
      description: 'Test Description',
      created_at: '2023-01-01T00:00:00Z',
    };

    it('should call the controller method with the correct arguments', async () => {
      // Mock successful response
      vi.mocked(controllers.getTeamById).mockResolvedValue(mockTeam);

      const result = await teamService.getTeamById(teamId);

      expect(controllers.getTeamById).toHaveBeenCalledWith(teamId);
      expect(result).toEqual(mockTeam);
    });
  });

  describe('updateTeam', () => {
    const teamId = 1;
    const teamData: Partial<CreateTeamInput> = {
      name: 'Updated Team',
    };
    const mockTeam: Team = {
      id: 1,
      name: 'Updated Team',
      description: 'Test Description',
      created_at: '2023-01-01T00:00:00Z',
    };

    it('should call the controller method with the correct arguments', async () => {
      // Mock successful response
      vi.mocked(controllers.updateTeam).mockResolvedValue(mockTeam);

      const result = await teamService.updateTeam(teamId, teamData);

      expect(controllers.updateTeam).toHaveBeenCalledWith(teamId, teamData);
      expect(result).toEqual(mockTeam);
    });
  });

  describe('deleteTeam', () => {
    const teamId = 1;

    it('should call the controller method with the correct arguments', async () => {
      // Mock successful response
      vi.mocked(controllers.deleteTeam).mockResolvedValue(undefined);

      await teamService.deleteTeam(teamId);

      expect(controllers.deleteTeam).toHaveBeenCalledWith(teamId);
    });
  });
});
