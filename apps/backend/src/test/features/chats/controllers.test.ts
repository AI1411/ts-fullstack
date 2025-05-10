import { describe, it, expect, vi, beforeEach } from 'vitest';
import { 
  createChat, 
  getUserChats, 
  getChatById, 
  createChatMessage, 
  getChatMessages, 
  markMessagesAsRead, 
  getUnreadMessageCount 
} from '../../../features/chats/controllers';
import { chatsTable, chatMessagesTable, usersTable } from '../../../db/schema';
import * as dbModule from '../../../common/utils/db';

// Mock chat data
const mockChat = {
  id: 1,
  creator_id: 1,
  recipient_id: 2,
  created_at: new Date(),
  updated_at: new Date()
};

// Mock chat message data
const mockChatMessage = {
  id: 1,
  chat_id: 1,
  sender_id: 1,
  content: 'Hello!',
  is_read: false,
  created_at: new Date(),
  updated_at: new Date()
};

// Mock user data
const mockUser = {
  id: 1,
  name: 'Test User',
  email: 'test@example.com',
  created_at: new Date(),
  updated_at: new Date()
};

// Mock the database module
vi.mock('../../../common/utils/db', () => ({
  getDB: vi.fn()
}));

// Mock context
const createMockContext = (body = {}, params = {}, query = {}) => ({
  req: {
    valid: vi.fn().mockReturnValue(body),
    param: vi.fn((key) => params[key]),
    query: vi.fn((key) => query[key])
  },
  json: vi.fn().mockImplementation((data, status) => ({ data, status })),
  env: {
    DATABASE_URL: 'postgres://test:test@localhost:5432/test'
  }
});

// Mock DB client
const mockDbClient = {
  select: vi.fn().mockReturnThis(),
  from: vi.fn().mockReturnThis(),
  where: vi.fn().mockReturnThis(),
  innerJoin: vi.fn().mockReturnThis(),
  leftJoin: vi.fn().mockReturnThis(),
  on: vi.fn().mockReturnThis(),
  orderBy: vi.fn().mockReturnThis(),
  insert: vi.fn().mockReturnThis(),
  values: vi.fn().mockReturnThis(),
  update: vi.fn().mockReturnThis(),
  set: vi.fn().mockReturnThis(),
  delete: vi.fn().mockReturnThis(),
  returning: vi.fn().mockResolvedValue([mockChat]),
  count: vi.fn().mockReturnThis(),
  as: vi.fn().mockReturnThis()
};

describe('Chat Controllers', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(dbModule.getDB).mockReturnValue(mockDbClient);
  });

  describe('createChat', () => {
    it('should create a new chat and return it', async () => {
      const mockBody = {
        creator_id: 1,
        recipient_id: 2
      };
      const mockContext = createMockContext(mockBody);

      const result = await createChat(mockContext);

      expect(mockContext.req.valid).toHaveBeenCalledWith('json');
      expect(mockContext.json).toHaveBeenCalledWith({ chat: mockChat });
    });

    it('should handle errors', async () => {
      const mockBody = {
        creator_id: 1,
        recipient_id: 2
      };
      const mockContext = createMockContext(mockBody);

      // Override the mock to throw an error
      mockDbClient.returning.mockRejectedValueOnce(new Error('Database error'));

      const result = await createChat(mockContext);

      expect(mockContext.json).toHaveBeenCalledWith({ error: 'Database error' }, 500);
    });
  });

  describe('getUserChats', () => {
    it('should return all chats for a user', async () => {
      const mockContext = createMockContext({}, { userId: '1' });
      mockDbClient.select.mockReturnThis();
      mockDbClient.from.mockReturnThis();
      mockDbClient.leftJoin.mockReturnThis();
      mockDbClient.where.mockResolvedValueOnce([{
        chat: mockChat,
        otherUser: mockUser
      }]);

      const result = await getUserChats(mockContext);

      expect(mockContext.req.param).toHaveBeenCalledWith('userId');
      expect(mockContext.json).toHaveBeenCalledWith({ 
        chats: [{
          chat: mockChat,
          otherUser: mockUser
        }] 
      });
    });

    it('should handle errors', async () => {
      const mockContext = createMockContext({}, { userId: '1' });
      mockDbClient.select.mockReturnThis();
      mockDbClient.from.mockReturnThis();
      mockDbClient.where.mockRejectedValueOnce(new Error('Database error'));

      const result = await getUserChats(mockContext);

      expect(mockContext.json).toHaveBeenCalledWith({ error: 'Database error' }, 500);
    });
  });

  describe('getChatById', () => {
    it('should return a chat by id', async () => {
      const mockContext = createMockContext({}, { id: '1' });
      mockDbClient.select.mockReturnThis();
      mockDbClient.from.mockReturnThis();
      mockDbClient.where.mockResolvedValueOnce([mockChat]);

      const result = await getChatById(mockContext);

      expect(mockContext.req.param).toHaveBeenCalledWith('id');
      expect(mockContext.json).toHaveBeenCalledWith({ chat: mockChat });
    });

    it('should return 404 if chat not found', async () => {
      const mockContext = createMockContext({}, { id: '999' });
      mockDbClient.select.mockReturnThis();
      mockDbClient.from.mockReturnThis();
      mockDbClient.where.mockResolvedValueOnce([]);

      const result = await getChatById(mockContext);

      expect(mockContext.json).toHaveBeenCalledWith({ error: 'Chat not found' }, 404);
    });

    it('should handle errors', async () => {
      const mockContext = createMockContext({}, { id: '1' });
      mockDbClient.select.mockReturnThis();
      mockDbClient.from.mockReturnThis();
      mockDbClient.where.mockRejectedValueOnce(new Error('Database error'));

      const result = await getChatById(mockContext);

      expect(mockContext.json).toHaveBeenCalledWith({ error: 'Database error' }, 500);
    });
  });

  describe('createChatMessage', () => {
    it('should create a new chat message and return it', async () => {
      const mockBody = {
        chat_id: 1,
        sender_id: 1,
        content: 'Hello!'
      };
      const mockContext = createMockContext(mockBody);

      // Mock chat existence check
      mockDbClient.select.mockReturnThis();
      mockDbClient.from.mockReturnThis();
      mockDbClient.where.mockResolvedValueOnce([mockChat]);

      // Mock message creation
      mockDbClient.insert.mockReturnThis();
      mockDbClient.values.mockReturnThis();
      mockDbClient.returning.mockResolvedValueOnce([mockChatMessage]);

      const result = await createChatMessage(mockContext);

      expect(mockContext.req.valid).toHaveBeenCalledWith('json');
      expect(mockContext.json).toHaveBeenCalledWith({ message: mockChatMessage });
    });

    it('should return 404 if chat not found', async () => {
      const mockBody = {
        chat_id: 1,
        sender_id: 1,
        content: 'Hello!'
      };
      const mockContext = createMockContext(mockBody);

      // Mock chat existence check - return empty array
      mockDbClient.select.mockReturnThis();
      mockDbClient.from.mockReturnThis();
      mockDbClient.where.mockResolvedValueOnce([]);

      const result = await createChatMessage(mockContext);

      expect(mockContext.json).toHaveBeenCalledWith({ error: 'Chat not found' }, 404);
    });

    it('should handle errors', async () => {
      const mockBody = {
        chat_id: 1,
        sender_id: 1,
        content: 'Hello!'
      };
      const mockContext = createMockContext(mockBody);

      // Override the mock to throw an error
      mockDbClient.select.mockReturnThis();
      mockDbClient.from.mockReturnThis();
      mockDbClient.where.mockRejectedValueOnce(new Error('Database error'));

      const result = await createChatMessage(mockContext);

      expect(mockContext.json).toHaveBeenCalledWith({ error: 'Database error' }, 500);
    });
  });

  describe('getChatMessages', () => {
    it('should return all messages for a chat', async () => {
      const mockContext = createMockContext({}, { chatId: '1' });

      // Mock chat existence check
      mockDbClient.select.mockReturnThis();
      mockDbClient.from.mockReturnThis();
      mockDbClient.where.mockResolvedValueOnce([mockChat]);

      // Mock message retrieval
      mockDbClient.select.mockReturnThis();
      mockDbClient.from.mockReturnThis();
      mockDbClient.leftJoin.mockReturnThis();
      mockDbClient.where.mockReturnThis();
      mockDbClient.orderBy.mockResolvedValueOnce([{
        message: mockChatMessage,
        sender: {
          id: mockUser.id,
          name: mockUser.name
        }
      }]);

      const result = await getChatMessages(mockContext);

      expect(mockContext.req.param).toHaveBeenCalledWith('chatId');
      expect(mockContext.json).toHaveBeenCalledWith({ 
        messages: [{
          message: mockChatMessage,
          sender: {
            id: mockUser.id,
            name: mockUser.name
          }
        }] 
      });
    });

    it('should return 404 if chat not found', async () => {
      const mockContext = createMockContext({}, { chatId: '1' });

      // Mock chat existence check - return empty array
      mockDbClient.select.mockReturnThis();
      mockDbClient.from.mockReturnThis();
      mockDbClient.where.mockResolvedValueOnce([]);

      const result = await getChatMessages(mockContext);

      expect(mockContext.json).toHaveBeenCalledWith({ error: 'Chat not found' }, 404);
    });

    it('should handle errors', async () => {
      const mockContext = createMockContext({}, { chatId: '1' });
      mockDbClient.select.mockReturnThis();
      mockDbClient.from.mockReturnThis();
      mockDbClient.where.mockRejectedValueOnce(new Error('Database error'));

      const result = await getChatMessages(mockContext);

      expect(mockContext.json).toHaveBeenCalledWith({ error: 'Database error' }, 500);
    });
  });

  describe('markMessagesAsRead', () => {
    it('should mark messages as read and return success', async () => {
      const mockParams = {
        chatId: '1',
        userId: '2'
      };
      const mockContext = createMockContext({}, mockParams);

      // Mock chat existence check
      mockDbClient.select.mockReturnThis();
      mockDbClient.from.mockReturnThis();
      mockDbClient.where.mockResolvedValueOnce([mockChat]);

      // Mock update operation
      mockDbClient.update.mockReturnThis();
      mockDbClient.set.mockReturnThis();
      mockDbClient.where.mockReturnThis();
      mockDbClient.returning.mockResolvedValueOnce([{ ...mockChatMessage, is_read: true }]);

      const result = await markMessagesAsRead(mockContext);

      expect(mockContext.req.param).toHaveBeenCalledWith('chatId');
      expect(mockContext.req.param).toHaveBeenCalledWith('userId');
      expect(mockContext.json).toHaveBeenCalledWith({ 
        success: true,
        count: 1,
        messages: [{ ...mockChatMessage, is_read: true }]
      });
    });

    it('should return 404 if chat not found', async () => {
      const mockParams = {
        chatId: '1',
        userId: '2'
      };
      const mockContext = createMockContext({}, mockParams);

      // Mock chat existence check - return empty array
      mockDbClient.select.mockReturnThis();
      mockDbClient.from.mockReturnThis();
      mockDbClient.where.mockResolvedValueOnce([]);

      const result = await markMessagesAsRead(mockContext);

      expect(mockContext.json).toHaveBeenCalledWith({ error: 'Chat not found' }, 404);
    });

    it('should handle errors', async () => {
      const mockParams = {
        chatId: '1',
        userId: '2'
      };
      const mockContext = createMockContext({}, mockParams);

      // Override the mock to throw an error
      mockDbClient.select.mockReturnThis();
      mockDbClient.from.mockReturnThis();
      mockDbClient.where.mockRejectedValueOnce(new Error('Database error'));

      const result = await markMessagesAsRead(mockContext);

      expect(mockContext.json).toHaveBeenCalledWith({ error: 'Database error' }, 500);
    });
  });

  describe('getUnreadMessageCount', () => {
    it('should return unread message count for a user', async () => {
      const mockContext = createMockContext({}, { userId: '1' });

      // Mock chats retrieval
      mockDbClient.select.mockReturnThis();
      mockDbClient.from.mockReturnThis();
      mockDbClient.where.mockResolvedValueOnce([mockChat]);

      // Mock unread messages retrieval
      mockDbClient.select.mockReturnThis();
      mockDbClient.from.mockReturnThis();
      mockDbClient.where.mockResolvedValueOnce([mockChatMessage, mockChatMessage]);

      const result = await getUnreadMessageCount(mockContext);

      expect(mockContext.req.param).toHaveBeenCalledWith('userId');
      expect(mockContext.json).toHaveBeenCalledWith({ 
        unreadCount: 2,
        chats: [mockChat.id]
      });
    });

    it('should handle errors', async () => {
      const mockContext = createMockContext({}, { userId: '1' });
      mockDbClient.select.mockReturnThis();
      mockDbClient.from.mockReturnThis();
      mockDbClient.where.mockRejectedValueOnce(new Error('Database error'));

      const result = await getUnreadMessageCount(mockContext);

      expect(mockContext.json).toHaveBeenCalledWith({ error: 'Database error' }, 500);
    });
  });
});
