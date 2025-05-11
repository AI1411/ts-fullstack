'use client'

import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import Link from "next/link";
import { chatService } from "../services";
import { ChatWithUser } from "../controllers";
import { formatDistanceToNow } from "date-fns";
import { ja } from "date-fns/locale";
import { RiMessage2Line } from "react-icons/ri";

// 仮のユーザーID（実際の認証システムができたら変更する）
const CURRENT_USER_ID = 1;

const ChatList = () => {
  const [searchTerm, setSearchTerm] = useState("");

  // チャット一覧を取得
  const { data: chats = [], isLoading, error } = useQuery({
    queryKey: ['userChats', CURRENT_USER_ID],
    queryFn: () => chatService.getUserChats(CURRENT_USER_ID)
  });

  // 検索フィルター
  const filteredChats = chats.filter((chatWithUser: ChatWithUser) => 
    chatWithUser.otherUser.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (isLoading) {
    return (
      <div className="flex justify-center items-center p-8" data-testid="loading">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500" role="status"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 text-center text-red-500" data-testid="error">
        エラーが発生しました。再度お試しください。
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden" data-testid="chat-list">
      {/* 検索バー */}
      <div className="p-4 border-b border-gray-200">
        <input
          type="text"
          placeholder="ユーザー名で検索..."
          data-testid="search-input"
          className="w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* チャット一覧 */}
      <div className="divide-y divide-gray-200">
        {filteredChats.length > 0 ? (
          filteredChats.map((chatWithUser: ChatWithUser) => (
            <Link
              key={chatWithUser.chat.id}
              href={`/admin/chats/${chatWithUser.chat.id}`}
              className="block hover:bg-gray-50 transition-colors"
            >
              <div className="p-4 flex items-center">
                <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-500 mr-4">
                  {chatWithUser.otherUser.name.charAt(0).toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {chatWithUser.otherUser.name}
                  </p>
                  <p className="text-xs text-gray-500">
                    {formatDistanceToNow(new Date(chatWithUser.chat.updated_at), { 
                      addSuffix: true,
                      locale: ja
                    })}
                  </p>
                </div>
                <div className="ml-4">
                  <RiMessage2Line className="h-5 w-5 text-gray-400" />
                </div>
              </div>
            </Link>
          ))
        ) : (
          <div className="p-6 text-center text-gray-500">
            {searchTerm ? "検索結果がありません" : "チャットがありません"}
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatList;
