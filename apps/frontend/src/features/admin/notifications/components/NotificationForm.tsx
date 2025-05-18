'use client';

import { userService } from '@/features/admin/users/services';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { notificationService } from '../services';

// ユーザー型定義
type User = {
  id: number;
  name: string;
  email: string;
};

const NotificationForm = () => {
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState({
    title: '',
    message: '',
    user_id: '',
    is_read: false,
  });
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // ユーザー一覧を取得
  const { data: users } = useQuery({
    queryKey: ['users'],
    queryFn: userService.getUsers,
  });

  // フォームの入力値を更新
  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value, type } = e.target as HTMLInputElement;
    setFormData((prev) => ({
      ...prev,
      [name]:
        type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  // 通知を追加
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      // user_idを数値に変換
      const notificationData = {
        ...formData,
        user_id: formData.user_id ? Number.parseInt(formData.user_id) : null,
      };

      await notificationService.createNotification(notificationData);

      // 成功したらフォームをリセットしてキャッシュを更新
      setFormData({
        title: '',
        message: '',
        user_id: '',
        is_read: false,
      });
      await queryClient.invalidateQueries({ queryKey: ['notifications'] });
    } catch (err) {
      setError(err instanceof Error ? err.message : '通知の追加に失敗しました');
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white shadow-md rounded-lg p-6">
      <h2 className="text-lg font-semibold text-gray-800 mb-4">通知を追加</h2>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label
            htmlFor="title"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            タイトル
          </label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div className="mb-4">
          <label
            htmlFor="message"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            メッセージ
          </label>
          <textarea
            id="message"
            name="message"
            value={formData.message}
            onChange={handleChange}
            required
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div className="mb-4">
          <label
            htmlFor="user_id"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            ユーザー
          </label>
          <select
            id="user_id"
            name="user_id"
            value={formData.user_id}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">全ユーザー</option>
            {users?.map((user) => (
              <option key={user.id} value={user.id}>
                {user.name} ({user.email})
              </option>
            ))}
          </select>
        </div>

        <div className="mb-4 flex items-center">
          <input
            type="checkbox"
            id="is_read"
            name="is_read"
            checked={formData.is_read}
            onChange={handleChange}
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          />
          <label htmlFor="is_read" className="ml-2 block text-sm text-gray-900">
            既読としてマーク
          </label>
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded transition-colors disabled:bg-blue-300"
        >
          {isSubmitting ? '送信中...' : '通知を追加'}
        </button>
      </form>
    </div>
  );
};

export default NotificationForm;
