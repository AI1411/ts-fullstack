'use client';

import { categories } from '@/features/user/categories/data/categories';
import UserLayout from '@/features/user/layout/UserLayout';
import Link from 'next/link';
import React from 'react';

export default function CategoriesPage() {
  return (
    <UserLayout>
      <div className="py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white sm:text-4xl">
              カテゴリー一覧
            </h1>
            <p className="mt-2 text-lg text-gray-600 dark:text-gray-300">
              お探しの商品カテゴリーを選択してください
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {categories.map((category) => (
              <Link
                key={category.id}
                href={`/categories/${category.slug}`}
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
      </div>
    </UserLayout>
  );
}
