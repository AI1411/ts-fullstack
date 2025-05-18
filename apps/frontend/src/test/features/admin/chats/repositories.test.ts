import { client } from '@/common/utils/client';
import type {
  CreateChatInput,
  CreateChatMessageInput,
} from '@/features/admin/chats/controllers';
import { chatRepository } from '@/features/admin/chats/repositories';
import { beforeEach, describe, expect, it, vi } from 'vitest';

// Define a type for mock responses to avoid using 'any'
type MockResponse = {
  data: string;
  [key: string]: unknown;
};

// Mock the client utility
vi.mock('@/common/utils/client', () => ({
  client: {
    users: {
      ':userId': {
        chats: {
          $get: vi.fn(),
        },
        'unread-messages': {
          $get: vi.fn(),
        },
      },
    },
    chats: {
      $post: vi.fn(),
      ':id': {
        $get: vi.fn(),
      },
      ':chatId': {
        messages: {
          $get: vi.fn(),
          $post: vi.fn(),
        },
        users: {
          ':userId': {
            read: {
              $put: vi.fn(),
            },
          },
        },
      },
    },
  },
}));

describe('Chat Repository', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('getUserChats', () => {
    const userId = 1;
    const mockResponse = { data: 'mock data' };

    it('should call the correct API endpoint', async () => {
      // Mock successful response
      vi.mocked(client.users[':userId'].chats.$get).mockResolvedValue(
        mockResponse as MockResponse
      );

      const result = await chatRepository.getUserChats(userId);

      expect(client.users[':userId'].chats.$get).toHaveBeenCalledWith({
        param: { userId: userId.toString() },
      });
      expect(result).toEqual(mockResponse);
    });
  });

  describe('createChat', () => {
    const chatData: CreateChatInput = {
      creator_id: 1,
      recipient_id: 2,
    };
    const mockResponse = { data: 'mock data' };

    it('should call the correct API endpoint with the right data', async () => {
      // Mock successful response
      vi.mocked(client.chats.$post).mockResolvedValue(
        mockResponse as MockResponse
      );

      const result = await chatRepository.createChat(chatData);

      expect(client.chats.$post).toHaveBeenCalledWith({
        json: chatData,
      });
      expect(result).toEqual(mockResponse);
    });
  });

  describe('getChatById', () => {
    const chatId = 1;
    const mockResponse = { data: 'mock data' };

    it('should call the correct API endpoint', async () => {
      // Mock successful response
      vi.mocked(client.chats[':id'].$get).mockResolvedValue(
        mockResponse as MockResponse
      );

      const result = await chatRepository.getChatById(chatId);

      expect(client.chats[':id'].$get).toHaveBeenCalledWith({
        param: { id: chatId.toString() },
      });
      expect(result).toEqual(mockResponse);
    });
  });

  describe('getChatMessages', () => {
    const chatId = 1;
    const mockResponse = { data: 'mock data' };

    it('should call the correct API endpoint', async () => {
      // Mock successful response
      vi.mocked(client.chats[':chatId'].messages.$get).mockResolvedValue(
        mockResponse as MockResponse
      );

      const result = await chatRepository.getChatMessages(chatId);

      expect(client.chats[':chatId'].messages.$get).toHaveBeenCalledWith({
        param: { chatId: chatId.toString() },
      });
      expect(result).toEqual(mockResponse);
    });
  });

  describe('createChatMessage', () => {
    const chatId = 1;
    const messageData: CreateChatMessageInput = {
      sender_id: 1,
      content: 'Hello',
    };
    const mockResponse = { data: 'mock data' };

    it('should call the correct API endpoint with the right data', async () => {
      // Mock successful response
      vi.mocked(client.chats[':chatId'].messages.$post).mockResolvedValue(
        mockResponse as MockResponse
      );

      const result = await chatRepository.createChatMessage(
        chatId,
        messageData
      );

      expect(client.chats[':chatId'].messages.$post).toHaveBeenCalledWith({
        param: { chatId: chatId.toString() },
        json: messageData,
      });
      expect(result).toEqual(mockResponse);
    });
  });

  describe('markMessagesAsRead', () => {
    const chatId = 1;
    const userId = 1;
    const mockResponse = { data: 'mock data' };

    it('should call the correct API endpoint', async () => {
      // Mock successful response
      vi.mocked(
        client.chats[':chatId'].users[':userId'].read.$put
      ).mockResolvedValue(mockResponse as MockResponse);

      const result = await chatRepository.markMessagesAsRead(chatId, userId);

      expect(
        client.chats[':chatId'].users[':userId'].read.$put
      ).toHaveBeenCalledWith({
        param: {
          chatId: chatId.toString(),
          userId: userId.toString(),
        },
      });
      expect(result).toEqual(mockResponse);
    });
  });

  describe('getUnreadMessageCount', () => {
    const userId = 1;
    const mockResponse = { data: 'mock data' };

    it('should call the correct API endpoint', async () => {
      // Mock successful response
      vi.mocked(
        client.users[':userId']['unread-messages'].$get
      ).mockResolvedValue(mockResponse as MockResponse);

      const result = await chatRepository.getUnreadMessageCount(userId);

      expect(
        client.users[':userId']['unread-messages'].$get
      ).toHaveBeenCalledWith({
        param: { userId: userId.toString() },
      });
      expect(result).toEqual(mockResponse);
    });
  });
});
