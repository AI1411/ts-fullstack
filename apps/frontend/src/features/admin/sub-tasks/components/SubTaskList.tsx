'use client';

import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import type { SubTask } from '../controllers';
import { subTaskService } from '../services';

interface SubTaskListProps {
  taskId: number;
}

const SubTaskList = ({ taskId }: SubTaskListProps) => {
  const queryClient = useQueryClient();
  const [editingSubTaskId, setEditingSubTaskId] = useState<number | null>(null);
  const [editFormData, setEditFormData] = useState({
    title: '',
    description: '',
    status: '',
    due_date: '',
  });

  // サブタスク一覧を取得
  const {
    data: subTasks,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['subTasks', taskId],
    queryFn: () => subTaskService.getSubTasksByTaskId(taskId),
  });

  // 編集モードを開始
  const handleEdit = (subTask: SubTask) => {
    setEditingSubTaskId(subTask.id);
    setEditFormData({
      title: subTask.title,
      description: subTask.description || '',
      status: subTask.status,
      due_date: subTask.due_date || '',
    });
  };

  // 編集をキャンセル
  const handleCancelEdit = () => {
    setEditingSubTaskId(null);
  };

  // 編集フォームの入力値を更新
  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setEditFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // サブタスクを更新
  const handleUpdate = async (subTaskId: number) => {
    try {
      const updateData = {
        ...editFormData,
        task_id: taskId,
      };

      await subTaskService.updateSubTask(subTaskId, updateData);

      // 成功したらキャッシュを更新
      await queryClient.invalidateQueries({ queryKey: ['subTasks', taskId] });
      setEditingSubTaskId(null);
    } catch (error) {
      console.error('Error updating sub-task:', error);
    }
  };

  // サブタスクを削除
  const handleDelete = async (subTaskId: number) => {
    if (!confirm('このサブタスクを削除してもよろしいですか？')) return;

    try {
      await subTaskService.deleteSubTask(subTaskId);

      // 成功したらキャッシュを更新
      await queryClient.invalidateQueries({ queryKey: ['subTasks', taskId] });
    } catch (error) {
      console.error('Error deleting sub-task:', error);
    }
  };

  // ステータスに応じたバッジの色を返す
  const getStatusBadgeColor = (status: string) => {
    switch (status.toUpperCase()) {
      case 'COMPLETED':
        return 'bg-green-100 text-green-800';
      case 'IN_PROGRESS':
        return 'bg-blue-100 text-blue-800';
      case 'PENDING':
      default:
        return 'bg-yellow-100 text-yellow-800';
    }
  };

  if (isLoading) return <div className="p-4 text-center">読み込み中...</div>;
  if (error)
    return (
      <div className="p-4 text-center text-red-500">エラーが発生しました</div>
    );
  if (!subTasks || subTasks.length === 0)
    return (
      <div className="p-4 text-center text-gray-500">
        サブタスクはありません
      </div>
    );

  return (
    <div className="bg-gray-50 p-4 rounded-md">
      <h3 className="text-md font-medium text-gray-700 mb-3">サブタスク一覧</h3>
      <div className="space-y-2">
        {subTasks.map((subTask) => (
          <div
            key={subTask.id}
            className="bg-white p-3 rounded-md shadow-sm border border-gray-100"
          >
            {editingSubTaskId === subTask.id ? (
              <div className="space-y-2">
                <input
                  type="text"
                  name="title"
                  value={editFormData.title}
                  onChange={handleChange}
                  className="w-full px-2 py-1 border rounded"
                  placeholder="タイトル"
                />
                <textarea
                  name="description"
                  value={editFormData.description}
                  onChange={handleChange}
                  className="w-full px-2 py-1 border rounded"
                  placeholder="説明"
                  rows={2}
                />
                <div className="flex space-x-2">
                  <select
                    name="status"
                    value={editFormData.status}
                    onChange={handleChange}
                    className="px-2 py-1 border rounded"
                  >
                    <option value="PENDING">未着手</option>
                    <option value="IN_PROGRESS">進行中</option>
                    <option value="COMPLETED">完了</option>
                  </select>
                  <input
                    type="date"
                    name="due_date"
                    value={
                      editFormData.due_date
                        ? editFormData.due_date.split('T')[0]
                        : ''
                    }
                    onChange={handleChange}
                    className="px-2 py-1 border rounded"
                  />
                </div>
                <div className="flex justify-end space-x-2 mt-2">
                  <button
                    onClick={() => handleUpdate(subTask.id)}
                    className="px-3 py-1 bg-blue-500 text-white rounded-md text-sm"
                  >
                    保存
                  </button>
                  <button
                    onClick={handleCancelEdit}
                    className="px-3 py-1 bg-gray-300 text-gray-700 rounded-md text-sm"
                  >
                    キャンセル
                  </button>
                </div>
              </div>
            ) : (
              <div>
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-medium">{subTask.title}</h4>
                    {subTask.description && (
                      <p className="text-sm text-gray-600 mt-1">
                        {subTask.description}
                      </p>
                    )}
                  </div>
                  <div className="flex space-x-2">
                    <span
                      className={`text-xs px-2 py-1 rounded-full ${getStatusBadgeColor(subTask.status)}`}
                    >
                      {subTask.status === 'PENDING'
                        ? '未着手'
                        : subTask.status === 'IN_PROGRESS'
                          ? '進行中'
                          : '完了'}
                    </span>
                    {subTask.due_date && (
                      <span className="text-xs px-2 py-1 bg-gray-100 rounded-full">
                        {new Date(subTask.due_date).toLocaleDateString()}
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex justify-end space-x-2 mt-2">
                  <button
                    onClick={() => handleEdit(subTask)}
                    className="text-xs text-blue-600 hover:text-blue-800"
                  >
                    編集
                  </button>
                  <button
                    onClick={() => handleDelete(subTask.id)}
                    className="text-xs text-red-600 hover:text-red-800"
                  >
                    削除
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default SubTaskList;
