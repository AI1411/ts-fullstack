// Country routes configuration
export const COUNTRY_ROUTES = {
  list: '/countries',
  detail: (id: string | number) => `/countries/${id}`,
  create: '/countries/create',
  edit: (id: string | number) => `/countries/${id}/edit`,
  adminList: '/admin/countries',
};