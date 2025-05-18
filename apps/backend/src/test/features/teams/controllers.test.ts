import { beforeEach, describe, expect, it, vi } from 'vitest';
import * as dbModule from '../../../common/utils/db';
import { teamsTable } from '../../../db/schema';
import {
  createTeam,
  deleteTeam,
  getTeamById,
  getTeams,
  updateTeam,
} from '../../../features/teams/controllers';

// Mock team data
const mockTeam = {
  id: 1,
  name: '開発チーム',
  description: 'フロントエンド開発を担当するチーム',
  created_at: new Date(),
  updated_at: new Date(),
};

// Mock the database module
vi.mock('../../../common/utils/db', () => ({
  getDB: vi.fn(),
}));

// Mock context
const createMockContext = (body = {}, params = {}) => ({
  req: {
    valid: vi.fn().mockReturnValue(body),
    param: vi.fn((key) => params[key]),
  },
  json: vi.fn().mockImplementation((data, status) => ({ data, status })),
  env: {
    DATABASE_URL: 'postgres://test:test@localhost:5432/test',
  },
});

// Mock DB client
const mockDbClient = {
  select: vi.fn().mockReturnThis(),
  from: vi.fn().mockReturnThis(),
  where: vi.fn().mockReturnThis(),
  insert: vi.fn().mockReturnThis(),
  values: vi.fn().mockReturnThis(),
  update: vi.fn().mockReturnThis(),
  set: vi.fn().mockReturnThis(),
  delete: vi.fn().mockReturnThis(),
  returning: vi.fn().mockResolvedValue([mockTeam]),
};

describe('Team Controllers', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(dbModule.getDB).mockReturnValue(mockDbClient);
  });

  describe('createTeam', () => {
    it('should create a new team and return it', async () => {
      const mockBody = {
        name: '開発チーム',
        description: 'フロントエンド開発を担当するチーム',
      };
      const mockContext = createMockContext(mockBody);

      const result = await createTeam(mockContext);

      expect(mockContext.req.valid).toHaveBeenCalledWith('json');
      expect(mockContext.json).toHaveBeenCalledWith({ team: mockTeam });
    });

    it('should handle errors', async () => {
      const mockBody = {
        name: '開発チーム',
        description: 'フロントエンド開発を担当するチーム',
      };
      const mockContext = createMockContext(mockBody);

      // Override the mock to throw an error
      mockDbClient.returning.mockRejectedValueOnce(new Error('Database error'));

      const result = await createTeam(mockContext);

      expect(mockContext.json).toHaveBeenCalledWith(
        { error: 'Database error' },
        500
      );
    });
  });

  describe('getTeams', () => {
    it('should return all teams', async () => {
      const mockContext = createMockContext();
      mockDbClient.select.mockReturnThis();
      mockDbClient.from.mockReturnThis();
      mockDbClient.from.mockResolvedValueOnce([mockTeam]);

      const result = await getTeams(mockContext);

      expect(mockContext.json).toHaveBeenCalledWith({ teams: [mockTeam] });
    });

    it('should handle errors', async () => {
      const mockContext = createMockContext();
      mockDbClient.select.mockReturnThis();
      mockDbClient.from.mockRejectedValueOnce(new Error('Database error'));

      const result = await getTeams(mockContext);

      expect(mockContext.json).toHaveBeenCalledWith(
        { error: 'Database error' },
        500
      );
    });
  });

  describe('getTeamById', () => {
    it('should return a team by id', async () => {
      const mockContext = createMockContext({}, { id: '1' });
      mockDbClient.select.mockReturnThis();
      mockDbClient.from.mockReturnThis();
      mockDbClient.where.mockResolvedValueOnce([mockTeam]);

      const result = await getTeamById(mockContext);

      expect(mockContext.req.param).toHaveBeenCalledWith('id');
      expect(mockContext.json).toHaveBeenCalledWith({ team: mockTeam });
    });

    it('should return 404 if team not found', async () => {
      const mockContext = createMockContext({}, { id: '999' });
      mockDbClient.select.mockReturnThis();
      mockDbClient.from.mockReturnThis();
      mockDbClient.where.mockResolvedValueOnce([]);

      const result = await getTeamById(mockContext);

      expect(mockContext.json).toHaveBeenCalledWith(
        { error: 'Team not found' },
        404
      );
    });

    it('should handle errors', async () => {
      const mockContext = createMockContext({}, { id: '1' });
      mockDbClient.select.mockReturnThis();
      mockDbClient.from.mockReturnThis();
      mockDbClient.where.mockRejectedValueOnce(new Error('Database error'));

      const result = await getTeamById(mockContext);

      expect(mockContext.json).toHaveBeenCalledWith(
        { error: 'Database error' },
        500
      );
    });
  });

  describe('updateTeam', () => {
    it('should update a team and return it', async () => {
      const mockBody = {
        name: '更新されたチーム名',
        description: '更新された説明',
      };
      const mockContext = createMockContext(mockBody, { id: '1' });

      const result = await updateTeam(mockContext);

      expect(mockContext.req.valid).toHaveBeenCalledWith('json');
      expect(mockContext.req.param).toHaveBeenCalledWith('id');
      expect(mockContext.json).toHaveBeenCalledWith({ team: mockTeam });
    });

    it('should return 404 if team not found', async () => {
      const mockBody = {
        name: '更新されたチーム名',
        description: '更新された説明',
      };
      const mockContext = createMockContext(mockBody, { id: '999' });
      mockDbClient.returning.mockResolvedValueOnce([]);

      const result = await updateTeam(mockContext);

      expect(mockContext.json).toHaveBeenCalledWith(
        { error: 'Team not found' },
        404
      );
    });

    it('should handle errors', async () => {
      const mockBody = {
        name: '更新されたチーム名',
        description: '更新された説明',
      };
      const mockContext = createMockContext(mockBody, { id: '1' });
      mockDbClient.returning.mockRejectedValueOnce(new Error('Database error'));

      const result = await updateTeam(mockContext);

      expect(mockContext.json).toHaveBeenCalledWith(
        { error: 'Database error' },
        500
      );
    });
  });

  describe('deleteTeam', () => {
    it('should delete a team and return success message', async () => {
      const mockContext = createMockContext({}, { id: '1' });

      const result = await deleteTeam(mockContext);

      expect(mockContext.req.param).toHaveBeenCalledWith('id');
      expect(mockContext.json).toHaveBeenCalledWith({
        message: 'Team deleted successfully',
      });
    });

    it('should return 404 if team not found', async () => {
      const mockContext = createMockContext({}, { id: '999' });
      mockDbClient.returning.mockResolvedValueOnce([]);

      const result = await deleteTeam(mockContext);

      expect(mockContext.json).toHaveBeenCalledWith(
        { error: 'Team not found' },
        404
      );
    });

    it('should handle errors', async () => {
      const mockContext = createMockContext({}, { id: '1' });
      mockDbClient.returning.mockRejectedValueOnce(new Error('Database error'));

      const result = await deleteTeam(mockContext);

      expect(mockContext.json).toHaveBeenCalledWith(
        { error: 'Database error' },
        500
      );
    });
  });
});
