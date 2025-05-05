// Chat services
import {
  Chat,
  ChatMessage,
  ChatMessageWithSender,
  ChatWithUser,
  createChat as createChatController,
  createChatMessage as createChatMessageController,
  CreateChatInput,
  CreateChatMessageInput,
  getChatById as getChatByIdController,
  getChatMessages as getChatMessagesController,
  getUserChats as getUserChatsController,
  getUnreadMessageCount as getUnreadMessageCountController,
  markMessagesAsRead as markMessagesAsReadController,
  UnreadMessageCount
} from './controllers';

// Chat service
export const chatService = {
  // Get chats for a user
  getUserChats: async (userId: number): Promise<ChatWithUser[]> => {
    return getUserChatsController(userId);
  },

  // Create a new chat
  createChat: async (chatData: CreateChatInput): Promise<Chat> => {
    return createChatController(chatData);
  },

  // Get a chat by ID
  getChatById: async (id: number): Promise<Chat> => {
    return getChatByIdController(id);
  },

  // Get messages for a chat
  getChatMessages: async (chatId: number): Promise<ChatMessageWithSender[]> => {
    return getChatMessagesController(chatId);
  },

  // Create a new chat message
  createChatMessage: async (chatId: number, messageData: CreateChatMessageInput): Promise<ChatMessage> => {
    return createChatMessageController(chatId, messageData);
  },

  // Mark messages as read
  markMessagesAsRead: async (chatId: number, userId: number): Promise<{ success: boolean; count: number; messages: ChatMessage[] }> => {
    return markMessagesAsReadController(chatId, userId);
  },

  // Get unread message count for a user
  getUnreadMessageCount: async (userId: number): Promise<UnreadMessageCount> => {
    return getUnreadMessageCountController(userId);
  }
};
