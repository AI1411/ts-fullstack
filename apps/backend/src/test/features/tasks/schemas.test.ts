import { describe, it, expect } from 'vitest';
import { taskSchema } from '../../../features/tasks/schemas';

describe('Task Schemas', () => {
  describe('taskSchema', () => {
    it('should validate a valid task with only required fields', () => {
      const validTask = {
        title: 'Test Task',
      };
      
      const result = taskSchema.safeParse(validTask);
      expect(result.success).toBe(true);
      
      // Check default values
      if (result.success) {
        expect(result.data.status).toBe('PENDING');
      }
    });

    it('should validate a valid task with all fields', () => {
      const validTask = {
        id: 1,
        user_id: 1,
        team_id: 2,
        title: 'Test Task',
        description: 'This is a test task',
        status: 'IN_PROGRESS',
        due_date: '2023-12-31',
      };
      
      const result = taskSchema.safeParse(validTask);
      expect(result.success).toBe(true);
    });

    it('should validate a task with null values for nullable fields', () => {
      const validTask = {
        title: 'Test Task',
        user_id: null,
        team_id: null,
        description: null,
        due_date: null,
      };
      
      const result = taskSchema.safeParse(validTask);
      expect(result.success).toBe(true);
    });

    it('should reject a task with title shorter than 2 characters', () => {
      const invalidTask = {
        title: 'A', // Too short
      };
      
      const result = taskSchema.safeParse(invalidTask);
      expect(result.success).toBe(false);
    });

    it('should reject a task without a title', () => {
      const invalidTask = {
        description: 'Missing title',
      };
      
      const result = taskSchema.safeParse(invalidTask);
      expect(result.success).toBe(false);
    });

    it('should reject a task with invalid field types', () => {
      const invalidTask = {
        title: 'Test Task',
        user_id: 'not-a-number',
      };
      
      const result = taskSchema.safeParse(invalidTask);
      expect(result.success).toBe(false);
    });

    it('should reject a task with empty title', () => {
      const invalidTask = {
        title: '',
      };
      
      const result = taskSchema.safeParse(invalidTask);
      expect(result.success).toBe(false);
    });
  });
});