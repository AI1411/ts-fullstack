// Todo routes configuration
export const TODO_ROUTES = {
  list: '/todos',
  detail: (id: string | number) => `/todos/${id}`,
  create: '/todos/create',
  edit: (id: string | number) => `/todos/${id}/edit`,
  adminList: '/admin/todos',
};
