import { eq } from 'drizzle-orm';
import type { Context } from 'hono';
import { getDB } from '../../common/utils/db';
import { countriesTable } from '../../db/schema';

// 国一覧取得
export const getCountries = async (c: Context) => {
  const db = getDB(c);

  try {
    const countries = await db.select().from(countriesTable);
    return c.json({ countries });
  } catch (error: any) {
    return c.json({ error: error.message }, 500);
  }
};

// 国取得
export const getCountryById = async (c: Context) => {
  const id = Number.parseInt(c.req.param('id'));
  const db = getDB(c);

  try {
    const country = await db
      .select()
      .from(countriesTable)
      .where(eq(countriesTable.id, id));

    if (!country.length) {
      return c.json({ error: '国が見つかりません' }, 404);
    }

    return c.json({ country: country[0] });
  } catch (error: any) {
    return c.json({ error: error.message }, 500);
  }
};

// 国作成
export const createCountry = async (c: Context) => {
  const { name, code, flag_url } = c.req.valid('json');
  const db = getDB(c);

  try {
    const country = await db
      .insert(countriesTable)
      .values({
        name,
        code,
        flag_url,
      })
      .returning();

    return c.json({ country: country[0] }, 201);
  } catch (error: any) {
    return c.json({ error: error.message }, 500);
  }
};

// 国更新
export const updateCountry = async (c: Context) => {
  const id = Number.parseInt(c.req.param('id'));
  const data = c.req.valid('json');
  const db = getDB(c);

  try {
    // 国の存在確認
    const existingCountry = await db
      .select()
      .from(countriesTable)
      .where(eq(countriesTable.id, id));

    if (!existingCountry.length) {
      return c.json({ error: '国が見つかりません' }, 404);
    }

    // 更新データの準備
    const updateData: any = {};
    if (data.name !== undefined) updateData.name = data.name;
    if (data.code !== undefined) updateData.code = data.code;
    if (data.flag_url !== undefined) updateData.flag_url = data.flag_url;
    updateData.updated_at = new Date();

    // 国を更新
    const updatedCountry = await db
      .update(countriesTable)
      .set(updateData)
      .where(eq(countriesTable.id, id))
      .returning();

    return c.json({ country: updatedCountry[0] });
  } catch (error: any) {
    return c.json({ error: error.message }, 500);
  }
};

// 国削除
export const deleteCountry = async (c: Context) => {
  const id = Number.parseInt(c.req.param('id'));
  const db = getDB(c);

  try {
    // 国の存在確認
    const existingCountry = await db
      .select()
      .from(countriesTable)
      .where(eq(countriesTable.id, id));

    if (!existingCountry.length) {
      return c.json({ error: '国が見つかりません' }, 404);
    }

    // 国を削除
    await db.delete(countriesTable).where(eq(countriesTable.id, id));

    return c.json({ success: true, message: '国が削除されました' });
  } catch (error: any) {
    return c.json({ error: error.message }, 500);
  }
};
