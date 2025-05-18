import { eq } from 'drizzle-orm';
import type { Context } from 'hono';
import { getDB } from '../../common/utils/db';
import { companiesTable } from '../../db/schema';

// 会社一覧取得
export const getCompanies = async (c: Context) => {
  const db = getDB(c);

  try {
    const companies = await db.select().from(companiesTable);
    return c.json({ companies });
  } catch (error: any) {
    return c.json({ error: error.message }, 500);
  }
};

// 会社取得
export const getCompanyById = async (c: Context) => {
  const id = Number.parseInt(c.req.param('id'));
  const db = getDB(c);

  try {
    const company = await db
      .select()
      .from(companiesTable)
      .where(eq(companiesTable.id, id));

    if (!company.length) {
      return c.json({ error: '会社が見つかりません' }, 404);
    }

    return c.json({ company: company[0] });
  } catch (error: any) {
    return c.json({ error: error.message }, 500);
  }
};

// 会社作成
export const createCompany = async (c: Context) => {
  const { name, description, address, phone, email, website } =
    c.req.valid('json');
  const db = getDB(c);

  try {
    const company = await db
      .insert(companiesTable)
      .values({
        name,
        description,
        address,
        phone,
        email,
        website,
      })
      .returning();

    return c.json({ company: company[0] }, 201);
  } catch (error: any) {
    return c.json({ error: error.message }, 500);
  }
};

// 会社更新
export const updateCompany = async (c: Context) => {
  const id = Number.parseInt(c.req.param('id'));
  const data = c.req.valid('json');
  const db = getDB(c);

  try {
    // 会社の存在確認
    const existingCompany = await db
      .select()
      .from(companiesTable)
      .where(eq(companiesTable.id, id));

    if (!existingCompany.length) {
      return c.json({ error: '会社が見つかりません' }, 404);
    }

    // 更新データの準備
    const updateData: any = {};
    if (data.name !== undefined) updateData.name = data.name;
    if (data.description !== undefined)
      updateData.description = data.description;
    if (data.address !== undefined) updateData.address = data.address;
    if (data.phone !== undefined) updateData.phone = data.phone;
    if (data.email !== undefined) updateData.email = data.email;
    if (data.website !== undefined) updateData.website = data.website;
    updateData.updated_at = new Date();

    // 会社を更新
    const updatedCompany = await db
      .update(companiesTable)
      .set(updateData)
      .where(eq(companiesTable.id, id))
      .returning();

    return c.json({ company: updatedCompany[0] });
  } catch (error: any) {
    return c.json({ error: error.message }, 500);
  }
};

// 会社削除
export const deleteCompany = async (c: Context) => {
  const id = Number.parseInt(c.req.param('id'));
  const db = getDB(c);

  try {
    // 会社の存在確認
    const existingCompany = await db
      .select()
      .from(companiesTable)
      .where(eq(companiesTable.id, id));

    if (!existingCompany.length) {
      return c.json({ error: '会社が見つかりません' }, 404);
    }

    // 会社を削除
    await db.delete(companiesTable).where(eq(companiesTable.id, id));

    return c.json({ success: true, message: '会社が削除されました' });
  } catch (error: any) {
    return c.json({ error: error.message }, 500);
  }
};
