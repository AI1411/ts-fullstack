// Chat services
import {
  type Chat,
  type ChatMessage,
  type ChatMessageWithSender,
  type ChatWithUser,
  type CreateChatInput,
  type CreateChatMessageInput,
  type UnreadMessageCount,
  createChat as createChatController,
  createChatMessage as createChatMessageController,
  getChatById as getChatByIdController,
  getChatMessages as getChatMessagesController,
  getUnreadMessageCount as getUnreadMessageCountController,
  getUserChats as getUserChatsController,
  markMessagesAsRead as markMessagesAsReadController,
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
  createChatMessage: async (
    chatId: number,
    messageData: CreateChatMessageInput
  ): Promise<ChatMessage> => {
    return createChatMessageController(chatId, messageData);
  },

  // Mark messages as read
  markMessagesAsRead: async (
    chatId: number,
    userId: number
  ): Promise<{ success: boolean; count: number; messages: ChatMessage[] }> => {
    return markMessagesAsReadController(chatId, userId);
  },

  // Get unread message count for a user
  getUnreadMessageCount: async (
    userId: number
  ): Promise<UnreadMessageCount> => {
    return getUnreadMessageCountController(userId);
  },
};
