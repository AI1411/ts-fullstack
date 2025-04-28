'use client'

import Link from "next/link";
import {client} from "@/utils/client";
import {useQuery} from "@tanstack/react-query";
import StatisticsCard from "@/components/admin/dashboard/StatisticsCard";
import RecentActivity from "@/components/admin/dashboard/RecentActivity";
import Chart from "@/components/admin/dashboard/Chart";
import {RiCheckLine, RiTaskLine, RiTimeLine, RiUserLine} from "react-icons/ri";

// Todo型定義
type Todo = {
  id: number;
  user_id: number | null;
  title: string;
  description: string | null;
  status: string | null;
  created_at: string;
  updated_at: string;
};

// ユーザー型定義
type User = {
  id: number;
  name: string;
  email: string;
  password: string;
  created_at: string;
  updated_at: string;
};

// Todo一覧を取得する関数
const getTodos = async () => {
  const res = await client.todos.$get();
  const data = await res.json();
  
  // Check if the response contains an error
  if ('error' in data) {
    throw new Error(data.error);
  }
  
  return data.todos as Todo[];
};

// ユーザー一覧を取得する関数
const getUsers = async () => {
  const res = await client.users.$get();
  const data = await res.json();
  
  // Check if the response contains an error
  if ('error' in data) {
    throw new Error(data.error);
  }
  
  return data.users as User[];
};

export default function AdminDashboard() {
  // Todoとユーザーのデータを取得
  const {data: todos = []} = useQuery({queryKey: ['todos'], queryFn: getTodos});
  const {data: users = []} = useQuery({queryKey: ['users'], queryFn: getUsers});

  // 完了済みTodoの数を計算
  const completedTodos = todos.filter((todo: Todo) => todo.status === 'COMPLETED').length;

  // 進行中のTodoの数を計算
  const inProgressTodos = todos.filter((todo: Todo) => todo.status === 'IN_PROGRESS').length;

  return (
    <div className="space-y-6">
      {/* 統計情報 */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6 xl:grid-cols-4">
        <StatisticsCard
          title="ユーザー数"
          value={users.length}
          icon={<RiUserLine className="h-6 w-6"/>}
          trend={{value: "5%", isUp: true}}
        />

        <StatisticsCard
          title="Todo数"
          value={todos.length}
          icon={<RiTaskLine className="h-6 w-6"/>}
          trend={{value: "12%", isUp: true}}
        />

        <StatisticsCard
          title="完了済み"
          value={completedTodos}
          icon={<RiCheckLine className="h-6 w-6"/>}
          trend={{value: "8%", isUp: true}}
        />

        <StatisticsCard
          title="進行中"
          value={inProgressTodos}
          icon={<RiTimeLine className="h-6 w-6"/>}
          trend={{value: "3%", isUp: false}}
        />
      </div>

      {/* メインコンテンツ */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
        {/* クイックアクセス */}
        <div className="xl:col-span-1">
          <div className="rounded-md bg-white p-6 shadow-md dark:bg-gray-800">
            <h2 className="mb-6 text-xl font-semibold text-gray-800 dark:text-white">クイックアクセス</h2>
            <div className="space-y-4">
              <Link
                href="/admin/todos"
                className="flex items-center justify-between rounded-md bg-blue-50 p-4 text-blue-600 transition-colors hover:bg-blue-100 dark:bg-blue-500/10 dark:text-blue-400 dark:hover:bg-blue-500/20"
              >
                <div className="flex items-center gap-3">
                  <RiTaskLine className="h-6 w-6"/>
                  <span className="font-medium">Todo管理</span>
                </div>
                <span className="text-sm">{todos.length} 件</span>
              </Link>

              <Link
                href="/admin/users"
                className="flex items-center justify-between rounded-md bg-purple-50 p-4 text-purple-600 transition-colors hover:bg-purple-100 dark:bg-purple-500/10 dark:text-purple-400 dark:hover:bg-purple-500/20"
              >
                <div className="flex items-center gap-3">
                  <RiUserLine className="h-6 w-6"/>
                  <span className="font-medium">ユーザー管理</span>
                </div>
                <span className="text-sm">{users.length} 件</span>
              </Link>
            </div>
          </div>
        </div>

        {/* 最近のアクティビティ */}
        <div className="xl:col-span-2">
          <RecentActivity/>
        </div>
      </div>

      {/* システム情報 */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <Chart title="システム情報">
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-gray-200 pb-3 dark:border-gray-700">
              <span className="text-sm font-medium text-gray-600 dark:text-gray-400">システム名</span>
              <span className="text-sm font-medium text-gray-900 dark:text-white">Todo管理システム</span>
            </div>
            <div className="flex items-center justify-between border-b border-gray-200 pb-3 dark:border-gray-700">
              <span className="text-sm font-medium text-gray-600 dark:text-gray-400">バージョン</span>
              <span className="text-sm font-medium text-gray-900 dark:text-white">1.0.0</span>
            </div>
            <div className="flex items-center justify-between border-b border-gray-200 pb-3 dark:border-gray-700">
              <span className="text-sm font-medium text-gray-600 dark:text-gray-400">最終更新日</span>
              <span
                className="text-sm font-medium text-gray-900 dark:text-white">{new Date().toLocaleDateString()}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-600 dark:text-gray-400">ステータス</span>
              <span
                className="rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800 dark:bg-green-500/20 dark:text-green-400">正常稼働中</span>
            </div>
          </div>
        </Chart>

        <Chart title="Todoステータス">
          <div className="space-y-4">
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-600 dark:text-gray-400">未着手</span>
                <span className="text-sm font-medium text-gray-900 dark:text-white">
                  {todos.filter((todo: Todo) => todo.status === 'PENDING').length} 件
                </span>
              </div>
              <div className="h-2 w-full overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700">
                <div
                  className="h-full rounded-full bg-yellow-500"
                  style={{
                    width: `${(todos.filter((todo: Todo) => todo.status === 'PENDING').length / todos.length) * 100}%`,
                  }}
                ></div>
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-600 dark:text-gray-400">進行中</span>
                <span className="text-sm font-medium text-gray-900 dark:text-white">
                  {inProgressTodos} 件
                </span>
              </div>
              <div className="h-2 w-full overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700">
                <div
                  className="h-full rounded-full bg-blue-500"
                  style={{
                    width: `${(inProgressTodos / todos.length) * 100}%`,
                  }}
                ></div>
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-600 dark:text-gray-400">完了</span>
                <span className="text-sm font-medium text-gray-900 dark:text-white">
                  {completedTodos} 件
                </span>
              </div>
              <div className="h-2 w-full overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700">
                <div
                  className="h-full rounded-full bg-green-500"
                  style={{
                    width: `${(completedTodos / todos.length) * 100}%`,
                  }}
                ></div>
              </div>
            </div>
          </div>
        </Chart>
      </div>
    </div>
  );
}
