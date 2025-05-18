import { and, eq } from 'drizzle-orm';
import type { Context } from 'hono';
import { getDB } from '../../common/utils/db';
import {
  baseballPlayerMediaTable,
  baseballPlayersTable,
} from '../../db/schema';

// メディアコンテンツ一覧取得
export const getBaseballPlayerMedia = async (c: Context) => {
  const db = getDB(c);

  try {
    const mediaItems = await db.select().from(baseballPlayerMediaTable);
    return c.json({ media: mediaItems });
  } catch (error: any) {
    return c.json({ error: error.message }, 500);
  }
};

// 特定の選手のメディアコンテンツ一覧取得
export const getBaseballPlayerMediaByPlayerId = async (c: Context) => {
  const playerId = Number.parseInt(c.req.param('playerId'));
  const db = getDB(c);

  try {
    // 選手の存在確認
    const player = await db
      .select()
      .from(baseballPlayersTable)
      .where(eq(baseballPlayersTable.id, playerId));

    if (!player.length) {
      return c.json({ error: '選手が見つかりません' }, 404);
    }

    const mediaItems = await db
      .select()
      .from(baseballPlayerMediaTable)
      .where(eq(baseballPlayerMediaTable.player_id, playerId))
      .orderBy(baseballPlayerMediaTable.publication_date);

    return c.json({ media: mediaItems });
  } catch (error: any) {
    return c.json({ error: error.message }, 500);
  }
};

// 特定のメディアコンテンツ取得
export const getBaseballPlayerMediaById = async (c: Context) => {
  const id = Number.parseInt(c.req.param('id'));
  const db = getDB(c);

  try {
    const mediaItem = await db
      .select()
      .from(baseballPlayerMediaTable)
      .where(eq(baseballPlayerMediaTable.id, id));

    if (!mediaItem.length) {
      return c.json({ error: 'メディアコンテンツが見つかりません' }, 404);
    }

    return c.json({ media: mediaItem[0] });
  } catch (error: any) {
    return c.json({ error: error.message }, 500);
  }
};

// メディアコンテンツ作成
export const createBaseballPlayerMedia = async (c: Context) => {
  const data = c.req.valid('json');
  const db = getDB(c);

  try {
    // 選手の存在確認
    const player = await db
      .select()
      .from(baseballPlayersTable)
      .where(eq(baseballPlayersTable.id, data.player_id));

    if (!player.length) {
      return c.json({ error: '選手が見つかりません' }, 404);
    }

    // 入力データから値を取得
    const mediaData: any = {
      player_id: data.player_id,
      media_type: data.media_type,
      title: data.title,
      url: data.url,
    };

    if (data.description !== undefined)
      mediaData.description = data.description;
    if (data.thumbnail_url !== undefined)
      mediaData.thumbnail_url = data.thumbnail_url;
    if (data.publication_date !== undefined)
      mediaData.publication_date = new Date(data.publication_date);
    if (data.source !== undefined) mediaData.source = data.source;
    if (data.is_featured !== undefined)
      mediaData.is_featured = data.is_featured;

    const mediaItem = await db
      .insert(baseballPlayerMediaTable)
      .values(mediaData)
      .returning();

    return c.json({ media: mediaItem[0] }, 201);
  } catch (error: any) {
    return c.json({ error: error.message }, 500);
  }
};

// メディアコンテンツ更新
export const updateBaseballPlayerMedia = async (c: Context) => {
  const id = Number.parseInt(c.req.param('id'));
  const data = c.req.valid('json');
  const db = getDB(c);

  try {
    // メディアコンテンツの存在確認
    const existingMedia = await db
      .select()
      .from(baseballPlayerMediaTable)
      .where(eq(baseballPlayerMediaTable.id, id));

    if (!existingMedia.length) {
      return c.json({ error: 'メディアコンテンツが見つかりません' }, 404);
    }

    // player_idが変更される場合は選手の存在確認
    if (data.player_id !== undefined) {
      const player = await db
        .select()
        .from(baseballPlayersTable)
        .where(eq(baseballPlayersTable.id, data.player_id));

      if (!player.length) {
        return c.json({ error: '選手が見つかりません' }, 404);
      }
    }

    // 更新データの準備
    const updateData: any = {};

    if (data.player_id !== undefined) updateData.player_id = data.player_id;
    if (data.media_type !== undefined) updateData.media_type = data.media_type;
    if (data.title !== undefined) updateData.title = data.title;
    if (data.description !== undefined)
      updateData.description = data.description;
    if (data.url !== undefined) updateData.url = data.url;
    if (data.thumbnail_url !== undefined)
      updateData.thumbnail_url = data.thumbnail_url;
    if (data.publication_date !== undefined)
      updateData.publication_date = new Date(data.publication_date);
    if (data.source !== undefined) updateData.source = data.source;
    if (data.is_featured !== undefined)
      updateData.is_featured = data.is_featured;

    updateData.updated_at = new Date();

    // メディアコンテンツを更新
    const updatedMedia = await db
      .update(baseballPlayerMediaTable)
      .set(updateData)
      .where(eq(baseballPlayerMediaTable.id, id))
      .returning();

    return c.json({ media: updatedMedia[0] });
  } catch (error: any) {
    return c.json({ error: error.message }, 500);
  }
};

// メディアコンテンツ削除
export const deleteBaseballPlayerMedia = async (c: Context) => {
  const id = Number.parseInt(c.req.param('id'));
  const db = getDB(c);

  try {
    // メディアコンテンツの存在確認
    const existingMedia = await db
      .select()
      .from(baseballPlayerMediaTable)
      .where(eq(baseballPlayerMediaTable.id, id));

    if (!existingMedia.length) {
      return c.json({ error: 'メディアコンテンツが見つかりません' }, 404);
    }

    // メディアコンテンツを削除
    await db
      .delete(baseballPlayerMediaTable)
      .where(eq(baseballPlayerMediaTable.id, id));

    return c.json({
      success: true,
      message: 'メディアコンテンツが削除されました',
    });
  } catch (error: any) {
    return c.json({ error: error.message }, 500);
  }
};

// 注目メディアコンテンツ取得
export const getFeaturedBaseballPlayerMedia = async (c: Context) => {
  const db = getDB(c);

  try {
    const featuredMedia = await db
      .select()
      .from(baseballPlayerMediaTable)
      .where(eq(baseballPlayerMediaTable.is_featured, true))
      .orderBy(baseballPlayerMediaTable.publication_date);

    return c.json({ media: featuredMedia });
  } catch (error: any) {
    return c.json({ error: error.message }, 500);
  }
};
