import { describe, expect, it } from 'vitest';
import { todoSchema } from '../../../features/todos/schemas';

describe('Todo Schemas', () => {
  describe('todoSchema', () => {
    it('should validate a valid todo with only required fields', () => {
      const validTodo = {
        title: 'Test Todo',
      };

      const result = todoSchema.safeParse(validTodo);
      expect(result.success).toBe(true);

      // Check default values
      if (result.success) {
        expect(result.data.status).toBe('PENDING');
      }
    });

    it('should validate a valid todo with all fields', () => {
      const validTodo = {
        id: 1,
        user_id: 1,
        title: 'Test Todo',
        description: 'This is a test todo',
        status: 'COMPLETED',
      };

      const result = todoSchema.safeParse(validTodo);
      expect(result.success).toBe(true);
    });

    it('should validate a todo with null values for nullable fields', () => {
      const validTodo = {
        title: 'Test Todo',
        user_id: null,
        description: null,
      };

      const result = todoSchema.safeParse(validTodo);
      expect(result.success).toBe(true);
    });

    it('should reject a todo with title shorter than 2 characters', () => {
      const invalidTodo = {
        title: 'A', // Too short
      };

      const result = todoSchema.safeParse(invalidTodo);
      expect(result.success).toBe(false);
    });

    it('should reject a todo without a title', () => {
      const invalidTodo = {
        description: 'Missing title',
      };

      const result = todoSchema.safeParse(invalidTodo);
      expect(result.success).toBe(false);
    });

    it('should reject a todo with empty title', () => {
      const invalidTodo = {
        title: '',
      };

      const result = todoSchema.safeParse(invalidTodo);
      expect(result.success).toBe(false);
    });

    it('should reject a todo with invalid field types', () => {
      const invalidTodo = {
        title: 'Test Todo',
        user_id: 'not-a-number',
      };

      const result = todoSchema.safeParse(invalidTodo);
      expect(result.success).toBe(false);
    });
  });
});
