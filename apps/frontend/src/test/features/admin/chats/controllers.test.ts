import {
  type Chat,
  type ChatMessage,
  type ChatMessageWithSender,
  type ChatWithUser,
  type CreateChatInput,
  type CreateChatMessageInput,
  type UnreadMessageCount,
  createChat,
  createChatMessage,
  getChatById,
  getChatMessages,
  getUnreadMessageCount,
  getUserChats,
  markMessagesAsRead,
} from '@/features/admin/chats/controllers';
import { chatRepository } from '@/features/admin/chats/repositories';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

// Mock the chat repository
vi.mock('@/features/admin/chats/repositories', () => ({
  chatRepository: {
    getUserChats: vi.fn(),
    createChat: vi.fn(),
    getChatById: vi.fn(),
    getChatMessages: vi.fn(),
    createChatMessage: vi.fn(),
    markMessagesAsRead: vi.fn(),
    getUnreadMessageCount: vi.fn(),
  },
}));

describe('Chat Controllers', () => {
  // Spy on console.error to prevent actual console output during tests
  let consoleErrorSpy: vi.SpyInstance;

  beforeEach(() => {
    consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    vi.clearAllMocks();
    consoleErrorSpy.mockRestore();
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

    it('should return chats when API call is successful', async () => {
      // Mock successful response
      vi.mocked(chatRepository.getUserChats).mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({ chats: mockChats }),
        text: () => Promise.resolve(JSON.stringify({ chats: mockChats })),
        headers: new Headers({ 'content-type': 'application/json' }),
      } as unknown as Response);

      const result = await getUserChats(userId);
      expect(result).toEqual(mockChats);
      expect(chatRepository.getUserChats).toHaveBeenCalledWith(userId);
    });

    it('should throw an error when API call fails', async () => {
      // Mock failed response
      vi.mocked(chatRepository.getUserChats).mockResolvedValue({
        ok: false,
        status: 500,
        statusText: 'Internal Server Error',
      } as Response);

      await expect(getUserChats(userId)).rejects.toThrow(
        `Failed to fetch chats for user ${userId}`
      );
      expect(chatRepository.getUserChats).toHaveBeenCalledWith(userId);
      expect(consoleErrorSpy).toHaveBeenCalled();
    });

    it('should handle HTML response instead of JSON', async () => {
      // Mock HTML response
      vi.mocked(chatRepository.getUserChats).mockResolvedValue({
        ok: true,
        headers: new Headers({ 'content-type': 'text/html' }),
        text: () =>
          Promise.resolve('<!DOCTYPE html><html><body>Error</body></html>'),
      } as unknown as Response);

      await expect(getUserChats(userId)).rejects.toThrow(
        'Invalid JSON response from server'
      );
      expect(chatRepository.getUserChats).toHaveBeenCalledWith(userId);
      expect(consoleErrorSpy).toHaveBeenCalled();
    });

    it('should handle invalid JSON response', async () => {
      // Mock invalid JSON response
      vi.mocked(chatRepository.getUserChats).mockResolvedValue({
        ok: true,
        headers: new Headers({ 'content-type': 'application/json' }),
        text: () => Promise.resolve('Not valid JSON'),
      } as unknown as Response);

      await expect(getUserChats(userId)).rejects.toThrow(
        'Invalid JSON response from server'
      );
      expect(chatRepository.getUserChats).toHaveBeenCalledWith(userId);
      expect(consoleErrorSpy).toHaveBeenCalled();
    });
  });

  describe('createChat', () => {
    const chatData: CreateChatInput = {
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

    it('should return a chat when API call is successful', async () => {
      // Mock successful response
      vi.mocked(chatRepository.createChat).mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({ chat: mockChat }),
      } as unknown as Response);

      const result = await createChat(chatData);
      expect(result).toEqual(mockChat);
      expect(chatRepository.createChat).toHaveBeenCalledWith(chatData);
    });

    it('should throw an error when API call fails', async () => {
      // Mock failed response
      const errorMessage = 'Failed to create chat';
      vi.mocked(chatRepository.createChat).mockResolvedValue({
        ok: false,
        text: () => Promise.resolve(errorMessage),
      } as unknown as Response);

      await expect(createChat(chatData)).rejects.toThrow(errorMessage);
      expect(chatRepository.createChat).toHaveBeenCalledWith(chatData);
      expect(consoleErrorSpy).toHaveBeenCalled();
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

    it('should return a chat when API call is successful', async () => {
      // Mock successful response
      vi.mocked(chatRepository.getChatById).mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({ chat: mockChat }),
      } as unknown as Response);

      const result = await getChatById(chatId);
      expect(result).toEqual(mockChat);
      expect(chatRepository.getChatById).toHaveBeenCalledWith(chatId);
    });

    it('should throw an error when API call fails', async () => {
      // Mock failed response
      vi.mocked(chatRepository.getChatById).mockResolvedValue({
        ok: false,
      } as unknown as Response);

      await expect(getChatById(chatId)).rejects.toThrow('Chat not found');
      expect(chatRepository.getChatById).toHaveBeenCalledWith(chatId);
      expect(consoleErrorSpy).toHaveBeenCalled();
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

    it('should return messages when API call is successful', async () => {
      // Mock successful response
      vi.mocked(chatRepository.getChatMessages).mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({ messages: mockMessages }),
      } as unknown as Response);

      const result = await getChatMessages(chatId);
      expect(result).toEqual(mockMessages);
      expect(chatRepository.getChatMessages).toHaveBeenCalledWith(chatId);
    });

    it('should throw an error when API call fails', async () => {
      // Mock failed response
      vi.mocked(chatRepository.getChatMessages).mockResolvedValue({
        ok: false,
      } as unknown as Response);

      await expect(getChatMessages(chatId)).rejects.toThrow(
        'Failed to fetch chat messages'
      );
      expect(chatRepository.getChatMessages).toHaveBeenCalledWith(chatId);
      expect(consoleErrorSpy).toHaveBeenCalled();
    });
  });

  describe('createChatMessage', () => {
    const chatId = 1;
    const messageData: CreateChatMessageInput = {
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

    it('should return a message when API call is successful', async () => {
      // Mock successful response
      vi.mocked(chatRepository.createChatMessage).mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({ message: mockMessage }),
      } as unknown as Response);

      const result = await createChatMessage(chatId, messageData);
      expect(result).toEqual(mockMessage);
      expect(chatRepository.createChatMessage).toHaveBeenCalledWith(chatId, {
        ...messageData,
        chat_id: chatId,
      });
    });

    it('should throw an error when API call fails', async () => {
      // Mock failed response
      const errorMessage = 'Failed to create message';
      vi.mocked(chatRepository.createChatMessage).mockResolvedValue({
        ok: false,
        text: () => Promise.resolve(errorMessage),
      } as unknown as Response);

      await expect(createChatMessage(chatId, messageData)).rejects.toThrow(
        errorMessage
      );
      expect(chatRepository.createChatMessage).toHaveBeenCalledWith(chatId, {
        ...messageData,
        chat_id: chatId,
      });
      expect(consoleErrorSpy).toHaveBeenCalled();
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

    it('should return result when API call is successful', async () => {
      // Mock successful response
      vi.mocked(chatRepository.markMessagesAsRead).mockResolvedValue({
        ok: true,
        json: () => Promise.resolve(mockResult),
      } as unknown as Response);

      const result = await markMessagesAsRead(chatId, userId);
      expect(result).toEqual(mockResult);
      expect(chatRepository.markMessagesAsRead).toHaveBeenCalledWith(
        chatId,
        userId
      );
    });

    it('should throw an error when API call fails', async () => {
      // Mock failed response
      vi.mocked(chatRepository.markMessagesAsRead).mockResolvedValue({
        ok: false,
      } as unknown as Response);

      await expect(markMessagesAsRead(chatId, userId)).rejects.toThrow(
        'Failed to mark messages as read'
      );
      expect(chatRepository.markMessagesAsRead).toHaveBeenCalledWith(
        chatId,
        userId
      );
      expect(consoleErrorSpy).toHaveBeenCalled();
    });
  });

  describe('getUnreadMessageCount', () => {
    const userId = 1;
    const mockResult: UnreadMessageCount = {
      unreadCount: 5,
      chats: [1, 2, 3],
    };

    it('should return unread message count when API call is successful', async () => {
      // Mock successful response
      vi.mocked(chatRepository.getUnreadMessageCount).mockResolvedValue({
        ok: true,
        json: () => Promise.resolve(mockResult),
      } as unknown as Response);

      const result = await getUnreadMessageCount(userId);
      expect(result).toEqual(mockResult);
      expect(chatRepository.getUnreadMessageCount).toHaveBeenCalledWith(userId);
    });

    it('should throw an error when API call fails', async () => {
      // Mock failed response
      vi.mocked(chatRepository.getUnreadMessageCount).mockResolvedValue({
        ok: false,
      } as unknown as Response);

      await expect(getUnreadMessageCount(userId)).rejects.toThrow(
        'Failed to fetch unread message count'
      );
      expect(chatRepository.getUnreadMessageCount).toHaveBeenCalledWith(userId);
      expect(consoleErrorSpy).toHaveBeenCalled();
    });
  });
});
