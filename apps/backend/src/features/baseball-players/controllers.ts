import { Context } from 'hono';
import { baseballPlayersTable } from '../../db/schema';
import { getDB } from '../../common/utils/db';
import { eq } from 'drizzle-orm';

// 野球選手一覧取得
export const getBaseballPlayers = async (c: Context) => {
  const db = getDB(c);

  try {
    const players = await db.select().from(baseballPlayersTable);
    return c.json({ players });
  } catch (error: any) {
    return c.json({ error: error.message }, 500);
  }
};

// 野球選手取得
export const getBaseballPlayerById = async (c: Context) => {
  const id = parseInt(c.req.param('id'));
  const db = getDB(c);

  try {
    const player = await db.select().from(baseballPlayersTable).where(eq(baseballPlayersTable.id, id));

    if (!player.length) {
      return c.json({ error: '選手が見つかりません' }, 404);
    }

    return c.json({ player: player[0] });
  } catch (error: any) {
    return c.json({ error: error.message }, 500);
  }
};

// 野球選手作成
export const createBaseballPlayer = async (c: Context) => {
  const { 
    name, 
    team, 
    position, 
    batting_average, 
    home_runs, 
    runs_batted_in, 
    stolen_bases, 
    era, 
    wins, 
    losses, 
    saves 
  } = c.req.valid('json');
  
  const db = getDB(c);

  try {
    const player = await db.insert(baseballPlayersTable).values({
      name,
      team,
      position,
      batting_average,
      home_runs,
      runs_batted_in,
      stolen_bases,
      era,
      wins,
      losses,
      saves
    }).returning();

    return c.json({ player: player[0] }, 201);
  } catch (error: any) {
    return c.json({ error: error.message }, 500);
  }
};

// 野球選手更新
export const updateBaseballPlayer = async (c: Context) => {
  const id = parseInt(c.req.param('id'));
  const data = c.req.valid('json');
  const db = getDB(c);

  try {
    // 選手の存在確認
    const existingPlayer = await db.select().from(baseballPlayersTable).where(eq(baseballPlayersTable.id, id));

    if (!existingPlayer.length) {
      return c.json({ error: '選手が見つかりません' }, 404);
    }

    // 更新データの準備
    const updateData: any = {};
    if (data.name !== undefined) updateData.name = data.name;
    if (data.team !== undefined) updateData.team = data.team;
    if (data.position !== undefined) updateData.position = data.position;
    if (data.batting_average !== undefined) updateData.batting_average = data.batting_average;
    if (data.home_runs !== undefined) updateData.home_runs = data.home_runs;
    if (data.runs_batted_in !== undefined) updateData.runs_batted_in = data.runs_batted_in;
    if (data.stolen_bases !== undefined) updateData.stolen_bases = data.stolen_bases;
    if (data.era !== undefined) updateData.era = data.era;
    if (data.wins !== undefined) updateData.wins = data.wins;
    if (data.losses !== undefined) updateData.losses = data.losses;
    if (data.saves !== undefined) updateData.saves = data.saves;
    updateData.updated_at = new Date();

    // 選手を更新
    const updatedPlayer = await db.update(baseballPlayersTable)
      .set(updateData)
      .where(eq(baseballPlayersTable.id, id))
      .returning();

    return c.json({ player: updatedPlayer[0] });
  } catch (error: any) {
    return c.json({ error: error.message }, 500);
  }
};

// 野球選手削除
export const deleteBaseballPlayer = async (c: Context) => {
  const id = parseInt(c.req.param('id'));
  const db = getDB(c);

  try {
    // 選手の存在確認
    const existingPlayer = await db.select().from(baseballPlayersTable).where(eq(baseballPlayersTable.id, id));

    if (!existingPlayer.length) {
      return c.json({ error: '選手が見つかりません' }, 404);
    }

    // 選手を削除
    await db.delete(baseballPlayersTable).where(eq(baseballPlayersTable.id, id));

    return c.json({ success: true, message: '選手が削除されました' });
  } catch (error: any) {
    return c.json({ error: error.message }, 500);
  }
};