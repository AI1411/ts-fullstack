import { describe, it, expect } from 'vitest';
import { subTaskSchema } from '../../../features/sub-tasks/schemas';

describe('Sub-Task Schemas', () => {
  describe('subTaskSchema', () => {
    it('should validate a valid sub-task with only required fields', () => {
      const validSubTask = {
        task_id: 1,
        title: 'Test Sub-Task',
      };
      
      const result = subTaskSchema.safeParse(validSubTask);
      expect(result.success).toBe(true);
      
      // Check default values
      if (result.success) {
        expect(result.data.status).toBe('PENDING');
      }
    });

    it('should validate a valid sub-task with all fields', () => {
      const validSubTask = {
        id: 1,
        task_id: 1,
        title: 'Test Sub-Task',
        description: 'This is a test sub-task',
        status: 'COMPLETED',
        due_date: '2023-01-01',
      };
      
      const result = subTaskSchema.safeParse(validSubTask);
      expect(result.success).toBe(true);
    });

    it('should validate a sub-task with null values for nullable fields', () => {
      const validSubTask = {
        task_id: 1,
        title: 'Test Sub-Task',
        description: null,
        due_date: null,
      };
      
      const result = subTaskSchema.safeParse(validSubTask);
      expect(result.success).toBe(true);
    });

    it('should reject a sub-task with title shorter than 2 characters', () => {
      const invalidSubTask = {
        task_id: 1,
        title: 'A', // Too short
      };
      
      const result = subTaskSchema.safeParse(invalidSubTask);
      expect(result.success).toBe(false);
    });

    it('should reject a sub-task without a task_id', () => {
      const invalidSubTask = {
        title: 'Test Sub-Task',
      };
      
      const result = subTaskSchema.safeParse(invalidSubTask);
      expect(result.success).toBe(false);
    });

    it('should reject a sub-task without a title', () => {
      const invalidSubTask = {
        task_id: 1,
      };
      
      const result = subTaskSchema.safeParse(invalidSubTask);
      expect(result.success).toBe(false);
    });

    it('should reject a sub-task with invalid field types', () => {
      const invalidSubTask = {
        task_id: 'not-a-number',
        title: 'Test Sub-Task',
      };
      
      const result = subTaskSchema.safeParse(invalidSubTask);
      expect(result.success).toBe(false);
    });
  });
});