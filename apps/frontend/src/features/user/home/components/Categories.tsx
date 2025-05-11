'use client'

import React from 'react';
import Link from 'next/link';

// サンプルカテゴリーデータ
const categories = [
  {
    id: 1,
    name: 'ファッション',
    description: 'トレンドのアパレルやアクセサリー',
    imageUrl: 'https://images.unsplash.com/photo-1445205170230-053b83016050?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1471&q=80',
    href: '/categories/fashion',
  },
  {
    id: 2,
    name: 'エレクトロニクス',
    description: '最新のガジェットとテクノロジー',
    imageUrl: 'https://images.unsplash.com/photo-1550009158-9ebf69173e03?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1501&q=80',
    href: '/categories/electronics',
  },
  {
    id: 3,
    name: 'ホーム＆リビング',
    description: '家具やインテリア、キッチン用品',
    imageUrl: 'https://images.unsplash.com/photo-1556228453-efd6c1ff04f6?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80',
    href: '/categories/home',
  },
  {
    id: 4,
    name: 'スポーツ＆アウトドア',
    description: 'スポーツ用品やアウトドアギア',
    imageUrl: 'https://images.unsplash.com/photo-1517466787929-bc90951d0974?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1626&q=80',
    href: '/categories/sports',
  },
  {
    id: 5,
    name: 'ビューティー＆ヘルス',
    description: '化粧品や健康関連商品',
    imageUrl: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1480&q=80',
    href: '/categories/beauty',
  },
  {
    id: 6,
    name: 'キッズ＆ベビー',
    description: '子供用品やベビー用品',
    imageUrl: 'https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80',
    href: '/categories/kids',
  },
];

const Categories: React.FC = () => {
  return (
    <section className="bg-gray-100 py-12 dark:bg-gray-800 sm:py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8 text-center">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white sm:text-3xl">
            カテゴリーから探す
          </h2>
          <p className="mt-2 text-gray-600 dark:text-gray-300">
            お探しの商品カテゴリーを選択してください
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((category) => (
            <Link
              key={category.id}
              href={category.href}
              className="group overflow-hidden rounded-lg bg-white shadow-md transition-transform hover:-translate-y-1 hover:shadow-lg dark:bg-gray-700"
            >
              <div className="aspect-h-2 aspect-w-3 w-full overflow-hidden">
                <img
                  src={category.imageUrl}
                  alt={category.name}
                  className="h-full w-full object-cover object-center transition-transform duration-300 group-hover:scale-105"
                />
              </div>
              <div className="p-4">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                  {category.name}
                </h3>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-300">
                  {category.description}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Categories;