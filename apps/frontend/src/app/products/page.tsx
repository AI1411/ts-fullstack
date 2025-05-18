'use client';

import UserLayout from '@/features/user/layout/UserLayout';
import ProductGrid from '@/features/user/products/components/ProductGrid';
import React, { useState, useEffect } from 'react';

interface Product {
  id: number;
  name: string;
  price: number;
  description: string | null;
  image_url: string | null;
  stock: number;
  category_id: number | null;
  created_at: string;
  updated_at: string;
}

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch('http://localhost:8080/products');
        if (!response.ok) {
          throw new Error('商品データの取得に失敗しました');
        }
        const data = await response.json();

        // APIから取得したデータをProductGrid用に変換
        const formattedProducts = data.products.map((product: Product) => ({
          id: product.id,
          name: product.name,
          price: product.price,
          description: product.description || '',
          imageUrl: product.image_url || '/images/placeholder.jpg', // 画像がない場合のプレースホルダー
        }));

        setProducts(formattedProducts);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : '商品データの取得に失敗しました'
        );
        console.error('Error fetching products:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

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

          {/* ローディング状態 */}
          {loading && (
            <div className="flex justify-center py-10">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          )}

          {/* エラー状態 */}
          {error && (
            <div className="text-center py-10">
              <p className="text-red-500">{error}</p>
              <button
                onClick={() => window.location.reload()}
                className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                再読み込み
              </button>
            </div>
          )}

          {/* 商品グリッド */}
          {!loading && !error && <ProductGrid products={products} />}
        </div>
      </div>
    </UserLayout>
  );
}
