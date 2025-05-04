import { Context } from 'hono';
import { todosTable } from '../../db/schema';
import { getDB } from '../../common/utils/db';
import { eq } from 'drizzle-orm';

// Todo作成
export const createTodo = async (c: Context) => {
  const { title, description, user_id, status } = c.req.valid('json');
  const db = getDB(c);
  try {
    const todo = await db.insert(todosTable).values({
      title,
      description,
      user_id,
      status: status || 'PENDING',
    }).returning();
    return c.json({ todo: todo[0] });
  } catch (error: any) {
    return c.json({ error: error.message }, 500);
  }
};

// Todo一覧取得
export const getTodos = async (c: Context) => {
  const db = getDB(c);
  try {
    const todos = await db.select().from(todosTable);
    return c.json({ todos });
  } catch (error: any) {
    return c.json({ error: error.message }, 500);
  }
};

// Todo取得
export const getTodoById = async (c: Context) => {
  const id = parseInt(c.req.param('id'));
  const db = getDB(c);
  try {
    const todo = await db.select().from(todosTable).where(eq(todosTable.id, id));
    if (!todo.length) {
      return c.json({ error: 'Todo not found' }, 404);
    }
    return c.json({ todo: todo[0] });
  } catch (error: any) {
    return c.json({ error: error.message }, 500);
  }
};

// Todo更新
export const updateTodo = async (c: Context) => {
  const id = parseInt(c.req.param('id'));
  const { title, description, user_id, status } = c.req.valid('json');
  const db = getDB(c);
  try {
    const updatedTodo = await db.update(todosTable)
      .set({
        title,
        description,
        user_id,
        status,
        updated_at: new Date(),
      })
      .where(eq(todosTable.id, id))
      .returning();
    if (!updatedTodo.length) {
      return c.json({ error: 'Todo not found' }, 404);
    }
    return c.json({ todo: updatedTodo[0] });
  } catch (error: any) {
    return c.json({ error: error.message }, 500);
  }
};

// Todo削除
export const deleteTodo = async (c: Context) => {
  const id = parseInt(c.req.param('id'));
  const db = getDB(c);
  try {
    const deletedTodo = await db.delete(todosTable)
      .where(eq(todosTable.id, id))
      .returning();
    if (!deletedTodo.length) {
      return c.json({ error: 'Todo not found' }, 404);
    }
    return c.json({ message: 'Todo deleted successfully' });
  } catch (error: any) {
    return c.json({ error: error.message }, 500);
  }
};
