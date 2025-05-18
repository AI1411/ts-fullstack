import { Context } from 'hono';
import { baseballPlayerInjuriesTable, baseballPlayersTable } from '../../db/schema';
import { getDB } from '../../common/utils/db';
import { eq, and } from 'drizzle-orm';

// 怪我記録一覧取得
export const getBaseballInjuries = async (c: Context) => {
  const db = getDB(c);

  try {
    const injuries = await db.select().from(baseballPlayerInjuriesTable);
    return c.json({ injuries });
  } catch (error: any) {
    return c.json({ error: error.message }, 500);
  }
};

// 特定の選手の怪我記録一覧取得
export const getBaseballInjuriesByPlayerId = async (c: Context) => {
  const playerId = parseInt(c.req.param('playerId'));
  const db = getDB(c);

  try {
    // 選手の存在確認
    const player = await db.select().from(baseballPlayersTable).where(eq(baseballPlayersTable.id, playerId));
    
    if (!player.length) {
      return c.json({ error: '選手が見つかりません' }, 404);
    }

    const injuries = await db.select()
      .from(baseballPlayerInjuriesTable)
      .where(eq(baseballPlayerInjuriesTable.player_id, playerId))
      .orderBy(baseballPlayerInjuriesTable.start_date);
    
    return c.json({ injuries });
  } catch (error: any) {
    return c.json({ error: error.message }, 500);
  }
};

// 特定の怪我記録取得
export const getBaseballInjuryById = async (c: Context) => {
  const id = parseInt(c.req.param('id'));
  const db = getDB(c);

  try {
    const injury = await db.select().from(baseballPlayerInjuriesTable).where(eq(baseballPlayerInjuriesTable.id, id));

    if (!injury.length) {
      return c.json({ error: '怪我記録が見つかりません' }, 404);
    }

    return c.json({ injury: injury[0] });
  } catch (error: any) {
    return c.json({ error: error.message }, 500);
  }
};

// 怪我記録作成
export const createBaseballInjury = async (c: Context) => {
  const data = c.req.valid('json');
  const db = getDB(c);

  try {
    // 選手の存在確認
    const player = await db.select().from(baseballPlayersTable).where(eq(baseballPlayersTable.id, data.player_id));
    
    if (!player.length) {
      return c.json({ error: '選手が見つかりません' }, 404);
    }

    // 入力データから値を取得
    const injuryData: any = {
      player_id: data.player_id,
      injury_type: data.injury_type,
      start_date: new Date(data.start_date)
    };
    
    if (data.body_part !== undefined) injuryData.body_part = data.body_part;
    if (data.end_date !== undefined) injuryData.end_date = new Date(data.end_date);
    if (data.status !== undefined) injuryData.status = data.status;
    if (data.severity !== undefined) injuryData.severity = data.severity;
    if (data.treatment !== undefined) injuryData.treatment = data.treatment;
    if (data.notes !== undefined) injuryData.notes = data.notes;
    
    const injury = await db.insert(baseballPlayerInjuriesTable).values(injuryData).returning();

    return c.json({ injury: injury[0] }, 201);
  } catch (error: any) {
    return c.json({ error: error.message }, 500);
  }
};

// 怪我記録更新
export const updateBaseballInjury = async (c: Context) => {
  const id = parseInt(c.req.param('id'));
  const data = c.req.valid('json');
  const db = getDB(c);

  try {
    // 怪我記録の存在確認
    const existingInjury = await db.select().from(baseballPlayerInjuriesTable).where(eq(baseballPlayerInjuriesTable.id, id));

    if (!existingInjury.length) {
      return c.json({ error: '怪我記録が見つかりません' }, 404);
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
    if (data.injury_type !== undefined) updateData.injury_type = data.injury_type;
    if (data.body_part !== undefined) updateData.body_part = data.body_part;
    if (data.start_date !== undefined) updateData.start_date = new Date(data.start_date);
    if (data.end_date !== undefined) updateData.end_date = new Date(data.end_date);
    if (data.status !== undefined) updateData.status = data.status;
    if (data.severity !== undefined) updateData.severity = data.severity;
    if (data.treatment !== undefined) updateData.treatment = data.treatment;
    if (data.notes !== undefined) updateData.notes = data.notes;
    
    updateData.updated_at = new Date();

    // 怪我記録を更新
    const updatedInjury = await db.update(baseballPlayerInjuriesTable)
      .set(updateData)
      .where(eq(baseballPlayerInjuriesTable.id, id))
      .returning();

    return c.json({ injury: updatedInjury[0] });
  } catch (error: any) {
    return c.json({ error: error.message }, 500);
  }
};

// 怪我記録削除
export const deleteBaseballInjury = async (c: Context) => {
  const id = parseInt(c.req.param('id'));
  const db = getDB(c);

  try {
    // 怪我記録の存在確認
    const existingInjury = await db.select().from(baseballPlayerInjuriesTable).where(eq(baseballPlayerInjuriesTable.id, id));

    if (!existingInjury.length) {
      return c.json({ error: '怪我記録が見つかりません' }, 404);
    }

    // 怪我記録を削除
    await db.delete(baseballPlayerInjuriesTable).where(eq(baseballPlayerInjuriesTable.id, id));

    return c.json({ success: true, message: '怪我記録が削除されました' });
  } catch (error: any) {
    return c.json({ error: error.message }, 500);
  }
};

// アクティブな怪我記録取得（現在療養中の選手一覧）
export const getActiveBaseballInjuries = async (c: Context) => {
  const db = getDB(c);

  try {
    const activeInjuries = await db.select()
      .from(baseballPlayerInjuriesTable)
      .where(eq(baseballPlayerInjuriesTable.status, 'ACTIVE'))
      .orderBy(baseballPlayerInjuriesTable.start_date);
    
    return c.json({ injuries: activeInjuries });
  } catch (error: any) {
    return c.json({ error: error.message }, 500);
  }
};