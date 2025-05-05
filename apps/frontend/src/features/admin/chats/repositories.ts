// Chat repositories
import { client } from '@/common/utils/client';
import { CreateChatInput, CreateChatMessageInput } from './controllers';

// Chat repository
export const chatRepository = {
  // Get chats for a user
  getUserChats: async (userId: number) => {
    return client.users[':userId'].chats.$get({
      param: { userId: userId.toString() }
    });
  },

  // Create a new chat
  createChat: async (chatData: CreateChatInput) => {
    return client.chats.$post({
      json: chatData,
    });
  },

  // Get a chat by ID
  getChatById: async (id: number) => {
    return client.chats[':id'].$get({
      param: { id: id.toString() }
    });
  },

  // Get messages for a chat
  getChatMessages: async (chatId: number) => {
    return client.chats[':chatId'].messages.$get({
      param: { chatId: chatId.toString() }
    });
  },

  // Create a new chat message
  createChatMessage: async (chatId: number, messageData: CreateChatMessageInput) => {
    return client.chats[':chatId'].messages.$post({
      param: { chatId: chatId.toString() },
      json: messageData
    });
  },

  // Mark messages as read
  markMessagesAsRead: async (chatId: number, userId: number) => {
    return client.chats[':chatId'].users[':userId'].read.$put({
      param: {
        chatId: chatId.toString(),
        userId: userId.toString()
      }
    });
  },

  // Get unread message count for a user
  getUnreadMessageCount: async (userId: number) => {
    return client.users[':userId']['unread-messages'].$get({
      param: { userId: userId.toString() }
    });
  }
};
