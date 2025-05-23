'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  RiBuildingLine,
  RiDashboardLine,
  RiFileList3Line,
  RiFileTextLine,
  RiGlobalLine,
  RiHome2Line,
  RiMessage2Line,
  RiNotificationLine,
  RiProductHuntLine,
  RiTaskLine,
  RiTeamLine,
  RiUserLine,
} from 'react-icons/ri';

interface SidebarProps {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
}

const Sidebar = ({ sidebarOpen, setSidebarOpen }: SidebarProps) => {
  const pathname = usePathname();

  const isActive = (path: string) => {
    return pathname === path || pathname?.startsWith(path + '/');
  };

  return (
    <aside
      className={`fixed inset-y-0 left-0 z-50 flex h-screen w-72 flex-col overflow-y-hidden bg-white dark:bg-gray-800 duration-300 ease-linear lg:static lg:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}
    >
      {/* サイドバーヘッダー */}
      <div className="flex items-center justify-between gap-2 px-6 py-5 lg:py-6">
        <Link
          href="/management"
          className="text-2xl font-bold text-gray-900 dark:text-white"
        >
          管理画面
        </Link>
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="block lg:hidden text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-white"
        >
          <svg
            className="h-6 w-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M6 18L18 6M6 6l12 12"
            ></path>
          </svg>
        </button>
      </div>

      {/* サイドバーメニュー */}
      <div className="flex flex-col overflow-y-auto duration-300 ease-linear">
        <nav className="mt-5 px-4 py-4 lg:mt-9 lg:px-6">
          <div>
            <h3 className="mb-4 ml-4 text-sm font-medium text-gray-500 dark:text-gray-400">
              メインメニュー
            </h3>
            <ul className="mb-6 flex flex-col gap-1.5">
              {/* ダッシュボード */}
              <li>
                <Link
                  href="/management"
                  className={`group relative flex items-center gap-2.5 rounded-md px-4 py-2 font-medium duration-300 ease-in-out ${pathname === '/management' ? 'bg-blue-500 text-white' : 'text-gray-700 hover:bg-blue-500/10 dark:text-gray-300 dark:hover:bg-blue-500/10'}`}
                >
                  <RiDashboardLine className="text-xl" />
                  ダッシュボード
                </Link>
              </li>

              {/* 商品管理 */}
              <li>
                <Link
                  href="/admin/products"
                  className={`group relative flex items-center gap-2.5 rounded-md px-4 py-2 font-medium duration-300 ease-in-out ${isActive('/management/products') ? 'bg-blue-500 text-white' : 'text-gray-700 hover:bg-blue-500/10 dark:text-gray-300 dark:hover:bg-blue-500/10'}`}
                >
                  <RiProductHuntLine className="text-xl" />
                  商品管理
                </Link>
              </li>

              {/* 注文管理 */}
              <li>
                <Link
                  href="/admin/orders"
                  className={`group relative flex items-center gap-2.5 rounded-md px-4 py-2 font-medium duration-300 ease-in-out ${isActive('/management/orders') ? 'bg-blue-500 text-white' : 'text-gray-700 hover:bg-blue-500/10 dark:text-gray-300 dark:hover:bg-blue-500/10'}`}
                >
                  <RiFileList3Line className="text-xl" />
                  注文管理
                </Link>
              </li>

              {/* Todo管理 */}
              <li>
                <Link
                  href="/admin/todos"
                  className={`group relative flex items-center gap-2.5 rounded-md px-4 py-2 font-medium duration-300 ease-in-out ${isActive('/management/todos') ? 'bg-blue-500 text-white' : 'text-gray-700 hover:bg-blue-500/10 dark:text-gray-300 dark:hover:bg-blue-500/10'}`}
                >
                  <RiTaskLine className="text-xl" />
                  Todo管理
                </Link>
              </li>

              {/* ユーザー管理 */}
              <li>
                <Link
                  href="/admin/users"
                  className={`group relative flex items-center gap-2.5 rounded-md px-4 py-2 font-medium duration-300 ease-in-out ${isActive('/management/users') ? 'bg-blue-500 text-white' : 'text-gray-700 hover:bg-blue-500/10 dark:text-gray-300 dark:hover:bg-blue-500/10'}`}
                >
                  <RiUserLine className="text-xl" />
                  ユーザー管理
                </Link>
              </li>

              {/* タスク管理 */}
              <li>
                <Link
                  href="/admin/tasks"
                  className={`group relative flex items-center gap-2.5 rounded-md px-4 py-2 font-medium duration-300 ease-in-out ${isActive('/management/tasks') ? 'bg-blue-500 text-white' : 'text-gray-700 hover:bg-blue-500/10 dark:text-gray-300 dark:hover:bg-blue-500/10'}`}
                >
                  <RiTaskLine className="text-xl" />
                  タスク管理
                </Link>
              </li>

              {/* チーム管理 */}
              <li>
                <Link
                  href="/admin/teams"
                  className={`group relative flex items-center gap-2.5 rounded-md px-4 py-2 font-medium duration-300 ease-in-out ${isActive('/management/teams') ? 'bg-blue-500 text-white' : 'text-gray-700 hover:bg-blue-500/10 dark:text-gray-300 dark:hover:bg-blue-500/10'}`}
                >
                  <RiTeamLine className="text-xl" />
                  チーム管理
                </Link>
              </li>

              {/* 通知管理 */}
              <li>
                <Link
                  href="/admin/notifications"
                  className={`group relative flex items-center gap-2.5 rounded-md px-4 py-2 font-medium duration-300 ease-in-out ${isActive('/management/notifications') ? 'bg-blue-500 text-white' : 'text-gray-700 hover:bg-blue-500/10 dark:text-gray-300 dark:hover:bg-blue-500/10'}`}
                >
                  <RiNotificationLine className="text-xl" />
                  通知管理
                </Link>
              </li>

              {/* チャット管理 */}
              <li>
                <Link
                  href="/admin/chats"
                  className={`group relative flex items-center gap-2.5 rounded-md px-4 py-2 font-medium duration-300 ease-in-out ${isActive('/management/chats') ? 'bg-blue-500 text-white' : 'text-gray-700 hover:bg-blue-500/10 dark:text-gray-300 dark:hover:bg-blue-500/10'}`}
                >
                  <RiMessage2Line className="text-xl" />
                  チャット管理
                </Link>
              </li>

              {/* 国管理 */}
              <li>
                <Link
                  href="/admin/countries"
                  className={`group relative flex items-center gap-2.5 rounded-md px-4 py-2 font-medium duration-300 ease-in-out ${isActive('/management/countries') ? 'bg-blue-500 text-white' : 'text-gray-700 hover:bg-blue-500/10 dark:text-gray-300 dark:hover:bg-blue-500/10'}`}
                >
                  <RiGlobalLine className="text-xl" />
                  国管理
                </Link>
              </li>

              {/* 会社管理 */}
              <li>
                <Link
                  href="/admin/companies"
                  className={`group relative flex items-center gap-2.5 rounded-md px-4 py-2 font-medium duration-300 ease-in-out ${isActive('/management/companies') ? 'bg-blue-500 text-white' : 'text-gray-700 hover:bg-blue-500/10 dark:text-gray-300 dark:hover:bg-blue-500/10'}`}
                >
                  <RiBuildingLine className="text-xl" />
                  会社管理
                </Link>
              </li>

              {/* 領収書管理 */}
              <li>
                <Link
                  href="/admin/invoices"
                  className={`group relative flex items-center gap-2.5 rounded-md px-4 py-2 font-medium duration-300 ease-in-out ${isActive('/management/invoices') ? 'bg-blue-500 text-white' : 'text-gray-700 hover:bg-blue-500/10 dark:text-gray-300 dark:hover:bg-blue-500/10'}`}
                >
                  <RiFileTextLine className="text-xl" />
                  領収書管理
                </Link>
              </li>
            </ul>
          </div>
        </nav>
      </div>

      {/* フッター */}
      <div className="mt-auto px-6 py-4 border-t border-gray-200 dark:border-gray-700">
        <Link
          href="/"
          className="flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-blue-500 dark:text-gray-400 dark:hover:text-white"
        >
          <RiHome2Line className="text-lg" />
          トップページに戻る
        </Link>
      </div>
    </aside>
  );
};

export default Sidebar;
