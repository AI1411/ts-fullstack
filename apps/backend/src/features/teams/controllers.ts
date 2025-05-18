import { eq } from 'drizzle-orm';
import type { Context } from 'hono';
import { getDB } from '../../common/utils/db';
import { teamsTable } from '../../db/schema';

// チーム作成
export const createTeam = async (c: Context) => {
  const { name, description } = c.req.valid('json');
  const db = getDB(c);
  try {
    const team = await db
      .insert(teamsTable)
      .values({
        name,
        description,
      })
      .returning();
    return c.json({ team: team[0] });
  } catch (error: any) {
    return c.json({ error: error.message }, 500);
  }
};

// チーム一覧取得
export const getTeams = async (c: Context) => {
  const db = getDB(c);
  try {
    const teams = await db.select().from(teamsTable);
    return c.json({ teams });
  } catch (error: any) {
    return c.json({ error: error.message }, 500);
  }
};

// チーム取得
export const getTeamById = async (c: Context) => {
  const id = Number.parseInt(c.req.param('id'));
  const db = getDB(c);
  try {
    const team = await db
      .select()
      .from(teamsTable)
      .where(eq(teamsTable.id, id));
    if (!team.length) {
      return c.json({ error: 'Team not found' }, 404);
    }
    return c.json({ team: team[0] });
  } catch (error: any) {
    return c.json({ error: error.message }, 500);
  }
};

// チーム更新
export const updateTeam = async (c: Context) => {
  const id = Number.parseInt(c.req.param('id'));
  const { name, description } = c.req.valid('json');
  const db = getDB(c);
  try {
    const updatedTeam = await db
      .update(teamsTable)
      .set({
        name,
        description,
        updated_at: new Date(),
      })
      .where(eq(teamsTable.id, id))
      .returning();
    if (!updatedTeam.length) {
      return c.json({ error: 'Team not found' }, 404);
    }
    return c.json({ team: updatedTeam[0] });
  } catch (error: any) {
    return c.json({ error: error.message }, 500);
  }
};

// チーム削除
export const deleteTeam = async (c: Context) => {
  const id = Number.parseInt(c.req.param('id'));
  const db = getDB(c);
  try {
    const deletedTeam = await db
      .delete(teamsTable)
      .where(eq(teamsTable.id, id))
      .returning();
    if (!deletedTeam.length) {
      return c.json({ error: 'Team not found' }, 404);
    }
    return c.json({ message: 'Team deleted successfully' });
  } catch (error: any) {
    return c.json({ error: error.message }, 500);
  }
};
