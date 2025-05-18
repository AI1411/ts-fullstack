import { eq } from 'drizzle-orm';
import type { Context } from 'hono';
import { getDB } from '../../common/utils/db';
import { usersTable } from '../../db/schema';

// ユーザー作成
export const createUser = async (c: Context) => {
  const { name, email, password } = c.req.valid('json');
  const db = getDB(c);
  try {
    const user = await db
      .insert(usersTable)
      .values({
        name,
        email,
        password, // 本番環境ではパスワードのハッシュ化が必要
      })
      .returning();
    return c.json({ user: user[0] });
  } catch (error: any) {
    return c.json({ error: error.message }, 500);
  }
};

// ユーザー一覧取得
export const getUsers = async (c: Context) => {
  const db = getDB(c);
  try {
    const users = await db.select().from(usersTable);
    return c.json({ users });
  } catch (error: any) {
    return c.json({ error: error.message }, 500);
  }
};

// ユーザー取得
export const getUserById = async (c: Context) => {
  const id = Number.parseInt(c.req.param('id'));
  const db = getDB(c);
  try {
    const user = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.id, id));
    if (!user.length) {
      return c.json({ error: 'User not found' }, 404);
    }
    return c.json({ user: user[0] });
  } catch (error: any) {
    return c.json({ error: error.message }, 500);
  }
};

// ユーザー更新
export const updateUser = async (c: Context) => {
  const id = Number.parseInt(c.req.param('id'));
  const { name, email, password } = c.req.valid('json');
  const db = getDB(c);
  try {
    const updatedUser = await db
      .update(usersTable)
      .set({
        name,
        email,
        ...(password ? { password } : {}),
        updated_at: new Date(),
      })
      .where(eq(usersTable.id, id))
      .returning();
    if (!updatedUser.length) {
      return c.json({ error: 'User not found' }, 404);
    }
    return c.json({ user: updatedUser[0] });
  } catch (error: any) {
    return c.json({ error: error.message }, 500);
  }
};

// ユーザー削除
export const deleteUser = async (c: Context) => {
  const id = Number.parseInt(c.req.param('id'));
  const db = getDB(c);
  try {
    const deletedUser = await db
      .delete(usersTable)
      .where(eq(usersTable.id, id))
      .returning();
    if (!deletedUser.length) {
      return c.json({ error: 'User not found' }, 404);
    }
    return c.json({ message: 'User deleted successfully' });
  } catch (error: any) {
    return c.json({ error: error.message }, 500);
  }
};
