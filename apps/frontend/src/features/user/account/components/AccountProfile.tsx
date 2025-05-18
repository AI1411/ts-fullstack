'use client';

import type React from 'react';

interface User {
  id: number;
  name: string;
  email: string;
  avatar: string;
  phone: string;
  address: {
    postal: string;
    prefecture: string;
    city: string;
    line1: string;
    line2: string;
  };
  memberSince: string;
}

interface AccountProfileProps {
  user: User;
}

const AccountProfile: React.FC<AccountProfileProps> = ({ user }) => {
  return (
    <div className="p-6">
      <h2 className="mb-6 text-xl font-semibold text-gray-900 dark:text-white">
        プロフィール情報
      </h2>

      <div className="mb-8 flex flex-col items-center sm:flex-row sm:items-start">
        <div className="mb-4 sm:mb-0 sm:mr-6">
          <img
            src={user.avatar}
            alt={user.name}
            className="h-24 w-24 rounded-full"
          />
        </div>
        <div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">
            {user.name}
          </h3>
          <p className="text-gray-500 dark:text-gray-400">
            会員登録日: {user.memberSince}
          </p>
          <button className="mt-2 rounded-md bg-blue-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-blue-700">
            プロフィール画像を変更
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <div>
          <h3 className="mb-3 text-lg font-medium text-gray-900 dark:text-white">
            基本情報
          </h3>
          <div className="space-y-4 rounded-lg bg-gray-50 p-4 dark:bg-gray-700/50">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">氏名</p>
              <p className="font-medium text-gray-900 dark:text-white">
                {user.name}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                メールアドレス
              </p>
              <p className="font-medium text-gray-900 dark:text-white">
                {user.email}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                電話番号
              </p>
              <p className="font-medium text-gray-900 dark:text-white">
                {user.phone}
              </p>
            </div>
          </div>
          <button className="mt-3 rounded-md border border-gray-300 bg-white px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700">
            基本情報を編集
          </button>
        </div>

        <div>
          <h3 className="mb-3 text-lg font-medium text-gray-900 dark:text-white">
            住所情報
          </h3>
          <div className="space-y-4 rounded-lg bg-gray-50 p-4 dark:bg-gray-700/50">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                郵便番号
              </p>
              <p className="font-medium text-gray-900 dark:text-white">
                {user.address.postal}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">住所</p>
              <p className="font-medium text-gray-900 dark:text-white">
                {user.address.prefecture}
                {user.address.city}
                {user.address.line1}
              </p>
              <p className="font-medium text-gray-900 dark:text-white">
                {user.address.line2}
              </p>
            </div>
          </div>
          <button className="mt-3 rounded-md border border-gray-300 bg-white px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700">
            住所情報を編集
          </button>
        </div>
      </div>
    </div>
  );
};

export default AccountProfile;
