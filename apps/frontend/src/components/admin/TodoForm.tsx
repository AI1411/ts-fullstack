'use client'

import { client } from "@/utils/client";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";

// ユーザー型定義
type User = {
  id: number;
  name: string;
  email: string;
};

// ユーザー一覧を取得する関数
const getUsers = async () => {
  const res = await client.users.$get();
  const { users } = await res.json();
  return users as User[];
};

const TodoForm = () => {
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    user_id: "",
    status: "PENDING"
  });
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // ユーザー一覧を取得
  const { data: users } = useQuery({
    queryKey: ['users'],
    queryFn: getUsers
  });

  // フォームの入力値を更新
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Todoを追加
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      // user_idを数値に変換
      const todoData = {
        ...formData,
        user_id: formData.user_id ? parseInt(formData.user_id) : null
      };

      const res = await client.todos.$post({
        json: todoData
      });
      
      if (res.ok) {
        // 成功したらフォームをリセットしてキャッシュを更新
        setFormData({
          title: "",
          description: "",
          user_id: "",
          status: "PENDING"
        });
        await queryClient.invalidateQueries({ queryKey: ['todos'] });
      } else {
        const errorData = await res.json();
        setError(errorData.error || 'Todoの追加に失敗しました');
      }
    } catch (err) {
      setError('エラーが発生しました');
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white shadow-md rounded-lg p-6">
      <h2 className="text-lg font-semibold text-gray-800 mb-4">Todoを追加</h2>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}
      
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
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
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
            説明
          </label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        
        <div className="mb-4">
          <label htmlFor="user_id" className="block text-sm font-medium text-gray-700 mb-1">
            担当ユーザー
          </label>
          <select
            id="user_id"
            name="user_id"
            value={formData.user_id}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">担当者なし</option>
            {users?.map(user => (
              <option key={user.id} value={user.id}>
                {user.name} ({user.email})
              </option>
            ))}
          </select>
        </div>
        
        <div className="mb-4">
          <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
            ステータス
          </label>
          <select
            id="status"
            name="status"
            value={formData.status}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="PENDING">未着手</option>
            <option value="IN_PROGRESS">進行中</option>
            <option value="COMPLETED">完了</option>
          </select>
        </div>
        
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded transition-colors disabled:bg-blue-300"
        >
          {isSubmitting ? '送信中...' : 'Todoを追加'}
        </button>
      </form>
    </div>
  );
};

export default TodoForm;
