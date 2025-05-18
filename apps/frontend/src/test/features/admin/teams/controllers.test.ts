import {
  type CreateTeamInput,
  type Team,
  createTeam,
  deleteTeam,
  getTeamById,
  getTeams,
  updateTeam,
} from '@/features/admin/teams/controllers';
import { teamRepository } from '@/features/admin/teams/repositories';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

// Mock the team repository
vi.mock('@/features/admin/teams/repositories', () => ({
  teamRepository: {
    getTeams: vi.fn(),
    createTeam: vi.fn(),
    getTeamById: vi.fn(),
    updateTeam: vi.fn(),
    deleteTeam: vi.fn(),
  },
}));

describe('Team Controllers', () => {
  // Spy on console.error to prevent actual console output during tests
  let consoleErrorSpy: vi.SpyInstance;

  beforeEach(() => {
    consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    vi.clearAllMocks();
    consoleErrorSpy.mockRestore();
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

    it('should return teams when API call is successful', async () => {
      // Mock successful response
      vi.mocked(teamRepository.getTeams).mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({ teams: mockTeams }),
        text: () => Promise.resolve(JSON.stringify({ teams: mockTeams })),
        headers: new Headers({ 'content-type': 'application/json' }),
      } as unknown as Response);

      const result = await getTeams();
      expect(result).toEqual(mockTeams);
      expect(teamRepository.getTeams).toHaveBeenCalled();
    });

    it('should throw an error when API call fails', async () => {
      // Mock failed response
      vi.mocked(teamRepository.getTeams).mockResolvedValue({
        ok: false,
        status: 500,
        statusText: 'Internal Server Error',
        json: () => {
          throw new Error('Error fetching teams');
        },
      } as unknown as Response);

      await expect(getTeams()).rejects.toThrow('Error fetching teams');
      expect(teamRepository.getTeams).toHaveBeenCalled();
      expect(consoleErrorSpy).toHaveBeenCalled();
    });

    it('should handle HTML response instead of JSON', async () => {
      // Mock HTML response
      vi.mocked(teamRepository.getTeams).mockResolvedValue({
        ok: true,
        headers: new Headers({ 'content-type': 'text/html' }),
        text: () =>
          Promise.resolve('<!DOCTYPE html><html><body>Error</body></html>'),
      } as unknown as Response);

      await expect(getTeams()).rejects.toThrow();
      expect(teamRepository.getTeams).toHaveBeenCalled();
      expect(consoleErrorSpy).toHaveBeenCalled();
    });

    it('should handle invalid JSON response', async () => {
      // Mock invalid JSON response
      vi.mocked(teamRepository.getTeams).mockResolvedValue({
        ok: true,
        headers: new Headers({ 'content-type': 'application/json' }),
        text: () => Promise.resolve('Not valid JSON'),
      } as unknown as Response);

      await expect(getTeams()).rejects.toThrow();
      expect(teamRepository.getTeams).toHaveBeenCalled();
      expect(consoleErrorSpy).toHaveBeenCalled();
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

    it('should return a team when API call is successful', async () => {
      // Mock successful response
      vi.mocked(teamRepository.createTeam).mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({ team: mockTeam }),
      } as unknown as Response);

      const result = await createTeam(teamData);
      expect(result).toEqual(mockTeam);
      expect(teamRepository.createTeam).toHaveBeenCalledWith(teamData);
    });

    it('should throw an error when API call fails', async () => {
      // Mock failed response
      const errorMessage = 'Failed to create team';
      vi.mocked(teamRepository.createTeam).mockResolvedValue({
        ok: false,
        text: () => Promise.resolve(errorMessage),
      } as unknown as Response);

      await expect(createTeam(teamData)).rejects.toThrow(errorMessage);
      expect(teamRepository.createTeam).toHaveBeenCalledWith(teamData);
      expect(consoleErrorSpy).toHaveBeenCalled();
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

    it('should return a team when API call is successful', async () => {
      // Mock successful response
      vi.mocked(teamRepository.getTeamById).mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({ team: mockTeam }),
      } as unknown as Response);

      const result = await getTeamById(teamId);
      expect(result).toEqual(mockTeam);
      expect(teamRepository.getTeamById).toHaveBeenCalledWith(teamId);
    });

    it('should throw an error when API call fails', async () => {
      // Mock failed response
      vi.mocked(teamRepository.getTeamById).mockResolvedValue({
        ok: false,
      } as unknown as Response);

      await expect(getTeamById(teamId)).rejects.toThrow('Team not found');
      expect(teamRepository.getTeamById).toHaveBeenCalledWith(teamId);
      expect(consoleErrorSpy).toHaveBeenCalled();
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

    it('should return an updated team when API call is successful', async () => {
      // Mock successful response
      vi.mocked(teamRepository.updateTeam).mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({ team: mockTeam }),
      } as unknown as Response);

      const result = await updateTeam(teamId, teamData);
      expect(result).toEqual(mockTeam);
      expect(teamRepository.updateTeam).toHaveBeenCalledWith(teamId, teamData);
    });

    it('should throw an error when API call fails', async () => {
      // Mock failed response
      const errorMessage = 'Failed to update team';
      vi.mocked(teamRepository.updateTeam).mockResolvedValue({
        ok: false,
        text: () => Promise.resolve(errorMessage),
      } as unknown as Response);

      await expect(updateTeam(teamId, teamData)).rejects.toThrow(errorMessage);
      expect(teamRepository.updateTeam).toHaveBeenCalledWith(teamId, teamData);
      expect(consoleErrorSpy).toHaveBeenCalled();
    });
  });

  describe('deleteTeam', () => {
    const teamId = 1;

    it('should complete successfully when API call is successful', async () => {
      // Mock successful response
      vi.mocked(teamRepository.deleteTeam).mockResolvedValue({
        ok: true,
      } as unknown as Response);

      await expect(deleteTeam(teamId)).resolves.not.toThrow();
      expect(teamRepository.deleteTeam).toHaveBeenCalledWith(teamId);
    });

    it('should throw an error when API call fails', async () => {
      // Mock failed response
      const errorMessage = 'Failed to delete team';
      vi.mocked(teamRepository.deleteTeam).mockResolvedValue({
        ok: false,
        text: () => Promise.resolve(errorMessage),
      } as unknown as Response);

      await expect(deleteTeam(teamId)).rejects.toThrow(errorMessage);
      expect(teamRepository.deleteTeam).toHaveBeenCalledWith(teamId);
      expect(consoleErrorSpy).toHaveBeenCalled();
    });
  });
});
