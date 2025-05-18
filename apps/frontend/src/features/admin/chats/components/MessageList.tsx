'use client';

import { formatDistanceToNow } from 'date-fns';
import { ja } from 'date-fns/locale';
import type { ChatMessageWithSender } from '../controllers';

interface MessageListProps {
  messages: ChatMessageWithSender[];
  currentUserId: number;
}

const MessageList = ({ messages, currentUserId }: MessageListProps) => {
  if (messages.length === 0) {
    return (
      <div className="flex justify-center items-center h-full text-gray-500">
        メッセージがありません。最初のメッセージを送信しましょう。
      </div>
    );
  }

  // メッセージを日付の新しい順に並べ替え
  const sortedMessages = [...messages].sort(
    (a, b) =>
      new Date(a.message.created_at).getTime() -
      new Date(b.message.created_at).getTime()
  );

  return (
    <div className="space-y-4">
      {sortedMessages.map((messageWithSender) => {
        const { message, sender } = messageWithSender;
        const isCurrentUser = message.sender_id === currentUserId;

        return (
          <div
            key={message.id}
            className={`flex ${isCurrentUser ? 'justify-end' : 'justify-start'}`}
          >
            <div className="flex max-w-[70%]">
              {/* アバター（自分のメッセージの場合は表示しない） */}
              {!isCurrentUser && (
                <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-500 mr-2 flex-shrink-0">
                  {sender.name.charAt(0).toUpperCase()}
                </div>
              )}

              {/* メッセージ */}
              <div>
                {/* 送信者名（自分のメッセージの場合は表示しない） */}
                {!isCurrentUser && (
                  <div className="text-xs text-gray-500 mb-1">
                    {sender.name}
                  </div>
                )}

                {/* メッセージ内容 */}
                <div
                  className={`rounded-lg px-4 py-2 inline-block ${
                    isCurrentUser
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-200 text-gray-800'
                  }`}
                >
                  {message.content}
                </div>

                {/* タイムスタンプ */}
                <div
                  className={`text-xs text-gray-500 mt-1 ${
                    isCurrentUser ? 'text-right' : 'text-left'
                  }`}
                >
                  {formatDistanceToNow(new Date(message.created_at), {
                    addSuffix: true,
                    locale: ja,
                  })}
                  {isCurrentUser && (
                    <span className="ml-2">
                      {message.is_read ? '既読' : '未読'}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default MessageList;
