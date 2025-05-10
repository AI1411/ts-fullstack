import { Context } from 'hono';
import { ordersTable, orderItemsTable, productsTable } from '../../db/schema';
import { getDB } from '../../common/utils/db';
import { eq, and } from 'drizzle-orm';
import { sql } from 'drizzle-orm';

// 注文一覧取得
export const getOrders = async (c: Context) => {
  const db = getDB(c);

  try {
    const orders = await db.select().from(ordersTable);
    return c.json({ orders });
  } catch (error: any) {
    return c.json({ error: error.message }, 500);
  }
};

// 注文詳細取得
export const getOrderById = async (c: Context) => {
  const id = parseInt(c.req.param('id'));
  const db = getDB(c);

  try {
    // 注文の基本情報を取得
    const order = await db.select().from(ordersTable).where(eq(ordersTable.id, id));

    if (!order.length) {
      return c.json({ error: '注文が見つかりません' }, 404);
    }

    // 注文アイテムを取得
    const orderItems = await db.select({
      id: orderItemsTable.id,
      product_id: orderItemsTable.product_id,
      quantity: orderItemsTable.quantity,
      price: orderItemsTable.price,
      product_name: productsTable.name,
    })
    .from(orderItemsTable)
    .leftJoin(productsTable, eq(orderItemsTable.product_id, productsTable.id))
    .where(eq(orderItemsTable.order_id, id));

    // 注文と注文アイテムを結合
    const orderWithItems = {
      ...order[0],
      items: orderItems
    };

    return c.json({ order: orderWithItems });
  } catch (error: any) {
    return c.json({ error: error.message }, 500);
  }
};

// ユーザーの注文履歴取得
export const getUserOrders = async (c: Context) => {
  const userId = parseInt(c.req.param('userId'));
  const db = getDB(c);

  try {
    const orders = await db.select().from(ordersTable).where(eq(ordersTable.user_id, userId));
    return c.json({ orders });
  } catch (error: any) {
    return c.json({ error: error.message }, 500);
  }
};

// 注文作成
export const createOrder = async (c: Context) => {
  const { user_id, items } = c.req.valid('json');
  const db = getDB(c);

  try {
    // トランザクションを開始
    return await db.transaction(async (tx) => {
      // 商品の在庫と価格を確認
      const productIds = items.map((item: any) => item.product_id);
      const products = await tx.select().from(productsTable).where(sql`${productsTable.id} IN (${productIds})`);
      
      // 商品IDをキーとした商品情報のマップを作成
      const productMap = products.reduce((acc: any, product) => {
        acc[product.id] = product;
        return acc;
      }, {});
      
      // 注文アイテムの検証と合計金額の計算
      let totalAmount = 0;
      for (const item of items) {
        const product = productMap[item.product_id];
        
        // 商品が存在するか確認
        if (!product) {
          return c.json({ error: `商品ID ${item.product_id} が見つかりません` }, 404);
        }
        
        // 在庫が十分かチェック
        if (product.stock < item.quantity) {
          return c.json({ 
            error: `商品「${product.name}」の在庫が不足しています。在庫: ${product.stock}, 注文数: ${item.quantity}` 
          }, 400);
        }
        
        // 合計金額に加算
        totalAmount += product.price * item.quantity;
      }
      
      // 注文を作成
      const order = await tx.insert(ordersTable).values({
        user_id,
        total_amount: totalAmount,
        status: 'PENDING',
      }).returning();
      
      // 注文アイテムを作成
      const orderItems = [];
      for (const item of items) {
        const product = productMap[item.product_id];
        
        // 注文アイテムを追加
        const orderItem = await tx.insert(orderItemsTable).values({
          order_id: order[0].id,
          product_id: item.product_id,
          quantity: item.quantity,
          price: product.price,
        }).returning();
        
        orderItems.push(orderItem[0]);
        
        // 商品の在庫を減らす
        await tx.update(productsTable)
          .set({ stock: product.stock - item.quantity })
          .where(eq(productsTable.id, item.product_id));
      }
      
      return c.json({ 
        order: order[0],
        items: orderItems
      }, 201);
    });
  } catch (error: any) {
    return c.json({ error: error.message }, 500);
  }
};

// 注文ステータス更新
export const updateOrderStatus = async (c: Context) => {
  const id = parseInt(c.req.param('id'));
  const { status } = c.req.valid('json');
  const db = getDB(c);

  try {
    // 注文の存在確認
    const existingOrder = await db.select().from(ordersTable).where(eq(ordersTable.id, id));

    if (!existingOrder.length) {
      return c.json({ error: '注文が見つかりません' }, 404);
    }

    // 注文ステータスを更新
    const updatedOrder = await db.update(ordersTable)
      .set({ 
        status,
        updated_at: new Date()
      })
      .where(eq(ordersTable.id, id))
      .returning();

    return c.json({ order: updatedOrder[0] });
  } catch (error: any) {
    return c.json({ error: error.message }, 500);
  }
};

// 注文キャンセル
export const cancelOrder = async (c: Context) => {
  const id = parseInt(c.req.param('id'));
  const db = getDB(c);

  try {
    return await db.transaction(async (tx) => {
      // 注文の存在確認
      const existingOrder = await tx.select().from(ordersTable).where(eq(ordersTable.id, id));

      if (!existingOrder.length) {
        return c.json({ error: '注文が見つかりません' }, 404);
      }

      // 注文が既にキャンセルされていないか確認
      if (existingOrder[0].status === 'CANCELLED') {
        return c.json({ error: 'この注文は既にキャンセルされています' }, 400);
      }

      // 注文が発送済みでないか確認
      if (['SHIPPED', 'DELIVERED'].includes(existingOrder[0].status)) {
        return c.json({ error: '発送済みまたは配達済みの注文はキャンセルできません' }, 400);
      }

      // 注文アイテムを取得
      const orderItems = await tx.select().from(orderItemsTable).where(eq(orderItemsTable.order_id, id));

      // 各商品の在庫を戻す
      for (const item of orderItems) {
        await tx.update(productsTable)
          .set({
            stock: sql`${productsTable.stock} + ${item.quantity}`
          })
          .where(eq(productsTable.id, item.product_id));
      }

      // 注文ステータスをキャンセルに更新
      const updatedOrder = await tx.update(ordersTable)
        .set({ 
          status: 'CANCELLED',
          updated_at: new Date()
        })
        .where(eq(ordersTable.id, id))
        .returning();

      return c.json({ 
        order: updatedOrder[0],
        message: '注文がキャンセルされました'
      });
    });
  } catch (error: any) {
    return c.json({ error: error.message }, 500);
  }
};