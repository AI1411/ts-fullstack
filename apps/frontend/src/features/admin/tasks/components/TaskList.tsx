'use client'

import {useQuery, useQueryClient} from "@tanstack/react-query";
import {useState} from "react";
import {taskService} from "../services";
import {userService} from "@/features/admin/users/services";
import {teamService} from "@/features/admin/teams/services";
import SubTaskList from "@/features/admin/sub-tasks/components/SubTaskList";
import SubTaskForm from "@/features/admin/sub-tasks/components/SubTaskForm";
import {RiAddLine, RiArrowDownSLine, RiArrowRightSLine} from "react-icons/ri";

// Task型定義
type Task = {
  id: number;
  title: string;
  description: string | null;
  status: string;
  user_id: number | null;
  team_id: number | null;
  due_date: string | null;
  created_at: string;
};

// Team型定義
type Team = {
  id: number;
  name: string;
};

// User型定義
type User = {
  id: number;
  name: string;
};

const TaskList = () => {
  const queryClient = useQueryClient();
  const [editingTaskId, setEditingTaskId] = useState<number | null>(null);
  const [expandedTaskId, setExpandedTaskId] = useState<number | null>(null);
  const [showSubTaskForm, setShowSubTaskForm] = useState<number | null>(null);
  const [editFormData, setEditFormData] = useState({
    title: "",
    description: "",
    status: "",
    user_id: "",
    team_id: "",
    due_date: ""
  });

  // Task一覧を取得
  const {data: tasks, isLoading, error} = useQuery({
    queryKey: ['tasks'],
    queryFn: taskService.getTasks
  });

  // Team一覧を取得
  const {data: teams} = useQuery({
    queryKey: ['teams'],
    queryFn: teamService.getTeams
  });

  // User一覧を取得
  const {data: users} = useQuery({
    queryKey: ['users'],
    queryFn: userService.getUsers
  });

  // 編集モードを開始
  const handleEdit = (task: Task) => {
    setEditingTaskId(task.id);
    setEditFormData({
      title: task.title,
      description: task.description || "",
      status: task.status,
      user_id: task.user_id ? task.user_id.toString() : "",
      team_id: task.team_id ? task.team_id.toString() : "",
      due_date: task.due_date || ""
    });
  };

  // 編集をキャンセル
  const handleCancelEdit = () => {
    setEditingTaskId(null);
  };

  // 編集フォームの入力値を更新
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const {name, value} = e.target;
    setEditFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Taskを更新
  const handleUpdate = async (taskId: number) => {
    try {
      const updateData = {
        ...editFormData,
        user_id: editFormData.user_id ? parseInt(editFormData.user_id) : null,
        team_id: editFormData.team_id ? parseInt(editFormData.team_id) : null
      };

      await taskService.updateTask(taskId, updateData);

      // 成功したらキャッシュを更新
      await queryClient.invalidateQueries({queryKey: ['tasks']});
      setEditingTaskId(null);
    } catch (error) {
      console.error('Error updating task:', error);
    }
  };

  // Taskを削除
  const handleDelete = async (taskId: number) => {
    if (!confirm('このタスクを削除してもよろしいですか？')) return;

    try {
      await taskService.deleteTask(taskId);

      // 成功したらキャッシュを更新
      await queryClient.invalidateQueries({queryKey: ['tasks']});
    } catch (error) {
      console.error('Error deleting task:', error);
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

  // ユーザー名を取得
  const getUserName = (userId: number | null) => {
    if (!userId) return '-';
    const user = users?.find(u => u.id === userId);
    return user ? user.name : '-';
  };

  // チーム名を取得
  const getTeamName = (teamId: number | null) => {
    if (!teamId) return '-';
    const team = teams?.find(t => t.id === teamId);
    return team ? team.name : '-';
  };

  // タスクの展開/折りたたみを切り替える
  const toggleExpand = (taskId: number) => {
    if (expandedTaskId === taskId) {
      setExpandedTaskId(null);
    } else {
      setExpandedTaskId(taskId);
    }
    // サブタスクフォームを閉じる
    setShowSubTaskForm(null);
  };

  // サブタスクフォームの表示/非表示を切り替える
  const toggleSubTaskForm = (taskId: number) => {
    if (showSubTaskForm === taskId) {
      setShowSubTaskForm(null);
    } else {
      setShowSubTaskForm(taskId);
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
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">担当者</th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">チーム</th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">期限</th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ステータス</th>
          <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">アクション
          </th>
        </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
        {tasks?.map(task => (
          <>
            <tr key={task.id} className={expandedTaskId === task.id ? 'bg-gray-50' : ''}>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{task.id}</td>
            <td className="px-6 py-4 whitespace-nowrap">
              {editingTaskId === task.id ? (
                <input
                  type="text"
                  name="title"
                  value={editFormData.title}
                  onChange={handleChange}
                  className="border rounded px-2 py-1 w-full"
                />
              ) : (
                <div className="text-sm font-medium text-gray-900">{task.title}</div>
              )}
            </td>
            <td className="px-6 py-4">
              {editingTaskId === task.id ? (
                <textarea
                  name="description"
                  value={editFormData.description}
                  onChange={handleChange}
                  className="border rounded px-2 py-1 w-full"
                  rows={2}
                />
              ) : (
                <div className="text-sm text-gray-500 max-w-xs truncate">
                  {task.description || '-'}
                </div>
              )}
            </td>
            <td className="px-6 py-4 whitespace-nowrap">
              {editingTaskId === task.id ? (
                <select
                  name="user_id"
                  value={editFormData.user_id}
                  onChange={handleChange}
                  className="border rounded px-2 py-1"
                >
                  <option value="">担当者なし</option>
                  {users?.map(user => (
                    <option key={user.id} value={user.id}>
                      {user.name}
                    </option>
                  ))}
                </select>
              ) : (
                <div className="text-sm text-gray-900">{getUserName(task.user_id)}</div>
              )}
            </td>
            <td className="px-6 py-4 whitespace-nowrap">
              {editingTaskId === task.id ? (
                <select
                  name="team_id"
                  value={editFormData.team_id}
                  onChange={handleChange}
                  className="border rounded px-2 py-1"
                >
                  <option value="">チームなし</option>
                  {teams?.map(team => (
                    <option key={team.id} value={team.id}>
                      {team.name}
                    </option>
                  ))}
                </select>
              ) : (
                <div className="text-sm text-gray-900">{getTeamName(task.team_id)}</div>
              )}
            </td>
            <td className="px-6 py-4 whitespace-nowrap">
              {editingTaskId === task.id ? (
                <input
                  type="date"
                  name="due_date"
                  value={editFormData.due_date}
                  onChange={handleChange}
                  className="border rounded px-2 py-1"
                />
              ) : (
                <div className="text-sm text-gray-900">
                  {task.due_date ? new Date(task.due_date).toLocaleDateString() : '-'}
                </div>
              )}
            </td>
            <td className="px-6 py-4 whitespace-nowrap">
              {editingTaskId === task.id ? (
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
                <span
                  className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadgeColor(task.status)}`}>
                    {task.status === 'PENDING' ? '未着手' :
                      task.status === 'IN_PROGRESS' ? '進行中' :
                        task.status === 'COMPLETED' ? '完了' : task.status}
                  </span>
              )}
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
              <div className="flex items-center justify-end space-x-2">
                {editingTaskId === task.id ? (
                  <>
                    <button
                      onClick={() => handleUpdate(task.id)}
                      className="text-indigo-600 hover:text-indigo-900"
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
                      onClick={() => toggleExpand(task.id)}
                      className="text-gray-600 hover:text-gray-900 flex items-center"
                    >
                      {expandedTaskId === task.id ? <RiArrowDownSLine /> : <RiArrowRightSLine />}
                    </button>
                    <button
                      onClick={() => toggleSubTaskForm(task.id)}
                      className="text-green-600 hover:text-green-900 flex items-center"
                      title="サブタスクを追加"
                    >
                      <RiAddLine />
                    </button>
                    <button
                      onClick={() => handleEdit(task)}
                      className="text-indigo-600 hover:text-indigo-900"
                    >
                      編集
                    </button>
                    <button
                      onClick={() => handleDelete(task.id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      削除
                    </button>
                  </>
                )}
              </div>
            </td>
          </tr>

          {/* サブタスク表示エリア */}
          {expandedTaskId === task.id && (
            <tr>
              <td colSpan={8} className="px-6 py-4">
                <SubTaskList taskId={task.id} />
              </td>
            </tr>
          )}

          {/* サブタスク追加フォーム */}
          {showSubTaskForm === task.id && (
            <tr>
              <td colSpan={8} className="px-6 py-4">
                <SubTaskForm
                  taskId={task.id}
                  onCancel={() => setShowSubTaskForm(null)}
                />
              </td>
            </tr>
          )}
        </>
        ))}
        </tbody>
      </table>
    </div>
  );
};

export default TaskList;
