// Sub-Task routes configuration
export const SUB_TASK_ROUTES = {
  list: '/sub-tasks',
  detail: (id: string | number) => `/sub-tasks/${id}`,
  create: '/sub-tasks/create',
  edit: (id: string | number) => `/sub-tasks/${id}/edit`,
  taskSubTasks: (taskId: string | number) => `/tasks/${taskId}/sub-tasks`,
};
