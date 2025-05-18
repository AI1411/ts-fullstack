'use client';

import Link from 'next/link';
import type React from 'react';
import ProductCard from '../../products/components/ProductCard';

// セール商品データ
const saleProducts = [
  {
    id: 101,
    name: 'プレミアムレザーウォレット【セール】',
    price: 8980,
    description:
      '高品質な本革を使用した長財布。耐久性と美しさを兼ね備えたデザイン。期間限定30%オフ！',
    imageUrl:
      'https://images.unsplash.com/photo-1627123424574-724758594e93?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1374&q=80',
  },
  {
    id: 102,
    name: 'ワイヤレスノイズキャンセリングヘッドフォン【セール】',
    price: 24600,
    description:
      '最新のノイズキャンセリング技術を搭載したワイヤレスヘッドフォン。30時間のバッテリー寿命。期間限定25%オフ！',
    imageUrl:
      'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80',
  },
  {
    id: 103,
    name: 'オーガニックコットンTシャツ【セール】',
    price: 2980,
    description:
      '環境に優しいオーガニックコットン100%使用。肌触りが良く、着心地抜群のTシャツ。期間限定40%オフ！',
    imageUrl:
      'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1480&q=80',
  },
  {
    id: 104,
    name: 'スマートウォッチ プロ【セール】',
    price: 32800,
    description:
      '健康管理、通知、GPS機能を搭載した最新のスマートウォッチ。防水機能付き。期間限定20%オフ！',
    imageUrl:
      'https://images.unsplash.com/photo-1523275335684-37898b6baf30?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1399&q=80',
  },
  {
    id: 105,
    name: 'ポータブル充電器【セール】',
    price: 3980,
    description:
      '10000mAhの大容量バッテリー。複数のデバイスを同時に充電可能。コンパクトで持ち運びに便利。期間限定50%オフ！',
    imageUrl:
      'https://images.unsplash.com/photo-1583863788434-e58a36330cf0?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1074&q=80',
  },
  {
    id: 106,
    name: 'ステンレスウォーターボトル【セール】',
    price: 1980,
    description:
      '真空断熱構造で温かい飲み物も冷たい飲み物も長時間保温・保冷。環境に優しいエコボトル。期間限定30%オフ！',
    imageUrl:
      'https://images.unsplash.com/photo-1602143407151-7111542de6e8?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1587&q=80',
  },
];

const SalesProducts: React.FC = () => {
  return (
    <section className="py-12 sm:py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white sm:text-3xl">
            セール商品
          </h2>
          <Link
            href="/products"
            className="text-sm font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300"
          >
            すべての商品を見る
            <span aria-hidden="true"> &rarr;</span>
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {saleProducts.map((product) => (
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

export default SalesProducts;
