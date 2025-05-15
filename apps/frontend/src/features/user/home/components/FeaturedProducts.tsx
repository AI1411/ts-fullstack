'use client'

import React from 'react';
import Link from 'next/link';
import ProductCard from '../../products/components/ProductCard';

// サンプル商品データ
const sampleProducts = [
  {
    id: 1,
    name: 'プレミアムレザーウォレット',
    price: 12800,
    description: '高品質な本革を使用した長財布。耐久性と美しさを兼ね備えたデザイン。',
    imageUrl: 'https://images.unsplash.com/photo-1627123424574-724758594e93?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1374&q=80',
  },
  {
    id: 2,
    name: 'ワイヤレスノイズキャンセリングヘッドフォン',
    price: 32800,
    description: '最新のノイズキャンセリング技術を搭載したワイヤレスヘッドフォン。30時間のバッテリー寿命。',
    imageUrl: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80',
  },
  {
    id: 3,
    name: 'オーガニックコットンTシャツ',
    price: 4900,
    description: '環境に優しいオーガニックコットン100%使用。肌触りが良く、着心地抜群のTシャツ。',
    imageUrl: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1480&q=80',
  },
  {
    id: 4,
    name: 'スマートウォッチ プロ',
    price: 42800,
    description: '健康管理、通知、GPS機能を搭載した最新のスマートウォッチ。防水機能付き。',
    imageUrl: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1399&q=80',
  },
];

const FeaturedProducts: React.FC = () => {
  return (
    <section className="py-12 sm:py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white sm:text-3xl">
            おすすめ商品
          </h2>
          <Link
            href="/products"
            className="text-sm font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300"
          >
            すべての商品を見る
            <span aria-hidden="true"> &rarr;</span>
          </Link>
        </div>

        <div data-testid="products-grid" className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {sampleProducts.map((product) => (
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
      </div>
    </section>
  );
};

export default FeaturedProducts;
