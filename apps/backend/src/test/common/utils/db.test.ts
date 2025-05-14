import { describe, it, expect, vi, beforeEach } from 'vitest';
import { getDB } from '../../../common/utils/db';
import postgres from 'postgres';
import { drizzle } from 'drizzle-orm/postgres-js';

// Mock the modules
vi.mock('postgres', () => ({
  default: vi.fn(() => 'mocked-postgres-client')
}));

vi.mock('drizzle-orm/postgres-js', () => ({
  drizzle: vi.fn((client, options) => ({
    client,
    schema: options.schema,
    mockedDrizzleInstance: true
  }))
}));

describe('Database Utilities', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('getDB', () => {
    it('should create a postgres client with the provided DATABASE_URL', () => {
      // Create a mock context with DATABASE_URL
      const mockContext = {
        env: {
          DATABASE_URL: 'postgres://user:password@localhost:5432/testdb'
        }
      };

      // Call the getDB function
      const db = getDB(mockContext);

      // Verify postgres was called with the correct URL and options
      expect(postgres).toHaveBeenCalledWith(
        'postgres://user:password@localhost:5432/testdb',
        { prepare: false }
      );

      // Verify drizzle was called with the postgres client and schema
      expect(drizzle).toHaveBeenCalledWith('mocked-postgres-client', { schema: expect.anything() });

      // Verify the returned object is the mocked drizzle instance
      expect(db).toEqual({
        client: 'mocked-postgres-client',
        schema: expect.anything(),
        mockedDrizzleInstance: true
      });
    });
  });
});
