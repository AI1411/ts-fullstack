import { Context } from 'hono';
import { productsTable } from '../../db/schema';
import { getDB } from '../../common/utils/db';
import { eq } from 'drizzle-orm';

// 商品一覧取得
export const getProducts = async (c: Context) => {
  const db = getDB(c);

  try {
    const products = await db.select().from(productsTable);
    return c.json({ products });
  } catch (error: any) {
    return c.json({ error: error.message }, 500);
  }
};

// 商品取得
export const getProductById = async (c: Context) => {
  const id = parseInt(c.req.param('id'));
  const db = getDB(c);

  try {
    const product = await db.select().from(productsTable).where(eq(productsTable.id, id));

    if (!product.length) {
      return c.json({ error: '商品が見つかりません' }, 404);
    }

    return c.json({ product: product[0] });
  } catch (error: any) {
    return c.json({ error: error.message }, 500);
  }
};

// 商品作成
export const createProduct = async (c: Context) => {
  const { name, description, price, stock, image_url } = c.req.valid('json');
  const db = getDB(c);

  try {
    const product = await db.insert(productsTable).values({
      name,
      description,
      price,
      stock: stock || 0,
      image_url,
    }).returning();

    return c.json({ product: product[0] }, 201);
  } catch (error: any) {
    return c.json({ error: error.message }, 500);
  }
};

// 商品更新
export const updateProduct = async (c: Context) => {
  const id = parseInt(c.req.param('id'));
  const data = c.req.valid('json');
  const db = getDB(c);

  try {
    // 商品の存在確認
    const existingProduct = await db.select().from(productsTable).where(eq(productsTable.id, id));

    if (!existingProduct.length) {
      return c.json({ error: '商品が見つかりません' }, 404);
    }

    // 更新データの準備
    const updateData: any = {};
    if (data.name !== undefined) updateData.name = data.name;
    if (data.description !== undefined) updateData.description = data.description;
    if (data.price !== undefined) updateData.price = data.price;
    if (data.stock !== undefined) updateData.stock = data.stock;
    if (data.image_url !== undefined) updateData.image_url = data.image_url;
    updateData.updated_at = new Date();

    // 商品を更新
    const updatedProduct = await db.update(productsTable)
      .set(updateData)
      .where(eq(productsTable.id, id))
      .returning();

    return c.json({ product: updatedProduct[0] });
  } catch (error: any) {
    return c.json({ error: error.message }, 500);
  }
};

// 商品削除
export const deleteProduct = async (c: Context) => {
  const id = parseInt(c.req.param('id'));
  const db = getDB(c);

  try {
    // 商品の存在確認
    const existingProduct = await db.select().from(productsTable).where(eq(productsTable.id, id));

    if (!existingProduct.length) {
      return c.json({ error: '商品が見つかりません' }, 404);
    }

    // 商品を削除
    await db.delete(productsTable).where(eq(productsTable.id, id));

    return c.json({ success: true, message: '商品が削除されました' });
  } catch (error: any) {
    return c.json({ error: error.message }, 500);
  }
};