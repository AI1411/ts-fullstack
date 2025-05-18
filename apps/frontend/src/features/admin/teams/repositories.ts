// Team repositories
import { client } from '@/common/utils/client';
import type { CreateTeamInput } from './controllers';

// Team repository
export const teamRepository = {
  // Get all teams
  getTeams: async () => {
    return client.teams.$get();
  },

  // Create a new team
  createTeam: async (teamData: CreateTeamInput) => {
    return client.teams.$post({
      json: teamData,
    });
  },

  // Get a team by ID
  getTeamById: async (id: number) => {
    return client.teams[':id'].$get({
      param: { id: id.toString() },
    });
  },

  // Update a team
  updateTeam: async (id: number, teamData: Partial<CreateTeamInput>) => {
    return client.teams[':id'].$put({
      param: { id: id.toString() },
      json: teamData,
    });
  },

  // Delete a team
  deleteTeam: async (id: number) => {
    return client.teams[':id'].$delete({
      param: { id: id.toString() },
    });
  },
};
