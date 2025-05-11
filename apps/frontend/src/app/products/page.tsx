'use client'

import React from 'react';
import UserLayout from '@/features/user/layout/UserLayout';
import ProductGrid from '@/features/user/products/components/ProductGrid';
import { productsByCategory } from '@/features/user/categories/data/categories';

export default function ProductsPage() {
  // すべてのカテゴリーから商品を取得して一つの配列にまとめる
  const allProducts = Object.values(productsByCategory).flat();

  return (
    <UserLayout>
      <div className="py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white sm:text-4xl">
              商品一覧
            </h1>
            <p className="mt-2 text-lg text-gray-600 dark:text-gray-300">
              当店の厳選された商品コレクションをご覧ください
            </p>
          </div>

          {/* 商品グリッド */}
          <ProductGrid products={allProducts} />
        </div>
      </div>
    </UserLayout>
  );
}