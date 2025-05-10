// Order repositories
import {CreateOrderInput} from './controllers';

// Base API URL
const API_URL = 'http://localhost:8080';

// Order repository
export const orderRepository = {
  // Get all orders
  getOrders: async (): Promise<Response> => {
    return fetch(`${API_URL}/orders`);
  },

  // Create a new order
  createOrder: async (orderData: CreateOrderInput): Promise<Response> => {
    return fetch(`${API_URL}/orders`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(orderData),
    });
  },

  // Get an order by ID
  getOrderById: async (id: number): Promise<Response> => {
    return fetch(`${API_URL}/orders/${id}`);
  },

  // Update an order
  updateOrder: async (id: number, orderData: Partial<CreateOrderInput>): Promise<Response> => {
    return fetch(`${API_URL}/orders/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(orderData),
    });
  },

  // Delete an order
  deleteOrder: async (id: number): Promise<Response> => {
    return fetch(`${API_URL}/orders/${id}`, {
      method: 'DELETE',
    });
  },

  // Update order status
  updateOrderStatus: async (id: number, status: string): Promise<Response> => {
    return fetch(`${API_URL}/orders/${id}/status`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ status }),
    });
  },
};
