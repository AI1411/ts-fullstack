import { eq } from 'drizzle-orm';
import type { Context } from 'hono';
import { getDB } from '../../common/utils/db';
import { inquiriesTable } from '../../db/schema';

// お問い合わせ送信
export const createInquiry = async (c: Context) => {
  const { name, email, subject, message } = c.req.valid('json');
  const db = getDB(c);

  try {
    const inquiry = await db
      .insert(inquiriesTable)
      .values({
        name,
        email,
        subject,
        message,
        status: 'PENDING',
      })
      .returning();

    return c.json({ inquiry: inquiry[0] }, 201);
  } catch (error: any) {
    return c.json({ error: error.message }, 500);
  }
};

// 管理者用: お問い合わせ一覧取得
export const getInquiries = async (c: Context) => {
  const db = getDB(c);

  try {
    const inquiries = await db
      .select()
      .from(inquiriesTable)
      .orderBy(inquiriesTable.created_at);
    return c.json({ inquiries });
  } catch (error: any) {
    return c.json({ error: error.message }, 500);
  }
};

// 管理者用: お問い合わせ詳細取得
export const getInquiryById = async (c: Context) => {
  const id = Number.parseInt(c.req.param('id'));
  const db = getDB(c);

  try {
    const inquiry = await db
      .select()
      .from(inquiriesTable)
      .where(eq(inquiriesTable.id, id));

    if (!inquiry.length) {
      return c.json({ error: 'お問い合わせが見つかりません' }, 404);
    }

    return c.json({ inquiry: inquiry[0] });
  } catch (error: any) {
    return c.json({ error: error.message }, 500);
  }
};
