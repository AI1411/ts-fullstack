// User routes configuration
export const USER_ROUTES = {
  list: '/users',
  detail: (id: string | number) => `/users/${id}`,
  create: '/users/create',
  edit: (id: string | number) => `/users/${id}/edit`,
  adminList: '/admin/users',
};
