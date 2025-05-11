import { Context } from 'hono';
import { categoriesTable, productsTable } from '../../db/schema';
import { getDB } from '../../common/utils/db';
import { eq } from 'drizzle-orm';

// カテゴリ一覧取得
export const getCategories = async (c: Context) => {
  const db = getDB(c);

  try {
    const categories = await db.select().from(categoriesTable);
    return c.json({ categories });
  } catch (error: any) {
    return c.json({ error: error.message }, 500);
  }
};

// カテゴリ取得
export const getCategoryById = async (c: Context) => {
  const id = parseInt(c.req.param('id'));
  const db = getDB(c);

  try {
    const category = await db.select().from(categoriesTable).where(eq(categoriesTable.id, id));

    if (!category.length) {
      return c.json({ error: 'カテゴリが見つかりません' }, 404);
    }

    return c.json({ category: category[0] });
  } catch (error: any) {
    return c.json({ error: error.message }, 500);
  }
};

// カテゴリに属する商品を取得
export const getProductsByCategory = async (c: Context) => {
  const id = parseInt(c.req.param('id'));
  const db = getDB(c);

  try {
    // カテゴリの存在確認
    const category = await db.select().from(categoriesTable).where(eq(categoriesTable.id, id));

    if (!category.length) {
      return c.json({ error: 'カテゴリが見つかりません' }, 404);
    }

    // カテゴリに属する商品を取得
    const products = await db.select().from(productsTable).where(eq(productsTable.category_id, id));

    return c.json({ products });
  } catch (error: any) {
    return c.json({ error: error.message }, 500);
  }
};

// カテゴリ作成
export const createCategory = async (c: Context) => {
  const { name, description } = c.req.valid('json');
  const db = getDB(c);

  try {
    const category = await db.insert(categoriesTable).values({
      name,
      description,
    }).returning();

    return c.json({ category: category[0] }, 201);
  } catch (error: any) {
    return c.json({ error: error.message }, 500);
  }
};

// カテゴリ更新
export const updateCategory = async (c: Context) => {
  const id = parseInt(c.req.param('id'));
  const data = c.req.valid('json');
  const db = getDB(c);

  try {
    // カテゴリの存在確認
    const existingCategory = await db.select().from(categoriesTable).where(eq(categoriesTable.id, id));

    if (!existingCategory.length) {
      return c.json({ error: 'カテゴリが見つかりません' }, 404);
    }

    // 更新データの準備
    const updateData: any = {};
    if (data.name !== undefined) updateData.name = data.name;
    if (data.description !== undefined) updateData.description = data.description;
    updateData.updated_at = new Date();

    // カテゴリを更新
    const updatedCategory = await db.update(categoriesTable)
      .set(updateData)
      .where(eq(categoriesTable.id, id))
      .returning();

    return c.json({ category: updatedCategory[0] });
  } catch (error: any) {
    return c.json({ error: error.message }, 500);
  }
};

// カテゴリ削除
export const deleteCategory = async (c: Context) => {
  const id = parseInt(c.req.param('id'));
  const db = getDB(c);

  try {
    // カテゴリの存在確認
    const existingCategory = await db.select().from(categoriesTable).where(eq(categoriesTable.id, id));

    if (!existingCategory.length) {
      return c.json({ error: 'カテゴリが見つかりません' }, 404);
    }

    // カテゴリを削除
    await db.delete(categoriesTable).where(eq(categoriesTable.id, id));

    return c.json({ success: true, message: 'カテゴリが削除されました' });
  } catch (error: any) {
    return c.json({ error: error.message }, 500);
  }
};