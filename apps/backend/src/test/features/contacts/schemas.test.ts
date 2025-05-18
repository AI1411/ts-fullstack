import { describe, expect, it } from 'vitest';
import {
  contactResponseSchema,
  contactSchema,
  updateContactSchema,
} from '../../../features/contacts/schemas';

describe('Contact Schemas', () => {
  describe('contactSchema', () => {
    it('should validate a valid contact', () => {
      const validContact = {
        name: 'テストユーザー',
        email: 'test@example.com',
        phone: '03-1234-5678',
        subject: 'お問い合わせテスト',
        message: 'これはテスト用のお問い合わせメッセージです。',
      };

      const result = contactSchema.safeParse(validContact);
      expect(result.success).toBe(true);
    });

    it('should validate a contact without optional phone', () => {
      const validContact = {
        name: 'テストユーザー',
        email: 'test@example.com',
        subject: 'お問い合わせテスト',
        message: 'これはテスト用のお問い合わせメッセージです。',
      };

      const result = contactSchema.safeParse(validContact);
      expect(result.success).toBe(true);
    });

    it('should reject a contact without name', () => {
      const invalidContact = {
        email: 'test@example.com',
        phone: '03-1234-5678',
        subject: 'お問い合わせテスト',
        message: 'これはテスト用のお問い合わせメッセージです。',
      };

      const result = contactSchema.safeParse(invalidContact);
      expect(result.success).toBe(false);
    });

    it('should reject a contact with empty name', () => {
      const invalidContact = {
        name: '',
        email: 'test@example.com',
        phone: '03-1234-5678',
        subject: 'お問い合わせテスト',
        message: 'これはテスト用のお問い合わせメッセージです。',
      };

      const result = contactSchema.safeParse(invalidContact);
      expect(result.success).toBe(false);
    });

    it('should reject a contact with invalid email', () => {
      const invalidContact = {
        name: 'テストユーザー',
        email: 'invalid-email',
        phone: '03-1234-5678',
        subject: 'お問い合わせテスト',
        message: 'これはテスト用のお問い合わせメッセージです。',
      };

      const result = contactSchema.safeParse(invalidContact);
      expect(result.success).toBe(false);
    });

    it('should reject a contact without subject', () => {
      const invalidContact = {
        name: 'テストユーザー',
        email: 'test@example.com',
        phone: '03-1234-5678',
        message: 'これはテスト用のお問い合わせメッセージです。',
      };

      const result = contactSchema.safeParse(invalidContact);
      expect(result.success).toBe(false);
    });

    it('should reject a contact without message', () => {
      const invalidContact = {
        name: 'テストユーザー',
        email: 'test@example.com',
        phone: '03-1234-5678',
        subject: 'お問い合わせテスト',
      };

      const result = contactSchema.safeParse(invalidContact);
      expect(result.success).toBe(false);
    });
  });

  describe('contactResponseSchema', () => {
    it('should validate a valid contact response', () => {
      const validResponse = {
        id: 1,
        name: 'テストユーザー',
        email: 'test@example.com',
        phone: '03-1234-5678',
        subject: 'お問い合わせテスト',
        message: 'これはテスト用のお問い合わせメッセージです。',
        status: 'PENDING',
        created_at: '2023-01-01T00:00:00Z',
        updated_at: '2023-01-01T00:00:00Z',
      };

      const result = contactResponseSchema.safeParse(validResponse);
      expect(result.success).toBe(true);
    });

    it('should validate a contact response with null phone', () => {
      const validResponse = {
        id: 1,
        name: 'テストユーザー',
        email: 'test@example.com',
        phone: null,
        subject: 'お問い合わせテスト',
        message: 'これはテスト用のお問い合わせメッセージです。',
        status: 'PENDING',
        created_at: '2023-01-01T00:00:00Z',
        updated_at: '2023-01-01T00:00:00Z',
      };

      const result = contactResponseSchema.safeParse(validResponse);
      expect(result.success).toBe(true);
    });

    it('should reject a contact response with missing fields', () => {
      const invalidResponse = {
        id: 1,
        name: 'テストユーザー',
        email: 'test@example.com',
        // Missing other required fields
      };

      const result = contactResponseSchema.safeParse(invalidResponse);
      expect(result.success).toBe(false);
    });

    it('should reject a contact response with invalid types', () => {
      const invalidResponse = {
        id: '1', // Should be a number
        name: 'テストユーザー',
        email: 'test@example.com',
        phone: '03-1234-5678',
        subject: 'お問い合わせテスト',
        message: 'これはテスト用のお問い合わせメッセージです。',
        status: 'PENDING',
        created_at: '2023-01-01T00:00:00Z',
        updated_at: '2023-01-01T00:00:00Z',
      };

      const result = contactResponseSchema.safeParse(invalidResponse);
      expect(result.success).toBe(false);
    });
  });

  describe('updateContactSchema', () => {
    it('should validate a valid status update', () => {
      const validUpdate = {
        status: 'RESOLVED',
      };

      const result = updateContactSchema.safeParse(validUpdate);
      expect(result.success).toBe(true);
    });

    it('should reject an update without status', () => {
      const invalidUpdate = {
        // Missing status field
      };

      const result = updateContactSchema.safeParse(invalidUpdate);
      expect(result.success).toBe(false);
    });

    it('should reject an update with invalid status type', () => {
      const invalidUpdate = {
        status: 123, // Should be a string
      };

      const result = updateContactSchema.safeParse(invalidUpdate);
      expect(result.success).toBe(false);
    });
  });
});
