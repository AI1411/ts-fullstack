// Chat routes configuration
export const CHAT_ROUTES = {
  list: '/admin/chats',
  detail: (id: string | number) => `/admin/chats/${id}`,
  create: '/admin/chats/create',
  userChats: (userId: string | number) => `/users/${userId}/chats`,
  chatMessages: (chatId: string | number) => `/chats/${chatId}/messages`,
  markAsRead: (chatId: string | number, userId: string | number) => `/chats/${chatId}/users/${userId}/read`,
  unreadMessages: (userId: string | number) => `/users/${userId}/unread-messages`,
};
