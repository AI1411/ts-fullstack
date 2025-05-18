// Product controllers
import { productRepository } from './repositories';

// Types
export interface Product {
  id: number;
  name: string;
  description: string | null;
  price: number;
  stock: number;
  image_url: string | null;
  created_at: string;
  updated_at: string;
}

export interface CreateProductInput {
  name: string;
  description?: string;
  price: number;
  stock?: number;
  image_url?: string | null;
}

// Get all products
export const getProducts = async (): Promise<Product[]> => {
  try {
    const response = await productRepository.getProducts();
    const { products } = await response.json();
    return products;
  } catch (error) {
    console.error('Error fetching products:', error);
    throw error;
  }
};

// Create a new product
export const createProduct = async (
  productData: CreateProductInput
): Promise<Product> => {
  try {
    const response = await productRepository.createProduct(productData);
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(errorText);
    }
    const { product } = await response.json();
    return product;
  } catch (error) {
    console.error('Error creating product:', error);
    throw error;
  }
};

// Get a product by ID
export const getProductById = async (id: number): Promise<Product> => {
  try {
    const response = await productRepository.getProductById(id);
    if (!response.ok) {
      throw new Error('Product not found');
    }
    const { product } = await response.json();
    return product;
  } catch (error) {
    console.error(`Error fetching product ${id}:`, error);
    throw error;
  }
};

// Update a product
export const updateProduct = async (
  id: number,
  productData: Partial<CreateProductInput>
): Promise<Product> => {
  try {
    const response = await productRepository.updateProduct(id, productData);
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(errorText);
    }
    const { product } = await response.json();
    return product;
  } catch (error) {
    console.error(`Error updating product ${id}:`, error);
    throw error;
  }
};

// Delete a product
export const deleteProduct = async (id: number): Promise<void> => {
  try {
    const response = await productRepository.deleteProduct(id);
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(errorText);
    }
  } catch (error) {
    console.error(`Error deleting product ${id}:`, error);
    throw error;
  }
};
