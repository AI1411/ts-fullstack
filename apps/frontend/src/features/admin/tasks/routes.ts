// Task routes configuration
export const TASK_ROUTES = {
  list: '/tasks',
  detail: (id: string | number) => `/tasks/${id}`,
  create: '/tasks/create',
  edit: (id: string | number) => `/tasks/${id}/edit`,
  adminList: '/admin/tasks',
};
