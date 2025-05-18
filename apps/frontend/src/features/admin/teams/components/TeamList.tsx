'use client';

import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import type { Team } from '../controllers';
import { teamService } from '../services';

const TeamList = () => {
  const queryClient = useQueryClient();
  const [editingTeamId, setEditingTeamId] = useState<number | null>(null);
  const [editFormData, setEditFormData] = useState({
    name: '',
    description: '',
  });

  // Team一覧を取得
  const {
    data: teams,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['teams'],
    queryFn: teamService.getTeams,
  });

  // 編集モードを開始
  const handleEdit = (team: Team) => {
    setEditingTeamId(team.id);
    setEditFormData({
      name: team.name,
      description: team.description || '',
    });
  };

  // 編集をキャンセル
  const handleCancelEdit = () => {
    setEditingTeamId(null);
  };

  // 編集フォームの入力値を更新
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setEditFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Teamを更新
  const handleUpdate = async (teamId: number) => {
    try {
      await teamService.updateTeam(teamId, editFormData);

      // 成功したらキャッシュを更新
      await queryClient.invalidateQueries({ queryKey: ['teams'] });
      setEditingTeamId(null);
    } catch (error) {
      console.error('Error updating team:', error);
    }
  };

  // Teamを削除
  const handleDelete = async (teamId: number) => {
    if (!confirm('このチームを削除してもよろしいですか？')) return;

    try {
      await teamService.deleteTeam(teamId);

      // 成功したらキャッシュを更新
      await queryClient.invalidateQueries({ queryKey: ['teams'] });
    } catch (error) {
      console.error('Error deleting team:', error);
    }
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
              チーム名
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              説明
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
          {teams?.map((team) => (
            <tr key={team.id}>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {team.id}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                {editingTeamId === team.id ? (
                  <input
                    type="text"
                    name="name"
                    value={editFormData.name}
                    onChange={handleChange}
                    className="border rounded px-2 py-1 w-full"
                  />
                ) : (
                  <div className="text-sm font-medium text-gray-900">
                    {team.name}
                  </div>
                )}
              </td>
              <td className="px-6 py-4">
                {editingTeamId === team.id ? (
                  <textarea
                    name="description"
                    value={editFormData.description}
                    onChange={handleChange}
                    className="border rounded px-2 py-1 w-full"
                    rows={2}
                  />
                ) : (
                  <div className="text-sm text-gray-500 max-w-xs truncate">
                    {team.description || '-'}
                  </div>
                )}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {new Date(team.created_at).toLocaleDateString()}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                {editingTeamId === team.id ? (
                  <>
                    <button
                      onClick={() => handleUpdate(team.id)}
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
                      onClick={() => handleEdit(team)}
                      className="text-indigo-600 hover:text-indigo-900 mr-3"
                    >
                      編集
                    </button>
                    <button
                      onClick={() => handleDelete(team.id)}
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

export default TeamList;
