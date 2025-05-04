// Team routes configuration
export const TEAM_ROUTES = {
  list: '/teams',
  detail: (id: string | number) => `/teams/${id}`,
  create: '/teams/create',
  edit: (id: string | number) => `/teams/${id}/edit`,
  adminList: '/admin/teams',
};
