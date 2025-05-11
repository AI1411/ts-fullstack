'use client'

import React from 'react';
import Link from 'next/link';
import { categories } from '@/features/user/categories/data/categories';

const Categories: React.FC = () => {
  return (
    <section className="bg-gray-100 py-12 dark:bg-gray-800 sm:py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8 flex flex-col items-center text-center">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white sm:text-3xl">
            カテゴリーから探す
          </h2>
          <p className="mt-2 text-gray-600 dark:text-gray-300">
            お探しの商品カテゴリーを選択してください
          </p>
          <Link
            href="/categories"
            className="mt-4 inline-flex items-center text-sm font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300"
          >
            すべてのカテゴリーを見る
            <span aria-hidden="true" className="ml-1">→</span>
          </Link>
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
