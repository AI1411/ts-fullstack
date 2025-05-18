// Product services
import {
  type CreateProductInput,
  type Product,
  createProduct as createProductController,
  deleteProduct as deleteProductController,
  getProductById as getProductByIdController,
  getProducts as getProductsController,
  updateProduct as updateProductController,
} from './controllers';

// Product service
export const productService = {
  // Get all products
  getProducts: async (): Promise<Product[]> => {
    return getProductsController();
  },

  // Create a new product
  createProduct: async (productData: CreateProductInput): Promise<Product> => {
    return createProductController(productData);
  },

  // Get a product by ID
  getProductById: async (id: number): Promise<Product> => {
    return getProductByIdController(id);
  },

  // Update a product
  updateProduct: async (
    id: number,
    productData: Partial<CreateProductInput>
  ): Promise<Product> => {
    return updateProductController(id, productData);
  },

  // Delete a product
  deleteProduct: async (id: number): Promise<void> => {
    return deleteProductController(id);
  },

  // Get products with low stock
  getLowStockProducts: async (threshold = 10): Promise<Product[]> => {
    const products = await getProductsController();
    return products.filter((product) => product.stock <= threshold);
  },

  // Get products by price range
  getProductsByPriceRange: async (
    minPrice: number,
    maxPrice: number
  ): Promise<Product[]> => {
    const products = await getProductsController();
    return products.filter(
      (product) => product.price >= minPrice && product.price <= maxPrice
    );
  },
};
