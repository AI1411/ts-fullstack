'use client'

import { client } from "@/utils/client";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";

// ユーザー型定義
type User = {
  id: number;
  name: string;
  email: string;
  created_at: string;
};

// ユーザー一覧を取得する関数
const getUsers = async () => {
  const res = await client.users.$get();
  const { users } = await res.json();
  return users as User[];
};

const UserList = () => {
  const queryClient = useQueryClient();
  const [editingUserId, setEditingUserId] = useState<number | null>(null);
  const [editFormData, setEditFormData] = useState({
    name: "",
    email: "",
  });

  // ユーザー一覧を取得
  const { data: users, isLoading, error } = useQuery({
    queryKey: ['users'],
    queryFn: getUsers
  });

  // 編集モードを開始
  const handleEdit = (user: User) => {
    setEditingUserId(user.id);
    setEditFormData({
      name: user.name,
      email: user.email,
    });
  };

  // 編集をキャンセル
  const handleCancelEdit = () => {
    setEditingUserId(null);
  };

  // 編集フォームの入力値を更新
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEditFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // ユーザーを更新
  const handleUpdate = async (userId: number) => {
    try {
      const res = await client.users[':id'].$put({
        param: { id: userId.toString() },
        json: editFormData
      });
      
      if (res.ok) {
        // 成功したらキャッシュを更新
        await queryClient.invalidateQueries({ queryKey: ['users'] });
        setEditingUserId(null);
      } else {
        console.error('Failed to update user');
      }
    } catch (error) {
      console.error('Error updating user:', error);
    }
  };

  // ユーザーを削除
  const handleDelete = async (userId: number) => {
    if (!confirm('このユーザーを削除してもよろしいですか？')) return;
    
    try {
      const res = await client.users[':id'].$delete({
        param: { id: userId.toString() }
      });
      
      if (res.ok) {
        // 成功したらキャッシュを更新
        await queryClient.invalidateQueries({ queryKey: ['users'] });
      } else {
        console.error('Failed to delete user');
      }
    } catch (error) {
      console.error('Error deleting user:', error);
    }
  };

  if (isLoading) return <div className="text-center py-4">読み込み中...</div>;
  if (error) return <div className="text-center py-4 text-red-500">エラーが発生しました</div>;

  return (
    <div className="bg-white shadow-md rounded-lg overflow-hidden">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">名前</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">メールアドレス</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">作成日</th>
            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">アクション</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {users?.map(user => (
            <tr key={user.id}>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.id}</td>
              <td className="px-6 py-4 whitespace-nowrap">
                {editingUserId === user.id ? (
                  <input
                    type="text"
                    name="name"
                    value={editFormData.name}
                    onChange={handleChange}
                    className="border rounded px-2 py-1 w-full"
                  />
                ) : (
                  <div className="text-sm font-medium text-gray-900">{user.name}</div>
                )}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                {editingUserId === user.id ? (
                  <input
                    type="email"
                    name="email"
                    value={editFormData.email}
                    onChange={handleChange}
                    className="border rounded px-2 py-1 w-full"
                  />
                ) : (
                  <div className="text-sm text-gray-500">{user.email}</div>
                )}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {new Date(user.created_at).toLocaleDateString()}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                {editingUserId === user.id ? (
                  <>
                    <button
                      onClick={() => handleUpdate(user.id)}
                      className="text-indigo-600 hover:text-indigo-900 mr-3"
                    >
                      保存
                    </button>
                    <button
                      onClick={handleCancelEdit}
                      className="text-gray-600 hover:text-gray-900"
                    >
                      キャンセル
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={() => handleEdit(user)}
                      className="text-indigo-600 hover:text-indigo-900 mr-3"
                    >
                      編集
                    </button>
                    <button
                      onClick={() => handleDelete(user.id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      削除
                    </button>
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UserList;
