// Team controllers
import {teamRepository} from './repositories';

// Types
export interface Team {
  id: number;
  name: string;
  description: string | null;
  created_at: string;
}

export interface CreateTeamInput {
  name: string;
  description?: string | null;
}

// Get all teams
export const getTeams = async (): Promise<Team[]> => {
  try {
    const response = await teamRepository.getTeams();
    const {teams} = await response.json();
    return teams;
  } catch (error) {
    console.error('Error fetching teams:', error);
    throw error;
  }
};

// Create a new team
export const createTeam = async (teamData: CreateTeamInput): Promise<Team> => {
  try {
    const response = await teamRepository.createTeam(teamData);
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(errorText);
    }
    const {team} = await response.json();
    return team;
  } catch (error) {
    console.error('Error creating team:', error);
    throw error;
  }
};

// Get a team by ID
export const getTeamById = async (id: number): Promise<Team> => {
  try {
    const response = await teamRepository.getTeamById(id);
    if (!response.ok) {
      throw new Error('Team not found');
    }
    const {team} = await response.json();
    return team;
  } catch (error) {
    console.error(`Error fetching team ${id}:`, error);
    throw error;
  }
};

// Update a team
export const updateTeam = async (id: number, teamData: Partial<CreateTeamInput>): Promise<Team> => {
  try {
    const response = await teamRepository.updateTeam(id, teamData);
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(errorText);
    }
    const {team} = await response.json();
    return team;
  } catch (error) {
    console.error(`Error updating team ${id}:`, error);
    throw error;
  }
};

// Delete a team
export const deleteTeam = async (id: number): Promise<void> => {
  try {
    const response = await teamRepository.deleteTeam(id);
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(errorText);
    }
  } catch (error) {
    console.error(`Error deleting team ${id}:`, error);
    throw error;
  }
};
