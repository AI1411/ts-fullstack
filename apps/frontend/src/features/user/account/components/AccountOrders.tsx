'use client'

import React from 'react';
import { RiEyeLine, RiFileDownloadLine } from 'react-icons/ri';

// Mock orders data for demonstration
const mockOrders = [
  {
    id: 'ORD-2023-0001',
    date: '2023年12月15日',
    status: '配送済み',
    total: 32800,
    items: 3,
  },
  {
    id: 'ORD-2023-0002',
    date: '2023年11月28日',
    status: '配送済み',
    total: 15600,
    items: 2,
  },
  {
    id: 'ORD-2023-0003',
    date: '2023年10月10日',
    status: '配送済み',
    total: 9800,
    items: 1,
  },
];

const AccountOrders: React.FC = () => {
  return (
    <div className="p-6">
      <h2 className="mb-6 text-xl font-semibold text-gray-900 dark:text-white">注文履歴</h2>
      
      <div className="overflow-hidden rounded-lg border border-gray-200 dark:border-gray-700">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-50 dark:bg-gray-800">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                注文番号
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                注文日
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                ステータス
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                商品数
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                合計
              </th>
              <th scope="col" className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                アクション
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 bg-white dark:divide-gray-700 dark:bg-gray-900">
            {mockOrders.map((order) => (
              <tr key={order.id}>
                <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-blue-600 dark:text-blue-400">
                  {order.id}
                </td>
                <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                  {order.date}
                </td>
                <td className="whitespace-nowrap px-6 py-4 text-sm">
                  <span className="inline-flex rounded-full bg-green-100 px-2 text-xs font-semibold leading-5 text-green-800 dark:bg-green-900/30 dark:text-green-500">
                    {order.status}
                  </span>
                </td>
                <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                  {order.items}点
                </td>
                <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                  ¥{order.total.toLocaleString()}
                </td>
                <td className="whitespace-nowrap px-6 py-4 text-right text-sm font-medium">
                  <div className="flex justify-end space-x-2">
                    <button className="rounded p-1 text-gray-500 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white">
                      <RiEyeLine className="h-5 w-5" />
                    </button>
                    <button className="rounded p-1 text-gray-500 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white">
                      <RiFileDownloadLine className="h-5 w-5" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {mockOrders.length === 0 && (
        <div className="mt-4 rounded-lg bg-gray-50 p-6 text-center dark:bg-gray-800">
          <p className="text-gray-500 dark:text-gray-400">注文履歴がありません。</p>
        </div>
      )}
    </div>
  );
};

export default AccountOrders;