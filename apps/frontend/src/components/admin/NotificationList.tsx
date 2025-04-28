'use client'

import { client } from "@/utils/client";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";

// Notification型定義
type Notification = {
  id: number;
  user_id: number | null;
  title: string;
  message: string;
  is_read: boolean;
  created_at: string;
};

// User型定義
type User = {
  id: number;
  name: string;
};

// Notification一覧を取得する関数
const getNotifications = async () => {
  const res = await client.notifications.$get();
  const data = await res.json();
  return data.notifications as Notification[];
};

// User一覧を取得する関数
const getUsers = async () => {
  const res = await client.users.$get();
  const data = await res.json();
  return data.users as User[];
};

const NotificationList = () => {
  const queryClient = useQueryClient();
  const [editingNotificationId, setEditingNotificationId] = useState<number | null>(null);
  const [editFormData, setEditFormData] = useState({
    title: "",
    message: "",
    user_id: "",
    is_read: false
  });

  // Notification一覧を取得
  const { data: notifications, isLoading, error } = useQuery({
    queryKey: ['notifications'],
    queryFn: getNotifications
  });

  // User一覧を取得
  const { data: users } = useQuery({
    queryKey: ['users'],
    queryFn: getUsers
  });

  // 編集モードを開始
  const handleEdit = (notification: Notification) => {
    setEditingNotificationId(notification.id);
    setEditFormData({
      title: notification.title,
      message: notification.message,
      user_id: notification.user_id ? notification.user_id.toString() : "",
      is_read: notification.is_read
    });
  };

  // 編集をキャンセル
  const handleCancelEdit = () => {
    setEditingNotificationId(null);
  };

  // 編集フォームの入力値を更新
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target as HTMLInputElement;
    setEditFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));
  };

  // Notificationを更新
  const handleUpdate = async (notificationId: number) => {
    try {
      const updateData = {
        ...editFormData,
        user_id: editFormData.user_id ? parseInt(editFormData.user_id) : null
      };

      const res = await client.notifications[':id'].$put({
        param: { id: notificationId.toString() },
        json: updateData
      });
      
      if (res.ok) {
        // 成功したらキャッシュを更新
        await queryClient.invalidateQueries({ queryKey: ['notifications'] });
        setEditingNotificationId(null);
      } else {
        console.error('Failed to update notification');
      }
    } catch (error) {
      console.error('Error updating notification:', error);
    }
  };

  // Notificationを削除
  const handleDelete = async (notificationId: number) => {
    if (!confirm('この通知を削除してもよろしいですか？')) return;
    
    try {
      const res = await client.notifications[':id'].$delete({
        param: { id: notificationId.toString() }
      });
      
      if (res.ok) {
        // 成功したらキャッシュを更新
        await queryClient.invalidateQueries({ queryKey: ['notifications'] });
      } else {
        console.error('Failed to delete notification');
      }
    } catch (error) {
      console.error('Error deleting notification:', error);
    }
  };

  // 既読/未読を切り替え
  const handleToggleRead = async (notification: Notification) => {
    try {
      const res = await client.notifications[':id'].$put({
        param: { id: notification.id.toString() },
        json: { is_read: !notification.is_read }
      });
      
      if (res.ok) {
        // 成功したらキャッシュを更新
        await queryClient.invalidateQueries({ queryKey: ['notifications'] });
      } else {
        console.error('Failed to update notification read status');
      }
    } catch (error) {
      console.error('Error updating notification read status:', error);
    }
  };

  // ユーザー名を取得
  const getUserName = (userId: number | null) => {
    if (!userId) return '-';
    const user = users?.find(u => u.id === userId);
    return user ? user.name : '-';
  };

  if (isLoading) return <div className="text-center py-4">読み込み中...</div>;
  if (error) return <div className="text-center py-4 text-red-500">エラーが発生しました</div>;

  return (
    <div className="bg-white shadow-md rounded-lg overflow-hidden">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">タイトル</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">メッセージ</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ユーザー</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ステータス</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">作成日</th>
            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">アクション</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {notifications?.map(notification => (
            <tr key={notification.id} className={notification.is_read ? '' : 'bg-blue-50'}>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{notification.id}</td>
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
                  <div className="text-sm font-medium text-gray-900">{notification.title}</div>
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
                    <option value="">ユーザーなし</option>
                    {users?.map(user => (
                      <option key={user.id} value={user.id}>
                        {user.name}
                      </option>
                    ))}
                  </select>
                ) : (
                  <div className="text-sm text-gray-900">{getUserName(notification.user_id)}</div>
                )}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                {editingNotificationId === notification.id ? (
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      name="is_read"
                      checked={editFormData.is_read}
                      onChange={handleChange}
                      className="mr-2"
                    />
                    <span className="text-sm">既読</span>
                  </label>
                ) : (
                  <span
                    className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      notification.is_read
                        ? 'bg-green-100 text-green-800'
                        : 'bg-yellow-100 text-yellow-800'
                    }`}
                  >
                    {notification.is_read ? '既読' : '未読'}
                  </span>
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
                      onClick={() => handleToggleRead(notification)}
                      className="text-blue-600 hover:text-blue-900 mr-3"
                    >
                      {notification.is_read ? '未読にする' : '既読にする'}
                    </button>
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