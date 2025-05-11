'use client'

import React from 'react';
import { useParams } from 'next/navigation';
import UserLayout from '@/features/user/layout/UserLayout';
import ProductCard from '@/features/user/products/components/ProductCard';
import Link from 'next/link';
import { categories, productsByCategory } from '@/features/user/categories/data/categories';

export default function CategoryPage() {
  const params = useParams();
  const slug = params.slug as string;

  // カテゴリー情報を取得
  const category = categories.find(cat => cat.slug === slug);

  // カテゴリーに属する商品を取得
  const products = productsByCategory[slug as keyof typeof productsByCategory] || [];

  if (!category) {
    return (
      <UserLayout>
        <div className="py-12 text-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            カテゴリーが見つかりません
          </h1>
          <Link href="/" className="mt-4 inline-block text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300">
            ホームに戻る
          </Link>
        </div>
      </UserLayout>
    );
  }

  return (
    <UserLayout>
      {/* カテゴリーヘッダー */}
      <div className="relative">
        <div className="h-64 w-full overflow-hidden">
          <img
            src={category.imageUrl}
            alt={category.name}
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-black bg-opacity-40"></div>
        </div>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-white sm:text-4xl">
              {category.name}
            </h1>
            <p className="mt-2 text-lg text-white">
              {category.description}
            </p>
          </div>
        </div>
      </div>

      {/* 商品リスト */}
      <div className="py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-8 flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              {category.name}の商品一覧
            </h2>
            <Link
              href="/"
              className="text-sm font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300"
            >
              ホームに戻る
            </Link>
          </div>

          {products.length > 0 ? (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {products.map((product) => (
                <ProductCard
                  key={product.id}
                  id={product.id}
                  name={product.name}
                  price={product.price}
                  description={product.description}
                  imageUrl={product.imageUrl}
                />
              ))}
            </div>
          ) : (
            <div className="py-12 text-center">
              <p className="text-lg text-gray-600 dark:text-gray-300">
                このカテゴリーには商品がありません。
              </p>
            </div>
          )}
        </div>
      </div>
    </UserLayout>
  );
}
