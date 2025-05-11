'use client'

import React from 'react';
import { useParams } from 'next/navigation';
import UserLayout from '@/features/user/layout/UserLayout';
import { productsByCategory } from '@/features/user/categories/data/categories';
import Link from 'next/link';

export default function ProductDetailPage() {
  const params = useParams();
  const productId = Number(params.id);
  
  // すべての商品から指定されたIDの商品を検索
  const allProducts = Object.values(productsByCategory).flat();
  const product = allProducts.find(p => p.id === productId);

  // 商品が見つからない場合
  if (!product) {
    return (
      <UserLayout>
        <div className="py-12">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              商品が見つかりません
            </h1>
            <p className="mt-4 text-lg text-gray-600 dark:text-gray-300">
              指定された商品は存在しないか、削除された可能性があります。
            </p>
            <div className="mt-8">
              <Link
                href="/products"
                className="rounded-md bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
              >
                商品一覧に戻る
              </Link>
            </div>
          </div>
        </div>
      </UserLayout>
    );
  }

  return (
    <UserLayout>
      <div className="py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="lg:grid lg:grid-cols-2 lg:gap-x-8">
            {/* 商品画像 */}
            <div className="aspect-h-1 aspect-w-1 overflow-hidden rounded-lg">
              <img
                src={product.imageUrl}
                alt={product.name}
                className="h-full w-full object-cover object-center"
              />
            </div>

            {/* 商品情報 */}
            <div className="mt-10 lg:mt-0">
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                {product.name}
              </h1>
              <div className="mt-4">
                <p className="text-2xl font-medium text-gray-900 dark:text-white">
                  ¥{product.price.toLocaleString()}
                </p>
              </div>
              <div className="mt-6">
                <h2 className="text-lg font-medium text-gray-900 dark:text-white">
                  商品説明
                </h2>
                <p className="mt-2 text-gray-600 dark:text-gray-300">
                  {product.description}
                </p>
              </div>
              <div className="mt-8">
                <button
                  className="w-full rounded-md bg-blue-500 px-4 py-3 text-center font-medium text-white hover:bg-blue-600"
                >
                  カートに追加
                </button>
              </div>
              <div className="mt-4">
                <Link
                  href="/products"
                  className="text-sm font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300"
                >
                  &larr; 商品一覧に戻る
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </UserLayout>
  );
}