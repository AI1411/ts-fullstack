// Product repositories
import { client } from '@/common/utils/client';
import type { CreateProductInput } from './controllers';

// Product repository
export const productRepository = {
  // Get all products
  getProducts: async () => {
    return client.products.$get();
  },

  // Create a new product
  createProduct: async (productData: CreateProductInput) => {
    return client.products.$post({
      json: productData,
    });
  },

  // Get a product by ID
  getProductById: async (id: number) => {
    return client.products[':id'].$get({
      param: { id: id.toString() },
    });
  },

  // Update a product
  updateProduct: async (
    id: number,
    productData: Partial<CreateProductInput>
  ) => {
    return client.products[':id'].$put({
      param: { id: id.toString() },
      json: productData,
    });
  },

  // Delete a product
  deleteProduct: async (id: number) => {
    return client.products[':id'].$delete({
      param: { id: id.toString() },
    });
  },
};
