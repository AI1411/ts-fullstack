'use client'

import React from 'react';
import { RiShoppingCartLine, RiDeleteBinLine } from 'react-icons/ri';

// Mock wishlist data for demonstration
const mockWishlistItems = [
  {
    id: 1,
    name: 'プレミアムレザーウォレット',
    price: 12800,
    image: 'https://images.unsplash.com/photo-1627123424574-724758594e93?q=80&w=2787&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    inStock: true,
  },
  {
    id: 2,
    name: 'クラシックデニムジャケット',
    price: 18500,
    image: 'https://images.unsplash.com/photo-1576995853123-5a10305d93c0?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    inStock: true,
  },
  {
    id: 3,
    name: 'ミニマリストバックパック',
    price: 9800,
    image: 'https://images.unsplash.com/photo-1622560480605-d83c853bc5c3?q=80&w=2960&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    inStock: false,
  },
];

const AccountWishlist: React.FC = () => {
  return (
    <div data-testid="wishlist-container" className="p-6">
      <h2 className="mb-6 text-xl font-semibold text-gray-900 dark:text-white">お気に入り商品</h2>

      <div data-testid="wishlist-grid" className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {mockWishlistItems.map((item) => (
          <div key={item.id} className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-800">
            <div className="relative h-48 w-full overflow-hidden">
              <img 
                src={item.image} 
                alt={item.name} 
                className="h-full w-full object-cover"
              />
              {!item.inStock && (
                <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50">
                  <span className="rounded-md bg-red-600 px-2 py-1 text-sm font-medium text-white">
                    在庫切れ
                  </span>
                </div>
              )}
            </div>
            <div className="p-4">
              <h3 className="mb-2 text-lg font-medium text-gray-900 dark:text-white">{item.name}</h3>
              <p className="mb-4 text-xl font-bold text-gray-900 dark:text-white">¥{item.price.toLocaleString()}</p>

              <div className="flex space-x-2">
                <button 
                  className={`flex flex-1 items-center justify-center rounded-md px-3 py-2 text-sm font-medium ${
                    item.inStock 
                      ? 'bg-blue-600 text-white hover:bg-blue-700' 
                      : 'cursor-not-allowed bg-gray-300 text-gray-500 dark:bg-gray-700 dark:text-gray-400'
                  }`}
                  disabled={!item.inStock}
                >
                  <RiShoppingCartLine className="mr-1 h-5 w-5" />
                  カートに追加
                </button>
                <button className="rounded-md border border-gray-300 p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-700 dark:border-gray-600 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white">
                  <RiDeleteBinLine className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {mockWishlistItems.length === 0 && (
        <div className="mt-4 rounded-lg bg-gray-50 p-6 text-center dark:bg-gray-800">
          <p className="text-gray-500 dark:text-gray-400">お気に入りに追加された商品はありません。</p>
        </div>
      )}
    </div>
  );
};

export default AccountWishlist;
