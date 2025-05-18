import * as controllers from '@/features/admin/chats/controllers';
import type {
  Chat,
  ChatMessage,
  ChatMessageWithSender,
  ChatWithUser,
  UnreadMessageCount,
} from '@/features/admin/chats/controllers';
import { chatService } from '@/features/admin/chats/services';
import { beforeEach, describe, expect, it, vi } from 'vitest';

// Mock the controllers
vi.mock('@/features/admin/chats/controllers', () => ({
  getUserChats: vi.fn(),
  createChat: vi.fn(),
  getChatById: vi.fn(),
  getChatMessages: vi.fn(),
  createChatMessage: vi.fn(),
  markMessagesAsRead: vi.fn(),
  getUnreadMessageCount: vi.fn(),
  // Re-export types
  Chat: {},
  ChatWithUser: {},
  ChatMessage: {},
  ChatMessageWithSender: {},
  CreateChatInput: {},
  CreateChatMessageInput: {},
  UnreadMessageCount: {},
}));

describe('Chat Service', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('getUserChats', () => {
    const userId = 1;
    const mockChats: ChatWithUser[] = [
      {
        chat: {
          id: 1,
          creator_id: 1,
          recipient_id: 2,
          created_at: '2023-01-01T00:00:00Z',
          updated_at: '2023-01-01T00:00:00Z',
        },
        otherUser: {
          id: 2,
          name: 'Test User',
        },
      },
    ];

    it('should call the controller method with the correct arguments', async () => {
      // Mock successful response
      vi.mocked(controllers.getUserChats).mockResolvedValue(mockChats);

      const result = await chatService.getUserChats(userId);

      expect(controllers.getUserChats).toHaveBeenCalledWith(userId);
      expect(result).toEqual(mockChats);
    });
  });

  describe('createChat', () => {
    const chatData = {
      creator_id: 1,
      recipient_id: 2,
    };
    const mockChat: Chat = {
      id: 1,
      creator_id: 1,
      recipient_id: 2,
      created_at: '2023-01-01T00:00:00Z',
      updated_at: '2023-01-01T00:00:00Z',
    };

    it('should call the controller method with the correct arguments', async () => {
      // Mock successful response
      vi.mocked(controllers.createChat).mockResolvedValue(mockChat);

      const result = await chatService.createChat(chatData);

      expect(controllers.createChat).toHaveBeenCalledWith(chatData);
      expect(result).toEqual(mockChat);
    });
  });

  describe('getChatById', () => {
    const chatId = 1;
    const mockChat: Chat = {
      id: 1,
      creator_id: 1,
      recipient_id: 2,
      created_at: '2023-01-01T00:00:00Z',
      updated_at: '2023-01-01T00:00:00Z',
    };

    it('should call the controller method with the correct arguments', async () => {
      // Mock successful response
      vi.mocked(controllers.getChatById).mockResolvedValue(mockChat);

      const result = await chatService.getChatById(chatId);

      expect(controllers.getChatById).toHaveBeenCalledWith(chatId);
      expect(result).toEqual(mockChat);
    });
  });

  describe('getChatMessages', () => {
    const chatId = 1;
    const mockMessages: ChatMessageWithSender[] = [
      {
        message: {
          id: 1,
          chat_id: 1,
          sender_id: 1,
          content: 'Hello',
          is_read: false,
          created_at: '2023-01-01T00:00:00Z',
          updated_at: '2023-01-01T00:00:00Z',
        },
        sender: {
          id: 1,
          name: 'Test User',
        },
      },
    ];

    it('should call the controller method with the correct arguments', async () => {
      // Mock successful response
      vi.mocked(controllers.getChatMessages).mockResolvedValue(mockMessages);

      const result = await chatService.getChatMessages(chatId);

      expect(controllers.getChatMessages).toHaveBeenCalledWith(chatId);
      expect(result).toEqual(mockMessages);
    });
  });

  describe('createChatMessage', () => {
    const chatId = 1;
    const messageData = {
      sender_id: 1,
      content: 'Hello',
    };
    const mockMessage: ChatMessage = {
      id: 1,
      chat_id: 1,
      sender_id: 1,
      content: 'Hello',
      is_read: false,
      created_at: '2023-01-01T00:00:00Z',
      updated_at: '2023-01-01T00:00:00Z',
    };

    it('should call the controller method with the correct arguments', async () => {
      // Mock successful response
      vi.mocked(controllers.createChatMessage).mockResolvedValue(mockMessage);

      const result = await chatService.createChatMessage(chatId, messageData);

      expect(controllers.createChatMessage).toHaveBeenCalledWith(
        chatId,
        messageData
      );
      expect(result).toEqual(mockMessage);
    });
  });

  describe('markMessagesAsRead', () => {
    const chatId = 1;
    const userId = 1;
    const mockResult = {
      success: true,
      count: 2,
      messages: [
        {
          id: 1,
          chat_id: 1,
          sender_id: 2,
          content: 'Hello',
          is_read: true,
          created_at: '2023-01-01T00:00:00Z',
          updated_at: '2023-01-01T00:00:00Z',
        },
        {
          id: 2,
          chat_id: 1,
          sender_id: 2,
          content: 'How are you?',
          is_read: true,
          created_at: '2023-01-01T00:00:00Z',
          updated_at: '2023-01-01T00:00:00Z',
        },
      ],
    };

    it('should call the controller method with the correct arguments', async () => {
      // Mock successful response
      vi.mocked(controllers.markMessagesAsRead).mockResolvedValue(mockResult);

      const result = await chatService.markMessagesAsRead(chatId, userId);

      expect(controllers.markMessagesAsRead).toHaveBeenCalledWith(
        chatId,
        userId
      );
      expect(result).toEqual(mockResult);
    });
  });

  describe('getUnreadMessageCount', () => {
    const userId = 1;
    const mockResult: UnreadMessageCount = {
      unreadCount: 5,
      chats: [1, 2, 3],
    };

    it('should call the controller method with the correct arguments', async () => {
      // Mock successful response
      vi.mocked(controllers.getUnreadMessageCount).mockResolvedValue(
        mockResult
      );

      const result = await chatService.getUnreadMessageCount(userId);

      expect(controllers.getUnreadMessageCount).toHaveBeenCalledWith(userId);
      expect(result).toEqual(mockResult);
    });
  });
});
