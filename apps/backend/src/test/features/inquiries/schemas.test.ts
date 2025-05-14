import { describe, it, expect } from 'vitest';
import { inquirySchema, inquiryResponseSchema } from '../../../features/inquiries/schemas';

describe('Inquiry Schemas', () => {
  describe('inquirySchema', () => {
    it('should validate a valid inquiry', () => {
      const validInquiry = {
        name: 'テストユーザー',
        email: 'test@example.com',
        subject: 'お問い合わせテスト',
        message: 'これはテスト用のお問い合わせメッセージです。'
      };
      
      const result = inquirySchema.safeParse(validInquiry);
      expect(result.success).toBe(true);
    });

    it('should reject an inquiry without name', () => {
      const invalidInquiry = {
        email: 'test@example.com',
        subject: 'お問い合わせテスト',
        message: 'これはテスト用のお問い合わせメッセージです。'
      };
      
      const result = inquirySchema.safeParse(invalidInquiry);
      expect(result.success).toBe(false);
    });

    it('should reject an inquiry with empty name', () => {
      const invalidInquiry = {
        name: '',
        email: 'test@example.com',
        subject: 'お問い合わせテスト',
        message: 'これはテスト用のお問い合わせメッセージです。'
      };
      
      const result = inquirySchema.safeParse(invalidInquiry);
      expect(result.success).toBe(false);
    });

    it('should reject an inquiry with invalid email', () => {
      const invalidInquiry = {
        name: 'テストユーザー',
        email: 'invalid-email',
        subject: 'お問い合わせテスト',
        message: 'これはテスト用のお問い合わせメッセージです。'
      };
      
      const result = inquirySchema.safeParse(invalidInquiry);
      expect(result.success).toBe(false);
    });

    it('should reject an inquiry without subject', () => {
      const invalidInquiry = {
        name: 'テストユーザー',
        email: 'test@example.com',
        message: 'これはテスト用のお問い合わせメッセージです。'
      };
      
      const result = inquirySchema.safeParse(invalidInquiry);
      expect(result.success).toBe(false);
    });

    it('should reject an inquiry without message', () => {
      const invalidInquiry = {
        name: 'テストユーザー',
        email: 'test@example.com',
        subject: 'お問い合わせテスト'
      };
      
      const result = inquirySchema.safeParse(invalidInquiry);
      expect(result.success).toBe(false);
    });
  });

  describe('inquiryResponseSchema', () => {
    it('should validate a valid inquiry response', () => {
      const validResponse = {
        id: 1,
        name: 'テストユーザー',
        email: 'test@example.com',
        subject: 'お問い合わせテスト',
        message: 'これはテスト用のお問い合わせメッセージです。',
        status: 'PENDING',
        created_at: '2023-01-01T00:00:00Z',
        updated_at: '2023-01-01T00:00:00Z'
      };
      
      const result = inquiryResponseSchema.safeParse(validResponse);
      expect(result.success).toBe(true);
    });

    it('should reject an inquiry response with missing fields', () => {
      const invalidResponse = {
        id: 1,
        name: 'テストユーザー',
        email: 'test@example.com'
        // Missing other required fields
      };
      
      const result = inquiryResponseSchema.safeParse(invalidResponse);
      expect(result.success).toBe(false);
    });

    it('should reject an inquiry response with invalid types', () => {
      const invalidResponse = {
        id: '1', // Should be a number
        name: 'テストユーザー',
        email: 'test@example.com',
        subject: 'お問い合わせテスト',
        message: 'これはテスト用のお問い合わせメッセージです。',
        status: 'PENDING',
        created_at: '2023-01-01T00:00:00Z',
        updated_at: '2023-01-01T00:00:00Z'
      };
      
      const result = inquiryResponseSchema.safeParse(invalidResponse);
      expect(result.success).toBe(false);
    });
  });
});