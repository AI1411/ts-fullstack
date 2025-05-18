// Company routes configuration
export const COMPANY_ROUTES = {
  list: '/companies',
  detail: (id: string | number) => `/companies/${id}`,
  create: '/companies/create',
  edit: (id: string | number) => `/companies/${id}/edit`,
  adminList: '/admin/companies',
};
