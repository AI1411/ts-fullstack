import { Context } from 'hono';
import { invoicesTable, ordersTable } from '../../db/schema';
import { getDB } from '../../common/utils/db';
import { eq } from 'drizzle-orm';

// 領収書一覧取得
export const getInvoices = async (c: Context) => {
  const db = getDB(c);

  try {
    const invoices = await db.query.invoicesTable.findMany();
    return c.json({ invoices });
  } catch (error: any) {
    return c.json({ error: error.message }, 500);
  }
};

// 領収書取得
export const getInvoiceById = async (c: Context) => {
  const id = parseInt(c.req.param('id'));
  if (isNaN(id)) {
    return c.json({ error: '無効なID形式です' }, 400);
  }
  const db = getDB(c);

  try {
    const invoice = await db.query.invoicesTable.findFirst({
      where: eq(invoicesTable.id, id)
    });

    if (!invoice) {
      return c.json({ error: '領収書が見つかりません' }, 404);
    }

    return c.json({ invoice });
  } catch (error: any) {
    return c.json({ error: error.message }, 500);
  }
};

// 領収書作成
export const createInvoice = async (c: Context) => {
  const { order_id, invoice_number, issue_date, due_date, total_amount, status, payment_method, notes } = c.req.valid('json');
  const db = getDB(c);

  try {
    // 注文の存在確認（order_idが提供された場合）
    if (order_id) {
      const order = await db.query.ordersTable.findFirst({
        where: eq(ordersTable.id, order_id)
      });
      if (!order) {
        return c.json({ error: '指定された注文が見つかりません' }, 404);
      }
    }

    const [invoice] = await db.insert(invoicesTable).values({
      order_id,
      invoice_number,
      issue_date: issue_date ? new Date(issue_date) : new Date(),
      due_date: due_date ? new Date(due_date) : undefined,
      total_amount,
      status: status || 'PENDING',
      payment_method,
      notes
    }).returning();

    return c.json({ invoice }, 201);
  } catch (error: any) {
    return c.json({ error: error.message }, 500);
  }
};

// 領収書更新
export const updateInvoice = async (c: Context) => {
  const id = parseInt(c.req.param('id'));
  if (isNaN(id)) {
    return c.json({ error: '無効なID形式です' }, 400);
  }
  const data = c.req.valid('json');
  const db = getDB(c);

  try {
    // 領収書の存在確認
    const existingInvoice = await db.query.invoicesTable.findFirst({
      where: eq(invoicesTable.id, id)
    });

    if (!existingInvoice) {
      return c.json({ error: '領収書が見つかりません' }, 404);
    }

    // 注文の存在確認（order_idが提供された場合）
    if (data.order_id) {
      const order = await db.query.ordersTable.findFirst({
        where: eq(ordersTable.id, data.order_id)
      });
      if (!order) {
        return c.json({ error: '指定された注文が見つかりません' }, 404);
      }
    }

    // 更新データの準備
    const updateData: any = {};
    if (data.order_id !== undefined) updateData.order_id = data.order_id;
    if (data.invoice_number !== undefined) updateData.invoice_number = data.invoice_number;
    if (data.issue_date !== undefined) updateData.issue_date = new Date(data.issue_date);
    if (data.due_date !== undefined) updateData.due_date = data.due_date ? new Date(data.due_date) : null;
    if (data.total_amount !== undefined) updateData.total_amount = data.total_amount;
    if (data.status !== undefined) updateData.status = data.status;
    if (data.payment_method !== undefined) updateData.payment_method = data.payment_method;
    if (data.notes !== undefined) updateData.notes = data.notes;
    updateData.updated_at = new Date();

    // 領収書を更新
    const [updatedInvoice] = await db.update(invoicesTable)
      .set(updateData)
      .where(eq(invoicesTable.id, id))
      .returning();

    return c.json({ invoice: updatedInvoice });
  } catch (error: any) {
    return c.json({ error: error.message }, 500);
  }
};

// 領収書削除
export const deleteInvoice = async (c: Context) => {
  const id = parseInt(c.req.param('id'));
  if (isNaN(id)) {
    return c.json({ error: '無効なID形式です' }, 400);
  }
  const db = getDB(c);

  try {
    // 領収書の存在確認
    const existingInvoice = await db.query.invoicesTable.findFirst({
      where: eq(invoicesTable.id, id)
    });

    if (!existingInvoice) {
      return c.json({ error: '領収書が見つかりません' }, 404);
    }

    // 領収書を削除
    await db.delete(invoicesTable).where(eq(invoicesTable.id, id));

    return c.json({ success: true, message: '領収書が削除されました' });
  } catch (error: any) {
    return c.json({ error: error.message }, 500);
  }
};
