'use client';

import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import {
  RiMenuLine,
  RiMoonLine,
  RiNotification3Line,
  RiSunLine,
} from 'react-icons/ri';

interface HeaderProps {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
}

const Header = ({ sidebarOpen, setSidebarOpen }: HeaderProps) => {
  const pathname = usePathname();
  const [darkMode, setDarkMode] = useState(false);

  // ダークモードの切り替え
  useEffect(() => {
    // ローカルストレージから設定を読み込む
    const isDarkMode = localStorage.getItem('darkMode') === 'true';
    setDarkMode(isDarkMode);

    // HTML要素にクラスを追加/削除
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, []);

  const toggleDarkMode = () => {
    const newDarkMode = !darkMode;
    setDarkMode(newDarkMode);
    localStorage.setItem('darkMode', newDarkMode.toString());

    if (newDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  // パスに基づいてタイトルを設定
  const getTitle = () => {
    if (pathname === '/admin') return 'ダッシュボード';
    if (pathname === '/admin/todos') return 'Todo管理';
    if (pathname === '/admin/users') return 'ユーザー管理';
    return '管理画面';
  };

  return (
    <header className="sticky top-0 z-40 flex w-full bg-white drop-shadow-sm dark:bg-gray-800 dark:drop-shadow-none">
      <div className="flex flex-grow items-center justify-between px-4 py-4 shadow-sm md:px-6 2xl:px-11">
        <div className="flex items-center gap-2 sm:gap-4 lg:hidden">
          {/* モバイル用メニューボタン */}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="z-50 block rounded-md p-1.5 text-gray-700 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700 lg:hidden"
          >
            <RiMenuLine className="h-6 w-6" />
          </button>

          {/* モバイル用タイトル */}
          <h1 className="text-xl font-semibold text-gray-900 dark:text-white lg:hidden">
            {getTitle()}
          </h1>
        </div>

        {/* デスクトップ用タイトル */}
        <div className="hidden lg:block">
          <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
            {getTitle()}
          </h1>
        </div>

        {/* 右側メニュー */}
        <div className="flex items-center gap-3 2xsm:gap-6">
          {/* ダークモード切り替え */}
          <button
            onClick={toggleDarkMode}
            className="flex h-9 w-9 items-center justify-center rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            {darkMode ? (
              <RiSunLine className="h-5 w-5 text-gray-600 dark:text-gray-400" />
            ) : (
              <RiMoonLine className="h-5 w-5 text-gray-600" />
            )}
          </button>

          {/* 通知アイコン */}
          <button className="relative flex h-9 w-9 items-center justify-center rounded-full hover:bg-gray-100 dark:hover:bg-gray-700">
            <RiNotification3Line className="h-5 w-5 text-gray-600 dark:text-gray-400" />
            <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-xs font-medium text-white">
              4
            </span>
          </button>

          {/* ユーザーアイコン */}
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-semibold">
              A
            </div>
            <span className="hidden text-right lg:block">
              <span className="block text-sm font-medium text-gray-800 dark:text-gray-300">
                管理者
              </span>
              <span className="block text-xs text-gray-500">
                admin@example.com
              </span>
            </span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
