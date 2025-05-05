'use client'

import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useRef } from "react";
import { chatService } from "../services";
import { userService } from "../../users/services";
import MessageList from "./MessageList";
import MessageForm from "./MessageForm";
import { RiArrowLeftLine } from "react-icons/ri";
import Link from "next/link";

// 仮のユーザーID（実際の認証システムができたら変更する）
const CURRENT_USER_ID = 1;

interface ChatDetailProps {
  chatId: number;
}

const ChatDetail = ({ chatId }: ChatDetailProps) => {
  const queryClient = useQueryClient();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // チャット情報を取得
  const { data: chat, isLoading: chatLoading } = useQuery({
    queryKey: ['chat', chatId],
    queryFn: () => chatService.getChatById(chatId)
  });

  // チャットメッセージを取得
  const { data: messages = [], isLoading: messagesLoading } = useQuery({
    queryKey: ['chatMessages', chatId],
    queryFn: () => chatService.getChatMessages(chatId),
    refetchInterval: 5000 // 5秒ごとに自動更新
  });

  // 相手のユーザー情報を取得
  const otherUserId = chat ? (chat.creator_id === CURRENT_USER_ID ? chat.recipient_id : chat.creator_id) : null;
  const { data: otherUser } = useQuery({
    queryKey: ['user', otherUserId],
    queryFn: () => otherUserId ? userService.getUserById(otherUserId) : null,
    enabled: !!otherUserId
  });

  // メッセージを既読にする
  useEffect(() => {
    if (chatId && !messagesLoading) {
      chatService.markMessagesAsRead(chatId, CURRENT_USER_ID)
        .then(() => {
          // 未読メッセージカウントを更新
          queryClient.invalidateQueries({ queryKey: ['unreadMessageCount', CURRENT_USER_ID] });
        })
        .catch(error => {
          console.error('Failed to mark messages as read:', error);
        });
    }
  }, [chatId, messages, messagesLoading, queryClient]);

  // 新しいメッセージが来たら自動スクロール
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  if (chatLoading || messagesLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!chat) {
    return (
      <div className="p-6 text-center text-red-500">
        チャットが見つかりませんでした。
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow flex flex-col h-[calc(100vh-12rem)]">
      {/* ヘッダー */}
      <div className="p-4 border-b border-gray-200 flex items-center">
        <Link href="/admin/chats" className="mr-2 text-gray-500 hover:text-gray-700">
          <RiArrowLeftLine className="h-5 w-5" />
        </Link>
        <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-500 mr-3">
          {otherUser?.name.charAt(0).toUpperCase() || '?'}
        </div>
        <div>
          <h2 className="text-lg font-semibold text-gray-800">
            {otherUser?.name || 'ユーザー'}
          </h2>
        </div>
      </div>

      {/* メッセージリスト */}
      <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
        <MessageList messages={messages} currentUserId={CURRENT_USER_ID} />
        <div ref={messagesEndRef} />
      </div>

      {/* メッセージ入力フォーム */}
      <div className="p-4 border-t border-gray-200">
        <MessageForm chatId={chatId} />
      </div>
    </div>
  );
};

export default ChatDetail;
