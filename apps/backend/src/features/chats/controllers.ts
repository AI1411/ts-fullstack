import { Context } from 'hono';
import { chatsTable, chatMessagesTable, usersTable } from '../../db/schema';
import { getDB } from '../../common/utils/db';
import { and, desc, eq, ne, or, inArray } from 'drizzle-orm';

// チャット作成
export const createChat = async (c: Context) => {
  const { creator_id, recipient_id } = c.req.valid('json');
  const db = getDB(c);

  try {
    // 既存のチャットを確認
    const existingChat = await db.select()
      .from(chatsTable)
      .where(
        or(
          and(
            eq(chatsTable.creator_id, creator_id),
            eq(chatsTable.recipient_id, recipient_id)
          ),
          and(
            eq(chatsTable.creator_id, recipient_id),
            eq(chatsTable.recipient_id, creator_id)
          )
        )
      );

    // 既存のチャットがある場合はそれを返す
    if (existingChat.length > 0) {
      return c.json({ chat: existingChat[0] });
    }

    // 新しいチャットを作成
    const chat = await db.insert(chatsTable).values({
      creator_id,
      recipient_id,
    }).returning();

    return c.json({ chat: chat[0] });
  } catch (error: any) {
    return c.json({ error: error.message }, 500);
  }
};

// ユーザーのチャット一覧取得
export const getUserChats = async (c: Context) => {
  const userId = parseInt(c.req.param('userId'));
  const db = getDB(c);

  try {
    // ユーザーが参加しているすべてのチャットを取得
    const chats = await db.select({
      chat: chatsTable,
      otherUser: usersTable,
    })
      .from(chatsTable)
      .leftJoin(
        usersTable,
        or(
          and(
            eq(chatsTable.creator_id, userId),
            eq(usersTable.id, chatsTable.recipient_id)
          ),
          and(
            eq(chatsTable.recipient_id, userId),
            eq(usersTable.id, chatsTable.creator_id)
          )
        )
      )
      .where(
        or(
          eq(chatsTable.creator_id, userId),
          eq(chatsTable.recipient_id, userId)
        )
      );

    return c.json({ chats });
  } catch (error: any) {
    return c.json({ error: error.message }, 500);
  }
};

// チャット取得
export const getChatById = async (c: Context) => {
  const id = parseInt(c.req.param('id'));
  const db = getDB(c);

  try {
    const chat = await db.select().from(chatsTable).where(eq(chatsTable.id, id));

    if (!chat.length) {
      return c.json({ error: 'Chat not found' }, 404);
    }

    return c.json({ chat: chat[0] });
  } catch (error: any) {
    return c.json({ error: error.message }, 500);
  }
};

// チャットメッセージ作成
export const createChatMessage = async (c: Context) => {
  const { chat_id, sender_id, content, is_read } = c.req.valid('json');
  const db = getDB(c);

  try {
    // チャットの存在確認
    const chat = await db.select().from(chatsTable).where(eq(chatsTable.id, chat_id));

    if (!chat.length) {
      return c.json({ error: 'Chat not found' }, 404);
    }

    // メッセージを作成
    const message = await db.insert(chatMessagesTable).values({
      chat_id,
      sender_id,
      content,
      is_read: is_read || false,
    }).returning();

    return c.json({ message: message[0] });
  } catch (error: any) {
    return c.json({ error: error.message }, 500);
  }
};

// チャットメッセージ一覧取得
export const getChatMessages = async (c: Context) => {
  const chatId = parseInt(c.req.param('chatId'));
  const db = getDB(c);

  try {
    // チャットの存在確認
    const chat = await db.select().from(chatsTable).where(eq(chatsTable.id, chatId));

    if (!chat.length) {
      return c.json({ error: 'Chat not found' }, 404);
    }

    // メッセージを取得
    const messages = await db.select({
      message: chatMessagesTable,
      sender: {
        id: usersTable.id,
        name: usersTable.name,
      }
    })
      .from(chatMessagesTable)
      .leftJoin(usersTable, eq(chatMessagesTable.sender_id, usersTable.id))
      .where(eq(chatMessagesTable.chat_id, chatId))
      .orderBy(desc(chatMessagesTable.created_at));

    return c.json({ messages });
  } catch (error: any) {
    return c.json({ error: error.message }, 500);
  }
};

// メッセージを既読にする
export const markMessagesAsRead = async (c: Context) => {
  const chatId = parseInt(c.req.param('chatId'));
  const userId = parseInt(c.req.param('userId'));
  const db = getDB(c);

  try {
    // チャットの存在確認
    const chat = await db.select().from(chatsTable).where(eq(chatsTable.id, chatId));

    if (!chat.length) {
      return c.json({ error: 'Chat not found' }, 404);
    }

    // 自分が送信していないメッセージを既読にする
    const updatedMessages = await db.update(chatMessagesTable)
      .set({
        is_read: true,
        updated_at: new Date(),
      })
      .where(
        and(
          eq(chatMessagesTable.chat_id, chatId),
          eq(chatMessagesTable.is_read, false),
          // 自分が送信していないメッセージを既読にする
          ne(chatMessagesTable.sender_id, userId)
        )
      )
      .returning();

    return c.json({
      success: true,
      count: updatedMessages.length,
      messages: updatedMessages
    });
  } catch (error: any) {
    return c.json({ error: error.message }, 500);
  }
};

// 未読メッセージ数を取得
export const getUnreadMessageCount = async (c: Context) => {
  const userId = parseInt(c.req.param('userId'));
  const db = getDB(c);

  try {
    // ユーザーが参加しているチャットを取得
    const chats = await db.select()
      .from(chatsTable)
      .where(
        or(
          eq(chatsTable.creator_id, userId),
          eq(chatsTable.recipient_id, userId)
        )
      );

    const chatIds = chats.map(chat => chat.id);

    // 未読メッセージ数を取得
    // 自分宛てのメッセージで未読のものを取得
    const unreadMessages = await db.select()
      .from(chatMessagesTable)
      .where(
        and(
          eq(chatMessagesTable.is_read, false),
          ne(chatMessagesTable.sender_id, userId),
          // 自分が参加しているチャットのメッセージのみを取得
          inArray(chatMessagesTable.chat_id, chatIds)
        )
      );

    return c.json({
      unreadCount: unreadMessages.length,
      chats: chatIds
    });
  } catch (error: any) {
    return c.json({ error: error.message }, 500);
  }
};
