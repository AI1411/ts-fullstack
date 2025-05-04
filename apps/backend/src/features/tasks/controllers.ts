import { Context } from 'hono';
import { tasksTable } from '../../db/schema';
import { getDB } from '../../common/utils/db';
import { eq } from 'drizzle-orm';

// タスク作成
export const createTask = async (c: Context) => {
  const { user_id, team_id, title, description, status, due_date } = c.req.valid('json');
  const db = getDB(c);
  try {
    const task = await db.insert(tasksTable).values({
      user_id,
      team_id,
      title,
      description,
      status: status || 'PENDING',
      due_date: due_date ? new Date(due_date) : null,
    }).returning();
    return c.json({ task: task[0] });
  } catch (error: any) {
    return c.json({ error: error.message }, 500);
  }
};

// タスク一覧取得
export const getTasks = async (c: Context) => {
  const db = getDB(c);
  try {
    const tasks = await db.select().from(tasksTable);
    return c.json({ tasks });
  } catch (error: any) {
    return c.json({ error: error.message }, 500);
  }
};

// ユーザーIDによるタスク取得
export const getTasksByUserId = async (c: Context) => {
  const userId = parseInt(c.req.param('userId'));
  const db = getDB(c);
  try {
    const tasks = await db.select().from(tasksTable).where(eq(tasksTable.user_id, userId));
    return c.json({ tasks });
  } catch (error: any) {
    return c.json({ error: error.message }, 500);
  }
};

// チームIDによるタスク取得
export const getTasksByTeamId = async (c: Context) => {
  const teamId = parseInt(c.req.param('teamId'));
  const db = getDB(c);
  try {
    const tasks = await db.select().from(tasksTable).where(eq(tasksTable.team_id, teamId));
    return c.json({ tasks });
  } catch (error: any) {
    return c.json({ error: error.message }, 500);
  }
};

// タスク取得
export const getTaskById = async (c: Context) => {
  const id = parseInt(c.req.param('id'));
  const db = getDB(c);
  try {
    const task = await db.select().from(tasksTable).where(eq(tasksTable.id, id));
    if (!task.length) {
      return c.json({ error: 'Task not found' }, 404);
    }
    return c.json({ task: task[0] });
  } catch (error: any) {
    return c.json({ error: error.message }, 500);
  }
};

// タスク更新
export const updateTask = async (c: Context) => {
  const id = parseInt(c.req.param('id'));
  const { user_id, team_id, title, description, status, due_date } = c.req.valid('json');
  const db = getDB(c);
  try {
    const updatedTask = await db.update(tasksTable)
      .set({
        user_id,
        team_id,
        title,
        description,
        status,
        due_date: due_date ? new Date(due_date) : null,
        updated_at: new Date(),
      })
      .where(eq(tasksTable.id, id))
      .returning();
    if (!updatedTask.length) {
      return c.json({ error: 'Task not found' }, 404);
    }
    return c.json({ task: updatedTask[0] });
  } catch (error: any) {
    return c.json({ error: error.message }, 500);
  }
};

// タスク削除
export const deleteTask = async (c: Context) => {
  const id = parseInt(c.req.param('id'));
  const db = getDB(c);
  try {
    const deletedTask = await db.delete(tasksTable)
      .where(eq(tasksTable.id, id))
      .returning();
    if (!deletedTask.length) {
      return c.json({ error: 'Task not found' }, 404);
    }
    return c.json({ message: 'Task deleted successfully' });
  } catch (error: any) {
    return c.json({ error: error.message }, 500);
  }
};
