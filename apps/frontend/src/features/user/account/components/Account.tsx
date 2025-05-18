'use client';

import type React from 'react';
import { useState } from 'react';
import {
  RiHeartLine,
  RiLogoutBoxRLine,
  RiSettings4Line,
  RiShoppingBag3Line,
  RiUser3Line,
} from 'react-icons/ri';
import AccountOrders from './AccountOrders';
import AccountProfile from './AccountProfile';
import AccountSettings from './AccountSettings';
import AccountWishlist from './AccountWishlist';

// Mock user data for demonstration
const mockUser = {
  id: 1,
  name: '山田 太郎',
  email: 'yamada.taro@example.com',
  avatar:
    'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
  phone: '090-1234-5678',
  address: {
    postal: '123-4567',
    prefecture: '東京都',
    city: '渋谷区',
    line1: '渋谷1-2-3',
    line2: 'アパート101',
  },
  memberSince: '2022年10月',
};

type TabType = 'profile' | 'orders' | 'wishlist' | 'settings';

const Account: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>('profile');

  const tabs = [
    {
      id: 'profile',
      name: 'プロフィール',
      icon: <RiUser3Line className="h-5 w-5" />,
    },
    {
      id: 'orders',
      name: '注文履歴',
      icon: <RiShoppingBag3Line className="h-5 w-5" />,
    },
    {
      id: 'wishlist',
      name: 'お気に入り',
      icon: <RiHeartLine className="h-5 w-5" />,
    },
    {
      id: 'settings',
      name: '設定',
      icon: <RiSettings4Line className="h-5 w-5" />,
    },
  ];

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <h1 className="mb-8 text-2xl font-bold text-gray-900 dark:text-white">
        マイアカウント
      </h1>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-4">
        {/* サイドバーナビゲーション */}
        <div className="lg:col-span-1">
          <div className="overflow-hidden rounded-lg bg-white shadow dark:bg-gray-800">
            <div className="flex items-center space-x-4 p-4">
              <img
                src={mockUser.avatar}
                alt={mockUser.name}
                className="h-12 w-12 rounded-full"
              />
              <div>
                <h3 className="font-medium text-gray-900 dark:text-white">
                  {mockUser.name}
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {mockUser.email}
                </p>
              </div>
            </div>
            <div className="border-t border-gray-200 dark:border-gray-700">
              <nav className="flex flex-col">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as TabType)}
                    className={`flex items-center space-x-3 px-4 py-3 text-left text-sm font-medium ${
                      activeTab === tab.id
                        ? 'bg-blue-50 text-blue-600 dark:bg-blue-900/50 dark:text-blue-400'
                        : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-white'
                    }`}
                  >
                    {tab.icon}
                    <span>{tab.name}</span>
                  </button>
                ))}
                <button className="flex items-center space-x-3 px-4 py-3 text-left text-sm font-medium text-gray-700 hover:bg-gray-50 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-white">
                  <RiLogoutBoxRLine className="h-5 w-5" />
                  <span>ログアウト</span>
                </button>
              </nav>
            </div>
          </div>
        </div>

        {/* メインコンテンツ */}
        <div className="lg:col-span-3">
          <div className="overflow-hidden rounded-lg bg-white shadow dark:bg-gray-800">
            {activeTab === 'profile' && <AccountProfile user={mockUser} />}
            {activeTab === 'orders' && <AccountOrders />}
            {activeTab === 'wishlist' && <AccountWishlist />}
            {activeTab === 'settings' && <AccountSettings user={mockUser} />}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Account;
