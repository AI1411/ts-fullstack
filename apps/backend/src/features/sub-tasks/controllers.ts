import { eq } from 'drizzle-orm';
import type { Context } from 'hono';
import { getDB } from '../../common/utils/db';
import { subTasksTable } from '../../db/schema';

// サブタスク作成
export const createSubTask = async (c: Context) => {
  const { task_id, title, description, status, due_date } = c.req.valid('json');
  const db = getDB(c);
  try {
    const subTask = await db
      .insert(subTasksTable)
      .values({
        task_id,
        title,
        description,
        status: status || 'PENDING',
        due_date: due_date ? new Date(due_date) : null,
      })
      .returning();
    return c.json({ subTask: subTask[0] });
  } catch (error: any) {
    return c.json({ error: error.message }, 500);
  }
};

// サブタスク一覧取得
export const getSubTasks = async (c: Context) => {
  const db = getDB(c);
  try {
    const subTasks = await db.select().from(subTasksTable);
    return c.json({ subTasks });
  } catch (error: any) {
    return c.json({ error: error.message }, 500);
  }
};

// タスクIDによるサブタスク取得
export const getSubTasksByTaskId = async (c: Context) => {
  const taskId = Number.parseInt(c.req.param('taskId'));
  const db = getDB(c);
  try {
    const subTasks = await db
      .select()
      .from(subTasksTable)
      .where(eq(subTasksTable.task_id, taskId));
    return c.json({ subTasks });
  } catch (error: any) {
    return c.json({ error: error.message }, 500);
  }
};

// サブタスク取得
export const getSubTaskById = async (c: Context) => {
  const id = Number.parseInt(c.req.param('id'));
  const db = getDB(c);
  try {
    const subTask = await db
      .select()
      .from(subTasksTable)
      .where(eq(subTasksTable.id, id));
    if (!subTask.length) {
      return c.json({ error: 'SubTask not found' }, 404);
    }
    return c.json({ subTask: subTask[0] });
  } catch (error: any) {
    return c.json({ error: error.message }, 500);
  }
};

// サブタスク更新
export const updateSubTask = async (c: Context) => {
  const id = Number.parseInt(c.req.param('id'));
  const { task_id, title, description, status, due_date } = c.req.valid('json');
  const db = getDB(c);
  try {
    const updatedSubTask = await db
      .update(subTasksTable)
      .set({
        task_id,
        title,
        description,
        status,
        due_date: due_date ? new Date(due_date) : null,
        updated_at: new Date(),
      })
      .where(eq(subTasksTable.id, id))
      .returning();
    if (!updatedSubTask.length) {
      return c.json({ error: 'SubTask not found' }, 404);
    }
    return c.json({ subTask: updatedSubTask[0] });
  } catch (error: any) {
    return c.json({ error: error.message }, 500);
  }
};

// サブタスク削除
export const deleteSubTask = async (c: Context) => {
  const id = Number.parseInt(c.req.param('id'));
  const db = getDB(c);
  try {
    const deletedSubTask = await db
      .delete(subTasksTable)
      .where(eq(subTasksTable.id, id))
      .returning();
    if (!deletedSubTask.length) {
      return c.json({ error: 'SubTask not found' }, 404);
    }
    return c.json({ message: 'SubTask deleted successfully' });
  } catch (error: any) {
    return c.json({ error: error.message }, 500);
  }
};
