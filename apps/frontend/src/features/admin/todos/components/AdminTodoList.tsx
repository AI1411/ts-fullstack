'use client'

import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { todoService } from "../services";
import { Todo } from "../controllers";

const AdminTodoList = () => {
  const queryClient = useQueryClient();
  const [editingTodoId, setEditingTodoId] = useState<number | null>(null);
  const [editFormData, setEditFormData] = useState({
    title: "",
    description: "",
    status: ""
  });

  // Todo一覧を取得
  const { data: todos, isLoading, error } = useQuery({
    queryKey: ['todos'],
    queryFn: todoService.getTodos
  });

  // 編集モードを開始
  const handleEdit = (todo: Todo) => {
    setEditingTodoId(todo.id);
    setEditFormData({
      title: todo.title,
      description: todo.description || "",
      status: todo.status || "PENDING"
    });
  };

  // 編集をキャンセル
  const handleCancelEdit = () => {
    setEditingTodoId(null);
  };

  // 編集フォームの入力値を更新
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setEditFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Todoを更新
  const handleUpdate = async (todoId: number) => {
    try {
      await todoService.updateTodo(todoId, editFormData);
      
      // 成功したらキャッシュを更新
      await queryClient.invalidateQueries({ queryKey: ['todos'] });
      setEditingTodoId(null);
    } catch (error) {
      console.error('Error updating todo:', error);
    }
  };

  // Todoを削除
  const handleDelete = async (todoId: number) => {
    if (!confirm('このTodoを削除してもよろしいですか？')) return;
    
    try {
      await todoService.deleteTodo(todoId);
      
      // 成功したらキャッシュを更新
      await queryClient.invalidateQueries({ queryKey: ['todos'] });
    } catch (error) {
      console.error('Error deleting todo:', error);
    }
  };

  // ステータスに応じたバッジの色を返す
  const getStatusBadgeColor = (status: string) => {
    switch (status?.toUpperCase()) {
      case 'COMPLETED':
        return 'bg-green-100 text-green-800';
      case 'IN_PROGRESS':
        return 'bg-blue-100 text-blue-800';
      case 'PENDING':
      default:
        return 'bg-yellow-100 text-yellow-800';
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
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">タイトル</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">説明</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ステータス</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">作成日</th>
            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">アクション</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {todos?.map(todo => (
            <tr key={todo.id}>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{todo.id}</td>
              <td className="px-6 py-4 whitespace-nowrap">
                {editingTodoId === todo.id ? (
                  <input
                    type="text"
                    name="title"
                    value={editFormData.title}
                    onChange={handleChange}
                    className="border rounded px-2 py-1 w-full"
                  />
                ) : (
                  <div className="text-sm font-medium text-gray-900">{todo.title}</div>
                )}
              </td>
              <td className="px-6 py-4">
                {editingTodoId === todo.id ? (
                  <textarea
                    name="description"
                    value={editFormData.description}
                    onChange={handleChange}
                    className="border rounded px-2 py-1 w-full"
                    rows={2}
                  />
                ) : (
                  <div className="text-sm text-gray-500 max-w-xs truncate">
                    {todo.description || '-'}
                  </div>
                )}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                {editingTodoId === todo.id ? (
                  <select
                    name="status"
                    value={editFormData.status}
                    onChange={handleChange}
                    className="border rounded px-2 py-1"
                  >
                    <option value="PENDING">未着手</option>
                    <option value="IN_PROGRESS">進行中</option>
                    <option value="COMPLETED">完了</option>
                  </select>
                ) : (
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadgeColor(todo.status)}`}>
                    {todo.status === 'PENDING' ? '未着手' : 
                     todo.status === 'IN_PROGRESS' ? '進行中' : 
                     todo.status === 'COMPLETED' ? '完了' : todo.status}
                  </span>
                )}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {new Date(todo.created_at).toLocaleDateString()}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                {editingTodoId === todo.id ? (
                  <>
                    <button
                      onClick={() => handleUpdate(todo.id)}
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
                      onClick={() => handleEdit(todo)}
                      className="text-indigo-600 hover:text-indigo-900 mr-3"
                    >
                      編集
                    </button>
                    <button
                      onClick={() => handleDelete(todo.id)}
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

export default AdminTodoList;
