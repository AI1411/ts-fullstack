// Team services
import {
  type CreateTeamInput,
  type Team,
  createTeam as createTeamController,
  deleteTeam as deleteTeamController,
  getTeamById as getTeamByIdController,
  getTeams as getTeamsController,
  updateTeam as updateTeamController,
} from './controllers';

// Team service
export const teamService = {
  // Get all teams
  getTeams: async (): Promise<Team[]> => {
    return getTeamsController();
  },

  // Create a new team
  createTeam: async (teamData: CreateTeamInput): Promise<Team> => {
    return createTeamController(teamData);
  },

  // Get a team by ID
  getTeamById: async (id: number): Promise<Team> => {
    return getTeamByIdController(id);
  },

  // Update a team
  updateTeam: async (
    id: number,
    teamData: Partial<CreateTeamInput>
  ): Promise<Team> => {
    return updateTeamController(id, teamData);
  },

  // Delete a team
  deleteTeam: async (id: number): Promise<void> => {
    return deleteTeamController(id);
  },
};
