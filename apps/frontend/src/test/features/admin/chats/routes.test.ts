import { CHAT_ROUTES } from '@/features/admin/chats/routes';
import { describe, expect, it } from 'vitest';

describe('Chat Routes', () => {
  it('should define the list route', () => {
    expect(CHAT_ROUTES.list).toBe('/admin/chats');
  });

  it('should define the detail route with a parameter', () => {
    const chatId = 123;
    expect(CHAT_ROUTES.detail(chatId)).toBe(`/admin/chats/${chatId}`);
    expect(CHAT_ROUTES.detail('abc')).toBe('/admin/chats/abc');
  });

  it('should define the create route', () => {
    expect(CHAT_ROUTES.create).toBe('/admin/chats/create');
  });

  it('should define the userChats route with a parameter', () => {
    const userId = 456;
    expect(CHAT_ROUTES.userChats(userId)).toBe(`/users/${userId}/chats`);
    expect(CHAT_ROUTES.userChats('def')).toBe('/users/def/chats');
  });

  it('should define the chatMessages route with a parameter', () => {
    const chatId = 789;
    expect(CHAT_ROUTES.chatMessages(chatId)).toBe(`/chats/${chatId}/messages`);
    expect(CHAT_ROUTES.chatMessages('ghi')).toBe('/chats/ghi/messages');
  });

  it('should define the markAsRead route with parameters', () => {
    const chatId = 101;
    const userId = 202;
    expect(CHAT_ROUTES.markAsRead(chatId, userId)).toBe(
      `/chats/${chatId}/users/${userId}/read`
    );
    expect(CHAT_ROUTES.markAsRead('jkl', 'mno')).toBe(
      '/chats/jkl/users/mno/read'
    );
  });

  it('should define the unreadMessages route with a parameter', () => {
    const userId = 303;
    expect(CHAT_ROUTES.unreadMessages(userId)).toBe(
      `/users/${userId}/unread-messages`
    );
    expect(CHAT_ROUTES.unreadMessages('pqr')).toBe(
      '/users/pqr/unread-messages'
    );
  });
});
