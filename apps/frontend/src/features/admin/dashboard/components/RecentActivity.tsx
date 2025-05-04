'use client'

import React from 'react';
import {RiCheckLine, RiEdit2Line, RiUserAddLine} from 'react-icons/ri';

interface Activity {
  id: number;
  type: 'todo_completed' | 'user_added' | 'todo_updated';
  title: string;
  description: string;
  time: string;
}

const activities: Activity[] = [
  {
    id: 1,
    type: 'todo_completed',
    title: 'Todoが完了しました',
    description: 'プロジェクト計画書の作成',
    time: '5分前'
  },
  {
    id: 2,
    type: 'user_added',
    title: '新しいユーザーが追加されました',
    description: 'tanaka@example.com',
    time: '30分前'
  },
  {
    id: 3,
    type: 'todo_updated',
    title: 'Todoが更新されました',
    description: 'ミーティング資料の準備',
    time: '1時間前'
  },
  {
    id: 4,
    type: 'todo_completed',
    title: 'Todoが完了しました',
    description: 'クライアントへの提案書送付',
    time: '3時間前'
  },
  {
    id: 5,
    type: 'user_added',
    title: '新しいユーザーが追加されました',
    description: 'yamada@example.com',
    time: '昨日'
  }
];

const getActivityIcon = (type: Activity['type']) => {
  switch (type) {
    case 'todo_completed':
      return (
        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-green-500/20 text-green-500">
          <RiCheckLine className="h-5 w-5"/>
        </div>
      );
    case 'user_added':
      return (
        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-500/20 text-blue-500">
          <RiUserAddLine className="h-5 w-5"/>
        </div>
      );
    case 'todo_updated':
      return (
        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-yellow-500/20 text-yellow-500">
          <RiEdit2Line className="h-5 w-5"/>
        </div>
      );
    default:
      return null;
  }
};

const RecentActivity: React.FC = () => {
  return (
    <div className="rounded-md bg-white p-6 shadow-md dark:bg-gray-800">
      <h2 className="mb-6 text-xl font-semibold text-gray-800 dark:text-white">最近のアクティビティ</h2>

      <div className="space-y-5">
        {activities.map((activity) => (
          <div key={activity.id} className="flex items-start gap-4">
            {getActivityIcon(activity.type)}

            <div className="flex-1">
              <h3 className="text-sm font-medium text-gray-900 dark:text-white">
                {activity.title}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {activity.description}
              </p>
              <span className="mt-1 block text-xs text-gray-500">
                {activity.time}
              </span>
            </div>
          </div>
        ))}
      </div>

      <button
        className="mt-6 w-full rounded-md border border-gray-300 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-700">
        すべてのアクティビティを表示
      </button>
    </div>
  );
};

export default RecentActivity;
