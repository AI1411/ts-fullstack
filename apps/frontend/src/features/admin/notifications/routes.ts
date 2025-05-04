// Notification routes configuration
export const NOTIFICATION_ROUTES = {
  list: '/notifications',
  detail: (id: string | number) => `/notifications/${id}`,
  create: '/notifications/create',
  edit: (id: string | number) => `/notifications/${id}/edit`,
  adminList: '/admin/notifications',
};
