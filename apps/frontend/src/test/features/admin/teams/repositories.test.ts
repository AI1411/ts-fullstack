import { client } from '@/common/utils/client';
import type { CreateTeamInput } from '@/features/admin/teams/controllers';
import { teamRepository } from '@/features/admin/teams/repositories';
import { beforeEach, describe, expect, it, vi } from 'vitest';

// Define a type for mock responses to avoid using 'any'
type MockResponse = {
  data: string;
  [key: string]: unknown;
};

// Mock the client utility
vi.mock('@/common/utils/client', () => ({
  client: {
    teams: {
      $get: vi.fn(),
      $post: vi.fn(),
      ':id': {
        $get: vi.fn(),
        $put: vi.fn(),
        $delete: vi.fn(),
      },
    },
  },
}));

describe('Team Repository', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('getTeams', () => {
    const mockResponse = { data: 'mock data' };

    it('should call the correct API endpoint', async () => {
      // Mock successful response
      vi.mocked(client.teams.$get).mockResolvedValue(
        mockResponse as MockResponse
      );

      const result = await teamRepository.getTeams();

      expect(client.teams.$get).toHaveBeenCalled();
      expect(result).toEqual(mockResponse);
    });
  });

  describe('createTeam', () => {
    const teamData: CreateTeamInput = {
      name: 'Test Team',
      description: 'Test Description',
    };
    const mockResponse = { data: 'mock data' };

    it('should call the correct API endpoint with the right data', async () => {
      // Mock successful response
      vi.mocked(client.teams.$post).mockResolvedValue(
        mockResponse as MockResponse
      );

      const result = await teamRepository.createTeam(teamData);

      expect(client.teams.$post).toHaveBeenCalledWith({
        json: teamData,
      });
      expect(result).toEqual(mockResponse);
    });
  });

  describe('getTeamById', () => {
    const teamId = 1;
    const mockResponse = { data: 'mock data' };

    it('should call the correct API endpoint', async () => {
      // Mock successful response
      vi.mocked(client.teams[':id'].$get).mockResolvedValue(
        mockResponse as MockResponse
      );

      const result = await teamRepository.getTeamById(teamId);

      expect(client.teams[':id'].$get).toHaveBeenCalledWith({
        param: { id: teamId.toString() },
      });
      expect(result).toEqual(mockResponse);
    });
  });

  describe('updateTeam', () => {
    const teamId = 1;
    const teamData: Partial<CreateTeamInput> = {
      name: 'Updated Team',
    };
    const mockResponse = { data: 'mock data' };

    it('should call the correct API endpoint with the right data', async () => {
      // Mock successful response
      vi.mocked(client.teams[':id'].$put).mockResolvedValue(
        mockResponse as MockResponse
      );

      const result = await teamRepository.updateTeam(teamId, teamData);

      expect(client.teams[':id'].$put).toHaveBeenCalledWith({
        param: { id: teamId.toString() },
        json: teamData,
      });
      expect(result).toEqual(mockResponse);
    });
  });

  describe('deleteTeam', () => {
    const teamId = 1;
    const mockResponse = { data: 'mock data' };

    it('should call the correct API endpoint', async () => {
      // Mock successful response
      vi.mocked(client.teams[':id'].$delete).mockResolvedValue(
        mockResponse as MockResponse
      );

      const result = await teamRepository.deleteTeam(teamId);

      expect(client.teams[':id'].$delete).toHaveBeenCalledWith({
        param: { id: teamId.toString() },
      });
      expect(result).toEqual(mockResponse);
    });
  });
});
