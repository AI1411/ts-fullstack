import { Context } from 'hono';
import { contactsTable } from '../../db/schema';
import { getDB } from '../../common/utils/db';
import { eq } from 'drizzle-orm';
import { contactSchema, updateContactSchema } from './schemas';

// お問い合わせ送信
export const createContact = async (c: Context) => {
  const { name, email, phone, subject, message } = c.req.valid('json');
  const db = getDB(c);

  try {
    const contact = await db.insert(contactsTable).values({
      name,
      email,
      phone,
      subject,
      message,
      status: 'PENDING',
    }).returning();

    return c.json({ contact: contact[0] }, 201);
  } catch (error: any) {
    return c.json({ error: error.message }, 500);
  }
};

// 管理者用: お問い合わせ一覧取得
export const getContacts = async (c: Context) => {
  const db = getDB(c);

  try {
    const contacts = await db.select().from(contactsTable).orderBy(contactsTable.created_at);
    return c.json({ contacts });
  } catch (error: any) {
    return c.json({ error: error.message }, 500);
  }
};

// 管理者用: お問い合わせ詳細取得
export const getContactById = async (c: Context) => {
  const id = parseInt(c.req.param('id'));
  const db = getDB(c);

  try {
    const contact = await db.select().from(contactsTable).where(eq(contactsTable.id, id));

    if (!contact.length) {
      return c.json({ error: 'お問い合わせが見つかりません' }, 404);
    }

    return c.json({ contact: contact[0] });
  } catch (error: any) {
    return c.json({ error: error.message }, 500);
  }
};

// 管理者用: お問い合わせ更新
export const updateContact = async (c: Context) => {
  const id = parseInt(c.req.param('id'));
  const { status } = c.req.valid('json');
  const db = getDB(c);

  try {
    const existingContact = await db.select().from(contactsTable).where(eq(contactsTable.id, id));

    if (!existingContact.length) {
      return c.json({ error: 'お問い合わせが見つかりません' }, 404);
    }

    const updatedContact = await db.update(contactsTable)
      .set({ 
        status,
        updated_at: new Date()
      })
      .where(eq(contactsTable.id, id))
      .returning();

    return c.json({ contact: updatedContact[0] });
  } catch (error: any) {
    return c.json({ error: error.message }, 500);
  }
};

// 管理者用: お問い合わせ削除
export const deleteContact = async (c: Context) => {
  const id = parseInt(c.req.param('id'));
  const db = getDB(c);

  try {
    const existingContact = await db.select().from(contactsTable).where(eq(contactsTable.id, id));

    if (!existingContact.length) {
      return c.json({ error: 'お問い合わせが見つかりません' }, 404);
    }

    await db.delete(contactsTable).where(eq(contactsTable.id, id));

    return c.json({ success: true }, 200);
  } catch (error: any) {
    return c.json({ error: error.message }, 500);
  }
};
