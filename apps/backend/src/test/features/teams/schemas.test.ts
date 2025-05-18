import { describe, expect, it } from 'vitest';
import { teamSchema } from '../../../features/teams/schemas';

describe('Team Schemas', () => {
  describe('teamSchema', () => {
    it('should validate a valid team with only required fields', () => {
      const validTeam = {
        name: 'Test Team',
      };

      const result = teamSchema.safeParse(validTeam);
      expect(result.success).toBe(true);
    });

    it('should validate a valid team with all fields', () => {
      const validTeam = {
        id: 1,
        name: 'Test Team',
        description: 'This is a test team',
      };

      const result = teamSchema.safeParse(validTeam);
      expect(result.success).toBe(true);
    });

    it('should validate a team with null description', () => {
      const validTeam = {
        name: 'Test Team',
        description: null,
      };

      const result = teamSchema.safeParse(validTeam);
      expect(result.success).toBe(true);
    });

    it('should reject a team with name shorter than 2 characters', () => {
      const invalidTeam = {
        name: 'A', // Too short
      };

      const result = teamSchema.safeParse(invalidTeam);
      expect(result.success).toBe(false);
    });

    it('should reject a team without a name', () => {
      const invalidTeam = {
        description: 'Missing name',
      };

      const result = teamSchema.safeParse(invalidTeam);
      expect(result.success).toBe(false);
    });

    it('should reject a team with empty name', () => {
      const invalidTeam = {
        name: '',
      };

      const result = teamSchema.safeParse(invalidTeam);
      expect(result.success).toBe(false);
    });

    it('should reject a team with invalid field types', () => {
      const invalidTeam = {
        name: 'Test Team',
        id: 'not-a-number',
      };

      const result = teamSchema.safeParse(invalidTeam);
      expect(result.success).toBe(false);
    });
  });
});
