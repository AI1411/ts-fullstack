// Product routes configuration
export const PRODUCT_ROUTES = {
  list: '/products',
  detail: (id: string | number) => `/products/${id}`,
  create: '/products/create',
  edit: (id: string | number) => `/products/${id}/edit`,
  adminList: '/admin/products',
};
