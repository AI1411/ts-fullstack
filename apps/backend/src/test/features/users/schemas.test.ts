import { describe, it, expect } from 'vitest';
import { userSchema } from '../../../features/users/schemas';

describe('User Schemas', () => {
  describe('userSchema', () => {
    it('should validate a valid user with required fields', () => {
      const validUser = {
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123',
      };
      
      const result = userSchema.safeParse(validUser);
      expect(result.success).toBe(true);
    });

    it('should validate a valid user with all fields', () => {
      const validUser = {
        id: 1,
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123',
      };
      
      const result = userSchema.safeParse(validUser);
      expect(result.success).toBe(true);
    });

    it('should reject a user with name shorter than 2 characters', () => {
      const invalidUser = {
        name: 'A', // Too short
        email: 'test@example.com',
        password: 'password123',
      };
      
      const result = userSchema.safeParse(invalidUser);
      expect(result.success).toBe(false);
    });

    it('should reject a user with invalid email', () => {
      const invalidUser = {
        name: 'Test User',
        email: 'not-an-email',
        password: 'password123',
      };
      
      const result = userSchema.safeParse(invalidUser);
      expect(result.success).toBe(false);
    });

    it('should reject a user with password shorter than 6 characters', () => {
      const invalidUser = {
        name: 'Test User',
        email: 'test@example.com',
        password: '12345', // Too short
      };
      
      const result = userSchema.safeParse(invalidUser);
      expect(result.success).toBe(false);
    });

    it('should reject a user with missing required fields', () => {
      const invalidUser = {
        name: 'Test User',
        // Missing email and password
      };
      
      const result = userSchema.safeParse(invalidUser);
      expect(result.success).toBe(false);
    });

    it('should reject a user with empty name', () => {
      const invalidUser = {
        name: '',
        email: 'test@example.com',
        password: 'password123',
      };
      
      const result = userSchema.safeParse(invalidUser);
      expect(result.success).toBe(false);
    });

    it('should reject a user with invalid field types', () => {
      const invalidUser = {
        name: 'Test User',
        email: 'test@example.com',
        password: 123456, // Should be string
      };
      
      const result = userSchema.safeParse(invalidUser);
      expect(result.success).toBe(false);
    });
  });
});