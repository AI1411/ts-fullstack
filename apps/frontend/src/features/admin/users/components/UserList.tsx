'use client';

import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import type { User } from '../controllers';
import { userService } from '../services';

const UserList = () => {
  const queryClient = useQueryClient();
  const [editingUserId, setEditingUserId] = useState<number | null>(null);
  const [editFormData, setEditFormData] = useState({
    name: '',
    email: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);

  // User一覧を取得
  const {
    data: users,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['users'],
    queryFn: userService.getUsers,
  });

  // 編集モードを開始
  const handleEdit = (user: User) => {
    setEditingUserId(user.id);
    setEditFormData({
      name: user.name,
      email: user.email,
      password: '',
    });
  };

  // 編集をキャンセル
  const handleCancelEdit = () => {
    setEditingUserId(null);
  };

  // 編集フォームの入力値を更新
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEditFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Userを更新
  const handleUpdate = async (userId: number) => {
    try {
      // パスワードが空の場合は更新しない
      const updateData = {
        name: editFormData.name,
        email: editFormData.email,
        ...(editFormData.password ? { password: editFormData.password } : {}),
      };

      await userService.updateUser(userId, updateData);

      // 成功したらキャッシュを更新
      await queryClient.invalidateQueries({ queryKey: ['users'] });
      setEditingUserId(null);
    } catch (error) {
      console.error('Error updating user:', error);
    }
  };

  // Userを削除
  const handleDelete = async (userId: number) => {
    if (!confirm('このユーザーを削除してもよろしいですか？')) return;

    try {
      await userService.deleteUser(userId);

      // 成功したらキャッシュを更新
      await queryClient.invalidateQueries({ queryKey: ['users'] });
    } catch (error) {
      console.error('Error deleting user:', error);
    }
  };

  if (isLoading)
    return (
      <div className="text-center py-4" data-testid="loading">
        読み込み中...
      </div>
    );
  if (error)
    return (
      <div className="text-center py-4 text-red-500" data-testid="error">
        エラーが発生しました
      </div>
    );

  return (
    <div
      className="bg-white shadow-md rounded-lg overflow-hidden"
      data-testid="user-list"
    >
      <table
        className="min-w-full divide-y divide-gray-200"
        data-testid="user-table"
      >
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              ID
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              名前
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              メールアドレス
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              作成日
            </th>
            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
              アクション
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {users?.map((user) => (
            <tr key={user.id}>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {user.id}
              </td>
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
                  <div className="text-sm font-medium text-gray-900">
                    {user.name}
                  </div>
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
                    <div className="mb-2 flex items-center">
                      <input
                        type={showPassword ? 'text' : 'password'}
                        name="password"
                        value={editFormData.password}
                        onChange={handleChange}
                        placeholder="新しいパスワード（変更する場合）"
                        className="border rounded px-2 py-1 w-full mr-2"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="text-gray-500 hover:text-gray-700"
                      >
                        {showPassword ? '隠す' : '表示'}
                      </button>
                    </div>
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
