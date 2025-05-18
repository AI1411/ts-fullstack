import { describe, expect, it } from 'vitest';
import { chatMessageSchema, chatSchema } from '../../../features/chats/schemas';

describe('Chat Schemas', () => {
  describe('chatSchema', () => {
    it('should validate a valid chat object', () => {
      const validChat = {
        creator_id: 1,
        recipient_id: 2,
      };

      const result = chatSchema.safeParse(validChat);
      expect(result.success).toBe(true);
    });

    it('should validate a valid chat object with id', () => {
      const validChat = {
        id: 1,
        creator_id: 1,
        recipient_id: 2,
      };

      const result = chatSchema.safeParse(validChat);
      expect(result.success).toBe(true);
    });

    it('should reject an invalid chat object missing creator_id', () => {
      const invalidChat = {
        recipient_id: 2,
      };

      const result = chatSchema.safeParse(invalidChat);
      expect(result.success).toBe(false);
    });

    it('should reject an invalid chat object missing recipient_id', () => {
      const invalidChat = {
        creator_id: 1,
      };

      const result = chatSchema.safeParse(invalidChat);
      expect(result.success).toBe(false);
    });

    it('should reject an invalid chat object with non-numeric ids', () => {
      const invalidChat = {
        creator_id: '1',
        recipient_id: '2',
      };

      const result = chatSchema.safeParse(invalidChat);
      expect(result.success).toBe(false);
    });
  });

  describe('chatMessageSchema', () => {
    it('should validate a valid chat message object', () => {
      const validMessage = {
        chat_id: 1,
        sender_id: 1,
        content: 'Hello!',
      };

      const result = chatMessageSchema.safeParse(validMessage);
      expect(result.success).toBe(true);

      // Check that is_read defaults to false
      if (result.success) {
        expect(result.data.is_read).toBe(false);
      }
    });

    it('should validate a valid chat message object with all fields', () => {
      const validMessage = {
        id: 1,
        chat_id: 1,
        sender_id: 1,
        content: 'Hello!',
        is_read: true,
      };

      const result = chatMessageSchema.safeParse(validMessage);
      expect(result.success).toBe(true);
    });

    it('should reject an invalid chat message object with empty content', () => {
      const invalidMessage = {
        chat_id: 1,
        sender_id: 1,
        content: '',
      };

      const result = chatMessageSchema.safeParse(invalidMessage);
      expect(result.success).toBe(false);
    });

    it('should reject an invalid chat message object missing required fields', () => {
      const invalidMessage = {
        chat_id: 1,
      };

      const result = chatMessageSchema.safeParse(invalidMessage);
      expect(result.success).toBe(false);
    });

    it('should reject an invalid chat message object with non-numeric ids', () => {
      const invalidMessage = {
        chat_id: '1',
        sender_id: '1',
        content: 'Hello!',
      };

      const result = chatMessageSchema.safeParse(invalidMessage);
      expect(result.success).toBe(false);
    });
  });
});
