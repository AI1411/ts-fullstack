'use client';

import { userService } from '@/features/admin/users/services';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import type { Notification } from '../controllers';
import { notificationService } from '../services';

// User型定義
type User = {
  id: number;
  name: string;
};

const NotificationList = () => {
  const queryClient = useQueryClient();
  const [editingNotificationId, setEditingNotificationId] = useState<
    number | null
  >(null);
  const [editFormData, setEditFormData] = useState({
    title: '',
    message: '',
    user_id: '',
    is_read: false,
  });

  // Notification一覧を取得
  const {
    data: notifications,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['notifications'],
    queryFn: notificationService.getNotifications,
  });

  // User一覧を取得
  const { data: users } = useQuery({
    queryKey: ['users'],
    queryFn: userService.getUsers,
  });

  // 編集モードを開始
  const handleEdit = (notification: Notification) => {
    setEditingNotificationId(notification.id);
    setEditFormData({
      title: notification.title,
      message: notification.message,
      user_id: notification.user_id ? notification.user_id.toString() : '',
      is_read: notification.is_read,
    });
  };

  // 編集をキャンセル
  const handleCancelEdit = () => {
    setEditingNotificationId(null);
  };

  // 編集フォームの入力値を更新
  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value, type } = e.target as HTMLInputElement;
    setEditFormData((prev) => ({
      ...prev,
      [name]:
        type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  // Notificationを更新
  const handleUpdate = async (notificationId: number) => {
    try {
      const updateData = {
        ...editFormData,
        user_id: editFormData.user_id
          ? Number.parseInt(editFormData.user_id)
          : null,
      };

      await notificationService.updateNotification(notificationId, updateData);

      // 成功したらキャッシュを更新
      await queryClient.invalidateQueries({ queryKey: ['notifications'] });
      setEditingNotificationId(null);
    } catch (error) {
      console.error('Error updating notification:', error);
    }
  };

  // Notificationを削除
  const handleDelete = async (notificationId: number) => {
    if (!confirm('この通知を削除してもよろしいですか？')) return;

    try {
      await notificationService.deleteNotification(notificationId);

      // 成功したらキャッシュを更新
      await queryClient.invalidateQueries({ queryKey: ['notifications'] });
    } catch (error) {
      console.error('Error deleting notification:', error);
    }
  };

  // 既読/未読を切り替え
  const handleToggleRead = async (notification: Notification) => {
    try {
      await notificationService.toggleNotificationReadStatus(
        notification.id,
        !notification.is_read
      );

      // 成功したらキャッシュを更新
      await queryClient.invalidateQueries({ queryKey: ['notifications'] });
    } catch (error) {
      console.error('Error updating notification read status:', error);
    }
  };

  // ユーザー名を取得
  const getUserName = (userId: number | null) => {
    if (!userId) return '-';
    const user = users?.find((u) => u.id === userId);
    return user ? user.name : '-';
  };

  if (isLoading) return <div className="text-center py-4">読み込み中...</div>;
  if (error)
    return (
      <div className="text-center py-4 text-red-500">エラーが発生しました</div>
    );

  return (
    <div className="bg-white shadow-md rounded-lg overflow-hidden">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              ID
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              タイトル
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              メッセージ
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              ユーザー
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              ステータス
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
          {notifications?.map((notification) => (
            <tr
              key={notification.id}
              className={notification.is_read ? '' : 'bg-blue-50'}
            >
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {notification.id}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                {editingNotificationId === notification.id ? (
                  <input
                    type="text"
                    name="title"
                    value={editFormData.title}
                    onChange={handleChange}
                    className="border rounded px-2 py-1 w-full"
                  />
                ) : (
                  <div className="text-sm font-medium text-gray-900">
                    {notification.title}
                  </div>
                )}
              </td>
              <td className="px-6 py-4">
                {editingNotificationId === notification.id ? (
                  <textarea
                    name="message"
                    value={editFormData.message}
                    onChange={handleChange}
                    className="border rounded px-2 py-1 w-full"
                    rows={2}
                  />
                ) : (
                  <div className="text-sm text-gray-500 max-w-xs truncate">
                    {notification.message}
                  </div>
                )}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                {editingNotificationId === notification.id ? (
                  <select
                    name="user_id"
                    value={editFormData.user_id}
                    onChange={handleChange}
                    className="border rounded px-2 py-1"
                  >
                    <option value="">全ユーザー</option>
                    {users?.map((user) => (
                      <option key={user.id} value={user.id}>
                        {user.name}
                      </option>
                    ))}
                  </select>
                ) : (
                  <div className="text-sm text-gray-900">
                    {getUserName(notification.user_id)}
                  </div>
                )}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                {editingNotificationId === notification.id ? (
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      name="is_read"
                      checked={editFormData.is_read}
                      onChange={handleChange}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label className="ml-2 text-sm text-gray-900">既読</label>
                  </div>
                ) : (
                  <button
                    onClick={() => handleToggleRead(notification)}
                    className={`px-2 py-1 text-xs font-semibold rounded-full ${
                      notification.is_read
                        ? 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                        : 'bg-blue-100 text-blue-800 hover:bg-blue-200'
                    }`}
                  >
                    {notification.is_read ? '既読' : '未読'}
                  </button>
                )}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {new Date(notification.created_at).toLocaleDateString()}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                {editingNotificationId === notification.id ? (
                  <>
                    <button
                      onClick={() => handleUpdate(notification.id)}
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
                      onClick={() => handleEdit(notification)}
                      className="text-indigo-600 hover:text-indigo-900 mr-3"
                    >
                      編集
                    </button>
                    <button
                      onClick={() => handleDelete(notification.id)}
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

export default NotificationList;
