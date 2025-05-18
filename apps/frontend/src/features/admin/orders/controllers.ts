// Order controllers
import { orderRepository } from './repositories';

// Types
export interface Order {
  id: number;
  customer_name: string;
  customer_email: string;
  total_amount: number;
  status: 'pending' | 'processing' | 'completed' | 'cancelled';
  items: OrderItem[];
  created_at: string;
  updated_at: string;
}

export interface OrderItem {
  id: number;
  order_id: number;
  product_id: number;
  product_name: string;
  quantity: number;
  price: number;
}

export interface CreateOrderInput {
  customer_name: string;
  customer_email: string;
  items: {
    product_id: number;
    quantity: number;
  }[];
}

// Get all orders
export const getOrders = async (): Promise<Order[]> => {
  try {
    const response = await orderRepository.getOrders();
    if (!response.ok) {
      throw new Error('Error fetching orders');
    }
    const { orders } = await response.json();
    return orders;
  } catch (error) {
    console.error('Error fetching orders:', error);
    throw error;
  }
};

// Create a new order
export const createOrder = async (
  orderData: CreateOrderInput
): Promise<Order> => {
  try {
    const response = await orderRepository.createOrder(orderData);
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(errorText);
    }
    const { order } = await response.json();
    return order;
  } catch (error) {
    console.error('Error creating order:', error);
    throw error;
  }
};

// Get an order by ID
export const getOrderById = async (id: number): Promise<Order> => {
  try {
    const response = await orderRepository.getOrderById(id);
    if (!response.ok) {
      throw new Error('Order not found');
    }
    const { order } = await response.json();
    return order;
  } catch (error) {
    console.error(`Error fetching order ${id}:`, error);
    throw error;
  }
};

// Update an order
export const updateOrder = async (
  id: number,
  orderData: Partial<CreateOrderInput>
): Promise<Order> => {
  try {
    const response = await orderRepository.updateOrder(id, orderData);
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(errorText);
    }
    const { order } = await response.json();
    return order;
  } catch (error) {
    console.error(`Error updating order ${id}:`, error);
    throw error;
  }
};

// Delete an order
export const deleteOrder = async (id: number): Promise<void> => {
  try {
    const response = await orderRepository.deleteOrder(id);
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(errorText);
    }
  } catch (error) {
    console.error(`Error deleting order ${id}:`, error);
    throw error;
  }
};

// Update order status
export const updateOrderStatus = async (
  id: number,
  status: Order['status']
): Promise<Order> => {
  try {
    const response = await orderRepository.updateOrderStatus(id, status);
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(errorText);
    }
    const { order } = await response.json();
    return order;
  } catch (error) {
    console.error(`Error updating order status ${id}:`, error);
    throw error;
  }
};
