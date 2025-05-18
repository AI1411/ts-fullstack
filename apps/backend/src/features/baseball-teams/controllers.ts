import { eq } from 'drizzle-orm';
import type { Context } from 'hono';
import { getDB } from '../../common/utils/db';
import { baseballTeamsTable } from '../../db/schema';

// 野球チーム一覧取得
export const getBaseballTeams = async (c: Context) => {
  const db = getDB(c);

  try {
    const teams = await db.select().from(baseballTeamsTable);
    return c.json({ teams });
  } catch (error: any) {
    return c.json({ error: error.message }, 500);
  }
};

// 野球チーム取得
export const getBaseballTeamById = async (c: Context) => {
  const id = Number.parseInt(c.req.param('id'));
  const db = getDB(c);

  try {
    const team = await db
      .select()
      .from(baseballTeamsTable)
      .where(eq(baseballTeamsTable.id, id));

    if (!team.length) {
      return c.json({ error: 'チームが見つかりません' }, 404);
    }

    return c.json({ team: team[0] });
  } catch (error: any) {
    return c.json({ error: error.message }, 500);
  }
};

// 野球チーム作成
export const createBaseballTeam = async (c: Context) => {
  const data = c.req.valid('json');
  const db = getDB(c);

  try {
    // 入力データから値を取得
    const teamData: any = {};

    teamData.name = data.name;
    if (data.abbreviation !== undefined)
      teamData.abbreviation = data.abbreviation;
    if (data.league !== undefined) teamData.league = data.league;
    if (data.division !== undefined) teamData.division = data.division;
    if (data.home_stadium !== undefined)
      teamData.home_stadium = data.home_stadium;
    if (data.city !== undefined) teamData.city = data.city;
    if (data.founded_year !== undefined)
      teamData.founded_year = data.founded_year;
    if (data.team_color !== undefined) teamData.team_color = data.team_color;
    if (data.logo_url !== undefined) teamData.logo_url = data.logo_url;
    if (data.website_url !== undefined) teamData.website_url = data.website_url;
    if (data.description !== undefined) teamData.description = data.description;

    const team = await db
      .insert(baseballTeamsTable)
      .values(teamData)
      .returning();

    return c.json({ team: team[0] }, 201);
  } catch (error: any) {
    return c.json({ error: error.message }, 500);
  }
};

// 野球チーム更新
export const updateBaseballTeam = async (c: Context) => {
  const id = Number.parseInt(c.req.param('id'));
  const data = c.req.valid('json');
  const db = getDB(c);

  try {
    // チームの存在確認
    const existingTeam = await db
      .select()
      .from(baseballTeamsTable)
      .where(eq(baseballTeamsTable.id, id));

    if (!existingTeam.length) {
      return c.json({ error: 'チームが見つかりません' }, 404);
    }

    // 更新データの準備
    const updateData: any = {};

    if (data.name !== undefined) updateData.name = data.name;
    if (data.abbreviation !== undefined)
      updateData.abbreviation = data.abbreviation;
    if (data.league !== undefined) updateData.league = data.league;
    if (data.division !== undefined) updateData.division = data.division;
    if (data.home_stadium !== undefined)
      updateData.home_stadium = data.home_stadium;
    if (data.city !== undefined) updateData.city = data.city;
    if (data.founded_year !== undefined)
      updateData.founded_year = data.founded_year;
    if (data.team_color !== undefined) updateData.team_color = data.team_color;
    if (data.logo_url !== undefined) updateData.logo_url = data.logo_url;
    if (data.website_url !== undefined)
      updateData.website_url = data.website_url;
    if (data.description !== undefined)
      updateData.description = data.description;

    updateData.updated_at = new Date();

    // チームを更新
    const updatedTeam = await db
      .update(baseballTeamsTable)
      .set(updateData)
      .where(eq(baseballTeamsTable.id, id))
      .returning();

    return c.json({ team: updatedTeam[0] });
  } catch (error: any) {
    return c.json({ error: error.message }, 500);
  }
};

// 野球チーム削除
export const deleteBaseballTeam = async (c: Context) => {
  const id = Number.parseInt(c.req.param('id'));
  const db = getDB(c);

  try {
    // チームの存在確認
    const existingTeam = await db
      .select()
      .from(baseballTeamsTable)
      .where(eq(baseballTeamsTable.id, id));

    if (!existingTeam.length) {
      return c.json({ error: 'チームが見つかりません' }, 404);
    }

    // チームを削除
    await db.delete(baseballTeamsTable).where(eq(baseballTeamsTable.id, id));

    return c.json({ success: true, message: 'チームが削除されました' });
  } catch (error: any) {
    return c.json({ error: error.message }, 500);
  }
};
