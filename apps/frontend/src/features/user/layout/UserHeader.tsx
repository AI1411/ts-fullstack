'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import type React from 'react';
import { useState } from 'react';
import {
  RiCloseLine,
  RiMenuLine,
  RiMoonLine,
  RiSearchLine,
  RiShoppingCartLine,
  RiSunLine,
  RiUser3Line,
} from 'react-icons/ri';

const UserHeader: React.FC = () => {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  // ダークモードの切り替え
  const toggleDarkMode = () => {
    const newDarkMode = !darkMode;
    setDarkMode(newDarkMode);

    if (newDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('darkMode', 'true');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('darkMode', 'false');
    }
  };

  // ナビゲーションリンク
  const navLinks = [
    { name: 'ホーム', href: '/' },
    { name: '商品一覧', href: '/products' },
    { name: 'カテゴリー', href: '/categories' },
    { name: 'セール', href: '/sales' },
    { name: 'お問い合わせ', href: '/contact' },
  ];

  return (
    <header className="sticky top-0 z-40 w-full bg-white shadow-sm dark:bg-gray-800">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* ロゴ */}
          <div className="flex-shrink-0">
            <Link href="/" className="flex items-center">
              <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                ECサイト
              </span>
            </Link>
          </div>

          {/* デスクトップナビゲーション */}
          <nav className="hidden md:ml-6 md:flex md:space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className={`inline-flex items-center px-1 pt-1 text-sm font-medium ${
                  pathname === link.href
                    ? 'border-b-2 border-blue-500 text-gray-900 dark:border-blue-400 dark:text-white'
                    : 'border-b-2 border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 dark:text-gray-300 dark:hover:border-gray-600 dark:hover:text-gray-200'
                }`}
              >
                {link.name}
              </Link>
            ))}
          </nav>

          {/* 右側のアクション */}
          <div className="flex items-center space-x-4">
            {/* 検索ボタン */}
            <button className="rounded-full p-1 text-gray-500 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white">
              <RiSearchLine className="h-6 w-6" />
            </button>

            {/* ダークモード切り替え */}
            <button
              onClick={toggleDarkMode}
              data-testid="dark-mode-button"
              className="rounded-full p-1 text-gray-500 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
            >
              {darkMode ? (
                <RiSunLine className="h-6 w-6" />
              ) : (
                <RiMoonLine className="h-6 w-6" />
              )}
            </button>

            {/* カートボタン */}
            <Link
              href="/cart"
              className="relative rounded-full p-1 text-gray-500 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
            >
              <RiShoppingCartLine className="h-6 w-6" />
              <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-blue-500 text-xs font-bold text-white">
                3
              </span>
            </Link>

            {/* ユーザーボタン */}
            <Link
              href="/account"
              className="rounded-full p-1 text-gray-500 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
            >
              <RiUser3Line className="h-6 w-6" />
            </Link>

            {/* モバイルメニューボタン */}
            <div className="flex md:hidden">
              <button
                type="button"
                data-testid="mobile-menu-button"
                className="inline-flex items-center justify-center rounded-md p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                {mobileMenuOpen ? (
                  <RiCloseLine className="h-6 w-6" />
                ) : (
                  <RiMenuLine className="h-6 w-6" />
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* モバイルメニュー */}
      {mobileMenuOpen && (
        <div className="md:hidden">
          <div className="space-y-1 px-2 pb-3 pt-2">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className={`block rounded-md px-3 py-2 text-base font-medium ${
                  pathname === link.href
                    ? 'bg-blue-50 text-blue-600 dark:bg-blue-900/50 dark:text-blue-400'
                    : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-white'
                }`}
                onClick={() => setMobileMenuOpen(false)}
              >
                {link.name}
              </Link>
            ))}
          </div>
        </div>
      )}
    </header>
  );
};

export default UserHeader;
