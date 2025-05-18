// Invoice routes configuration
export const INVOICE_ROUTES = {
  list: '/invoices',
  detail: (id: string | number) => `/invoices/${id}`,
  create: '/invoices/create',
  edit: (id: string | number) => `/invoices/${id}/edit`,
  adminList: '/admin/invoices',
};
