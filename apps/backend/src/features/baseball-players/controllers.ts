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
  const data = c.req.valid('json');
  const db = getDB(c);

  try {
    // 入力データから値を取得（すべてのフィールドを対象に）
    const playerData: any = {};

    // 基本情報
    playerData.name = data.name;
    if (data.team !== undefined) playerData.team = data.team;
    if (data.position !== undefined) playerData.position = data.position;

    // 基本プロフィール情報
    if (data.birth_date !== undefined) playerData.birth_date = new Date(data.birth_date);
    if (data.height !== undefined) playerData.height = data.height;
    if (data.weight !== undefined) playerData.weight = data.weight;
    if (data.throwing_hand !== undefined) playerData.throwing_hand = data.throwing_hand;
    if (data.batting_hand !== undefined) playerData.batting_hand = data.batting_hand;
    if (data.uniform_number !== undefined) playerData.uniform_number = data.uniform_number;
    if (data.nationality !== undefined) playerData.nationality = data.nationality;
    if (data.profile_image_url !== undefined) playerData.profile_image_url = data.profile_image_url;

    // 打撃成績
    if (data.batting_average !== undefined) playerData.batting_average = data.batting_average;
    if (data.games_played !== undefined) playerData.games_played = data.games_played;
    if (data.at_bats !== undefined) playerData.at_bats = data.at_bats;
    if (data.hits !== undefined) playerData.hits = data.hits;
    if (data.doubles !== undefined) playerData.doubles = data.doubles;
    if (data.triples !== undefined) playerData.triples = data.triples;
    if (data.home_runs !== undefined) playerData.home_runs = data.home_runs;
    if (data.runs_batted_in !== undefined) playerData.runs_batted_in = data.runs_batted_in;
    if (data.runs_scored !== undefined) playerData.runs_scored = data.runs_scored;
    if (data.stolen_bases !== undefined) playerData.stolen_bases = data.stolen_bases;
    if (data.walks !== undefined) playerData.walks = data.walks;
    if (data.strikeouts !== undefined) playerData.strikeouts = data.strikeouts;
    if (data.on_base_percentage !== undefined) playerData.on_base_percentage = data.on_base_percentage;
    if (data.slugging_percentage !== undefined) playerData.slugging_percentage = data.slugging_percentage;
    if (data.ops !== undefined) playerData.ops = data.ops;

    // 投手成績
    if (data.era !== undefined) playerData.era = data.era;
    if (data.wins !== undefined) playerData.wins = data.wins;
    if (data.losses !== undefined) playerData.losses = data.losses;
    if (data.saves !== undefined) playerData.saves = data.saves;
    if (data.games_pitched !== undefined) playerData.games_pitched = data.games_pitched;
    if (data.games_started !== undefined) playerData.games_started = data.games_started;
    if (data.complete_games !== undefined) playerData.complete_games = data.complete_games;
    if (data.shutouts !== undefined) playerData.shutouts = data.shutouts;
    if (data.innings_pitched !== undefined) playerData.innings_pitched = data.innings_pitched;
    if (data.hits_allowed !== undefined) playerData.hits_allowed = data.hits_allowed;
    if (data.runs_allowed !== undefined) playerData.runs_allowed = data.runs_allowed;
    if (data.earned_runs !== undefined) playerData.earned_runs = data.earned_runs;
    if (data.walks_allowed !== undefined) playerData.walks_allowed = data.walks_allowed;
    if (data.strikeouts_pitched !== undefined) playerData.strikeouts_pitched = data.strikeouts_pitched;
    if (data.whip !== undefined) playerData.whip = data.whip;

    // 契約情報
    if (data.contract_status !== undefined) playerData.contract_status = data.contract_status;
    if (data.salary !== undefined) playerData.salary = data.salary;
    if (data.contract_start_date !== undefined) playerData.contract_start_date = new Date(data.contract_start_date);
    if (data.contract_end_date !== undefined) playerData.contract_end_date = new Date(data.contract_end_date);

    const player = await db.insert(baseballPlayersTable).values(playerData).returning();

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

    // 基本情報
    if (data.name !== undefined) updateData.name = data.name;
    if (data.team !== undefined) updateData.team = data.team;
    if (data.position !== undefined) updateData.position = data.position;

    // 基本プロフィール情報
    if (data.birth_date !== undefined) updateData.birth_date = new Date(data.birth_date);
    if (data.height !== undefined) updateData.height = data.height;
    if (data.weight !== undefined) updateData.weight = data.weight;
    if (data.throwing_hand !== undefined) updateData.throwing_hand = data.throwing_hand;
    if (data.batting_hand !== undefined) updateData.batting_hand = data.batting_hand;
    if (data.uniform_number !== undefined) updateData.uniform_number = data.uniform_number;
    if (data.nationality !== undefined) updateData.nationality = data.nationality;
    if (data.profile_image_url !== undefined) updateData.profile_image_url = data.profile_image_url;

    // 打撃成績
    if (data.batting_average !== undefined) updateData.batting_average = data.batting_average;
    if (data.games_played !== undefined) updateData.games_played = data.games_played;
    if (data.at_bats !== undefined) updateData.at_bats = data.at_bats;
    if (data.hits !== undefined) updateData.hits = data.hits;
    if (data.doubles !== undefined) updateData.doubles = data.doubles;
    if (data.triples !== undefined) updateData.triples = data.triples;
    if (data.home_runs !== undefined) updateData.home_runs = data.home_runs;
    if (data.runs_batted_in !== undefined) updateData.runs_batted_in = data.runs_batted_in;
    if (data.runs_scored !== undefined) updateData.runs_scored = data.runs_scored;
    if (data.stolen_bases !== undefined) updateData.stolen_bases = data.stolen_bases;
    if (data.walks !== undefined) updateData.walks = data.walks;
    if (data.strikeouts !== undefined) updateData.strikeouts = data.strikeouts;
    if (data.on_base_percentage !== undefined) updateData.on_base_percentage = data.on_base_percentage;
    if (data.slugging_percentage !== undefined) updateData.slugging_percentage = data.slugging_percentage;
    if (data.ops !== undefined) updateData.ops = data.ops;

    // 投手成績
    if (data.era !== undefined) updateData.era = data.era;
    if (data.wins !== undefined) updateData.wins = data.wins;
    if (data.losses !== undefined) updateData.losses = data.losses;
    if (data.saves !== undefined) updateData.saves = data.saves;
    if (data.games_pitched !== undefined) updateData.games_pitched = data.games_pitched;
    if (data.games_started !== undefined) updateData.games_started = data.games_started;
    if (data.complete_games !== undefined) updateData.complete_games = data.complete_games;
    if (data.shutouts !== undefined) updateData.shutouts = data.shutouts;
    if (data.innings_pitched !== undefined) updateData.innings_pitched = data.innings_pitched;
    if (data.hits_allowed !== undefined) updateData.hits_allowed = data.hits_allowed;
    if (data.runs_allowed !== undefined) updateData.runs_allowed = data.runs_allowed;
    if (data.earned_runs !== undefined) updateData.earned_runs = data.earned_runs;
    if (data.walks_allowed !== undefined) updateData.walks_allowed = data.walks_allowed;
    if (data.strikeouts_pitched !== undefined) updateData.strikeouts_pitched = data.strikeouts_pitched;
    if (data.whip !== undefined) updateData.whip = data.whip;

    // 契約情報
    if (data.contract_status !== undefined) updateData.contract_status = data.contract_status;
    if (data.salary !== undefined) updateData.salary = data.salary;
    if (data.contract_start_date !== undefined) updateData.contract_start_date = new Date(data.contract_start_date);
    if (data.contract_end_date !== undefined) updateData.contract_end_date = new Date(data.contract_end_date);

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
