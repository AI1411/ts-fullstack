// Chat controllers
import { chatRepository } from './repositories';

// Types
export interface Chat {
  id: number;
  creator_id: number;
  recipient_id: number;
  created_at: string;
  updated_at: string;
}

export interface ChatWithUser {
  chat: Chat;
  otherUser: {
    id: number;
    name: string;
  };
}

export interface ChatMessage {
  id: number;
  chat_id: number;
  sender_id: number;
  content: string;
  is_read: boolean;
  created_at: string;
  updated_at: string;
}

export interface ChatMessageWithSender {
  message: ChatMessage;
  sender: {
    id: number;
    name: string;
  };
}

export interface CreateChatInput {
  creator_id: number;
  recipient_id: number;
}

export interface CreateChatMessageInput {
  chat_id?: number; // Optional because it can be derived from the URL
  sender_id: number;
  content: string;
  is_read?: boolean;
}

export interface UnreadMessageCount {
  unreadCount: number;
  chats: number[];
}

// Get all chats for a user
export const getUserChats = async (userId: number): Promise<ChatWithUser[]> => {
  try {
    const response = await chatRepository.getUserChats(userId);
    if (!response.ok) {
      throw new Error(
        `Failed to fetch user chats: ${response.status} ${response.statusText}`
      );
    }
    try {
      // Check if response is text/html instead of application/json
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('text/html')) {
        console.error('Received HTML response instead of JSON');
        throw new Error('Invalid JSON response from server');
      }

      const text = await response.text();
      // Check if the response starts with HTML doctype or tags
      if (
        text.trim().startsWith('<!DOCTYPE') ||
        text.trim().startsWith('<html')
      ) {
        console.error('Received HTML response instead of JSON');
        throw new Error('Invalid JSON response from server');
      }

      const data = JSON.parse(text);
      return data.chats || [];
    } catch (jsonError) {
      console.error('Error parsing JSON response:', jsonError);
      throw new Error('Invalid JSON response from server');
    }
  } catch (error) {
    console.error(`Error fetching chats for user ${userId}:`, error);
    // If the error is from JSON parsing, rethrow it
    if (
      error instanceof Error &&
      error.message === 'Invalid JSON response from server'
    ) {
      throw error;
    }
    // Otherwise, throw a new error
    throw new Error(`Failed to fetch chats for user ${userId}`);
  }
};

// Create a new chat
export const createChat = async (chatData: CreateChatInput): Promise<Chat> => {
  try {
    const response = await chatRepository.createChat(chatData);
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(errorText);
    }
    const { chat } = await response.json();
    return chat;
  } catch (error) {
    console.error('Error creating chat:', error);
    throw error;
  }
};

// Get a chat by ID
export const getChatById = async (id: number): Promise<Chat> => {
  try {
    const response = await chatRepository.getChatById(id);
    if (!response.ok) {
      throw new Error('Chat not found');
    }
    const { chat } = await response.json();
    return chat;
  } catch (error) {
    console.error(`Error fetching chat ${id}:`, error);
    throw error;
  }
};

// Get messages for a chat
export const getChatMessages = async (
  chatId: number
): Promise<ChatMessageWithSender[]> => {
  try {
    const response = await chatRepository.getChatMessages(chatId);
    if (!response.ok) {
      throw new Error('Failed to fetch chat messages');
    }
    const { messages } = await response.json();
    return messages;
  } catch (error) {
    console.error(`Error fetching messages for chat ${chatId}:`, error);
    throw error;
  }
};

// Create a new chat message
export const createChatMessage = async (
  chatId: number,
  messageData: CreateChatMessageInput
): Promise<ChatMessage> => {
  try {
    // Ensure chat_id is set
    const data = {
      ...messageData,
      chat_id: chatId,
    };

    const response = await chatRepository.createChatMessage(chatId, data);
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(errorText);
    }
    const { message } = await response.json();
    return message;
  } catch (error) {
    console.error('Error creating chat message:', error);
    throw error;
  }
};

// Mark messages as read
export const markMessagesAsRead = async (
  chatId: number,
  userId: number
): Promise<{ success: boolean; count: number; messages: ChatMessage[] }> => {
  try {
    const response = await chatRepository.markMessagesAsRead(chatId, userId);
    if (!response.ok) {
      throw new Error('Failed to mark messages as read');
    }
    return await response.json();
  } catch (error) {
    console.error(`Error marking messages as read for chat ${chatId}:`, error);
    throw error;
  }
};

// Get unread message count for a user
export const getUnreadMessageCount = async (
  userId: number
): Promise<UnreadMessageCount> => {
  try {
    const response = await chatRepository.getUnreadMessageCount(userId);
    if (!response.ok) {
      throw new Error('Failed to fetch unread message count');
    }
    return await response.json();
  } catch (error) {
    console.error(
      `Error fetching unread message count for user ${userId}:`,
      error
    );
    throw error;
  }
};
