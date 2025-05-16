import { Context } from 'hono';
import { baseballGameStatsTable, baseballPlayersTable } from '../../db/schema';
import { getDB } from '../../common/utils/db';
import { eq, and } from 'drizzle-orm';

// 野球選手の試合統計一覧取得
export const getBaseballGameStats = async (c: Context) => {
  const db = getDB(c);

  try {
    const stats = await db.select().from(baseballGameStatsTable);
    return c.json({ stats });
  } catch (error: any) {
    return c.json({ error: error.message }, 500);
  }
};

// 特定の選手の試合統計一覧取得
export const getBaseballGameStatsByPlayerId = async (c: Context) => {
  const playerId = parseInt(c.req.param('playerId'));
  const db = getDB(c);

  try {
    // 選手の存在確認
    const player = await db.select().from(baseballPlayersTable).where(eq(baseballPlayersTable.id, playerId));
    
    if (!player.length) {
      return c.json({ error: '選手が見つかりません' }, 404);
    }

    const stats = await db.select()
      .from(baseballGameStatsTable)
      .where(eq(baseballGameStatsTable.player_id, playerId))
      .orderBy(baseballGameStatsTable.game_date);
    
    return c.json({ stats });
  } catch (error: any) {
    return c.json({ error: error.message }, 500);
  }
};

// 特定の試合統計取得
export const getBaseballGameStatById = async (c: Context) => {
  const id = parseInt(c.req.param('id'));
  const db = getDB(c);

  try {
    const stat = await db.select().from(baseballGameStatsTable).where(eq(baseballGameStatsTable.id, id));

    if (!stat.length) {
      return c.json({ error: '試合統計が見つかりません' }, 404);
    }

    return c.json({ stat: stat[0] });
  } catch (error: any) {
    return c.json({ error: error.message }, 500);
  }
};

// 試合統計作成
export const createBaseballGameStat = async (c: Context) => {
  const { 
    player_id, 
    game_date, 
    opponent, 
    at_bats, 
    hits, 
    runs, 
    home_runs, 
    runs_batted_in, 
    stolen_bases, 
    innings_pitched, 
    hits_allowed, 
    earned_runs, 
    strikeouts, 
    walks 
  } = c.req.valid('json');
  
  const db = getDB(c);

  try {
    // 選手の存在確認
    const player = await db.select().from(baseballPlayersTable).where(eq(baseballPlayersTable.id, player_id));
    
    if (!player.length) {
      return c.json({ error: '選手が見つかりません' }, 404);
    }

    const stat = await db.insert(baseballGameStatsTable).values({
      player_id,
      game_date: new Date(game_date),
      opponent,
      at_bats,
      hits,
      runs,
      home_runs,
      runs_batted_in,
      stolen_bases,
      innings_pitched,
      hits_allowed,
      earned_runs,
      strikeouts,
      walks
    }).returning();

    return c.json({ stat: stat[0] }, 201);
  } catch (error: any) {
    return c.json({ error: error.message }, 500);
  }
};

// 試合統計更新
export const updateBaseballGameStat = async (c: Context) => {
  const id = parseInt(c.req.param('id'));
  const data = c.req.valid('json');
  const db = getDB(c);

  try {
    // 統計の存在確認
    const existingStat = await db.select().from(baseballGameStatsTable).where(eq(baseballGameStatsTable.id, id));

    if (!existingStat.length) {
      return c.json({ error: '試合統計が見つかりません' }, 404);
    }

    // player_idが変更される場合は選手の存在確認
    if (data.player_id !== undefined) {
      const player = await db.select().from(baseballPlayersTable).where(eq(baseballPlayersTable.id, data.player_id));
      
      if (!player.length) {
        return c.json({ error: '選手が見つかりません' }, 404);
      }
    }

    // 更新データの準備
    const updateData: any = {};
    if (data.player_id !== undefined) updateData.player_id = data.player_id;
    if (data.game_date !== undefined) updateData.game_date = new Date(data.game_date);
    if (data.opponent !== undefined) updateData.opponent = data.opponent;
    if (data.at_bats !== undefined) updateData.at_bats = data.at_bats;
    if (data.hits !== undefined) updateData.hits = data.hits;
    if (data.runs !== undefined) updateData.runs = data.runs;
    if (data.home_runs !== undefined) updateData.home_runs = data.home_runs;
    if (data.runs_batted_in !== undefined) updateData.runs_batted_in = data.runs_batted_in;
    if (data.stolen_bases !== undefined) updateData.stolen_bases = data.stolen_bases;
    if (data.innings_pitched !== undefined) updateData.innings_pitched = data.innings_pitched;
    if (data.hits_allowed !== undefined) updateData.hits_allowed = data.hits_allowed;
    if (data.earned_runs !== undefined) updateData.earned_runs = data.earned_runs;
    if (data.strikeouts !== undefined) updateData.strikeouts = data.strikeouts;
    if (data.walks !== undefined) updateData.walks = data.walks;
    updateData.updated_at = new Date();

    // 統計を更新
    const updatedStat = await db.update(baseballGameStatsTable)
      .set(updateData)
      .where(eq(baseballGameStatsTable.id, id))
      .returning();

    return c.json({ stat: updatedStat[0] });
  } catch (error: any) {
    return c.json({ error: error.message }, 500);
  }
};

// 試合統計削除
export const deleteBaseballGameStat = async (c: Context) => {
  const id = parseInt(c.req.param('id'));
  const db = getDB(c);

  try {
    // 統計の存在確認
    const existingStat = await db.select().from(baseballGameStatsTable).where(eq(baseballGameStatsTable.id, id));

    if (!existingStat.length) {
      return c.json({ error: '試合統計が見つかりません' }, 404);
    }

    // 統計を削除
    await db.delete(baseballGameStatsTable).where(eq(baseballGameStatsTable.id, id));

    return c.json({ success: true, message: '試合統計が削除されました' });
  } catch (error: any) {
    return c.json({ error: error.message }, 500);
  }
};