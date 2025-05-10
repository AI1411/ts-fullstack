import { z } from 'zod';

// Order item schema for creating an order
export const orderItemSchema = z.object({
  product_id: z.number().positive({ message: "商品IDは正の数である必要があります" }),
  quantity: z.number().positive({ message: "数量は1以上である必要があります" }),
});

// Schema for creating a new order
export const orderSchema = z.object({
  user_id: z.number().positive({ message: "ユーザーIDは正の数である必要があります" }),
  items: z.array(orderItemSchema).min(1, { message: "注文には少なくとも1つのアイテムが必要です" }),
});

// Schema for updating an order's status
export const orderStatusUpdateSchema = z.object({
  status: z.enum(["PENDING", "PROCESSING", "SHIPPED", "DELIVERED", "CANCELLED"], {
    errorMap: () => ({ message: "無効な注文ステータスです" }),
  }),
});

// Schema for retrieving order details
export const orderDetailSchema = z.object({
  id: z.number(),
  user_id: z.number(),
  total_amount: z.number(),
  status: z.string(),
  created_at: z.string(),
  updated_at: z.string(),
  items: z.array(
    z.object({
      id: z.number(),
      product_id: z.number(),
      product_name: z.string(),
      quantity: z.number(),
      price: z.number(),
    })
  ),
});