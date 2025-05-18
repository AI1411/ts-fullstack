'use client';

import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import type { User } from '../../users/controllers';
import { userService } from '../../users/services';
import { chatService } from '../services';

// 仮のユーザーID（実際の認証システムができたら変更する）
const CURRENT_USER_ID = 1;

const ChatForm = () => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [selectedUserId, setSelectedUserId] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // ユーザー一覧を取得
  const { data: users = [], isLoading } = useQuery({
    queryKey: ['users'],
    queryFn: userService.getUsers,
  });

  // 自分以外のユーザーをフィルタリング
  const otherUsers = users.filter((user: User) => user.id !== CURRENT_USER_ID);

  // チャットを作成
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!selectedUserId) {
      setError('ユーザーを選択してください');
      return;
    }

    setIsSubmitting(true);

    try {
      const chatData = {
        creator_id: CURRENT_USER_ID,
        recipient_id: Number.parseInt(selectedUserId),
      };

      const newChat = await chatService.createChat(chatData);

      // 成功したらフォームをリセットしてキャッシュを更新
      setSelectedUserId('');
      await queryClient.invalidateQueries({
        queryKey: ['userChats', CURRENT_USER_ID],
      });

      // 新しいチャットページに遷移
      router.push(`/admin/chats/${newChat.id}`);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'チャットの作成に失敗しました'
      );
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-lg font-semibold text-gray-800 mb-4">
        新しいチャットを開始
      </h2>

      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label
            htmlFor="recipient_id"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            ユーザーを選択
          </label>
          <select
            id="recipient_id"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            value={selectedUserId}
            onChange={(e) => setSelectedUserId(e.target.value)}
            disabled={isLoading || isSubmitting}
          >
            <option value="">ユーザーを選択してください</option>
            {otherUsers.map((user: User) => (
              <option key={user.id} value={user.id}>
                {user.name}
              </option>
            ))}
          </select>
        </div>

        {error && (
          <div className="mb-4 p-2 text-sm text-red-700 bg-red-100 rounded-md">
            {error}
          </div>
        )}

        <button
          type="submit"
          className="w-full bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={isLoading || isSubmitting}
        >
          {isSubmitting ? (
            <span className="flex items-center justify-center">
              <svg
                className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              処理中...
            </span>
          ) : (
            'チャットを開始'
          )}
        </button>
      </form>
    </div>
  );
};

export default ChatForm;
