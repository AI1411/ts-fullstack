// Order services
import {
  createOrder as createOrderController,
  CreateOrderInput,
  deleteOrder as deleteOrderController,
  getOrderById as getOrderByIdController,
  getOrders as getOrdersController,
  Order,
  updateOrder as updateOrderController,
  updateOrderStatus as updateOrderStatusController
} from './controllers';

// Order service
export const orderService = {
  // Get all orders
  getOrders: async (): Promise<Order[]> => {
    return getOrdersController();
  },

  // Create a new order
  createOrder: async (orderData: CreateOrderInput): Promise<Order> => {
    return createOrderController(orderData);
  },

  // Get an order by ID
  getOrderById: async (id: number): Promise<Order> => {
    return getOrderByIdController(id);
  },

  // Update an order
  updateOrder: async (id: number, orderData: Partial<CreateOrderInput>): Promise<Order> => {
    return updateOrderController(id, orderData);
  },

  // Delete an order
  deleteOrder: async (id: number): Promise<void> => {
    return deleteOrderController(id);
  },

  // Update order status
  updateOrderStatus: async (id: number, status: Order['status']): Promise<Order> => {
    return updateOrderStatusController(id, status);
  },

  // Get orders by status
  getOrdersByStatus: async (status: Order['status']): Promise<Order[]> => {
    const orders = await getOrdersController();
    return orders.filter(order => order.status === status);
  },

  // Get recent orders
  getRecentOrders: async (limit: number = 5): Promise<Order[]> => {
    const orders = await getOrdersController();
    return orders
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
      .slice(0, limit);
  },

  // Calculate total revenue
  calculateTotalRevenue: async (): Promise<number> => {
    const orders = await getOrdersController();
    return orders.reduce((total, order) => total + order.total_amount, 0);
  }
};