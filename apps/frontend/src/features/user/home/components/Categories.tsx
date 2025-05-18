'use client';

import Link from 'next/link';
import type React from 'react';
import { useEffect, useState } from 'react';

interface Category {
  id: number;
  name: string;
  description: string | null;
  created_at: string;
  updated_at: string;
  // Frontend-specific fields that we'll generate
  slug?: string;
  imageUrl?: string;
  href?: string;
}

const Categories: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        let response;
        try {
          response = await fetch('http://localhost:8080/categories');
        } catch (fetchError) {
          console.error('Error fetching categories:', fetchError);
          setError('カテゴリデータの取得に失敗しました');
          setLoading(false);
          return;
        }

        if (!response.ok) {
          throw new Error('カテゴリデータの取得に失敗しました');
        }

        let data;
        try {
          // Check if response is text/html instead of application/json
          const contentType = response.headers.get('content-type');
          if (contentType && contentType.includes('text/html')) {
            console.error('Received HTML response instead of JSON');
            throw new Error('Invalid JSON response from server');
          }

          const text = await response.text();
          // Check if the response starts with HTML doctype or tags
          if (
            text.trim().startsWith('<!DOCTYPE') ||
            text.trim().startsWith('<html')
          ) {
            console.error('Received HTML response instead of JSON');
            throw new Error('Invalid JSON response from server');
          }

          data = JSON.parse(text);
        } catch (jsonError) {
          console.error('Error parsing JSON response:', jsonError);
          throw new Error('Invalid JSON response from server');
        }

        // APIから取得したデータを変換して、フロントエンド用のフィールドを追加
        const categories = data.categories || [];
        const formattedCategories = categories.map((category: Category) => {
          // slugをnameから生成（簡易的な実装）
          const slug = category.name
            .toLowerCase()
            .replace(/\s+/g, '-')
            .replace(/[^\w\-]+/g, '');

          return {
            ...category,
            slug,
            // 実際のアプリでは、カテゴリごとに適切な画像を設定する必要があります
            imageUrl: getImageUrlForCategory(category.id),
            // If href property doesn't exist in the object, generate one
            // If href property exists but is undefined, use fallback '#'
            href:
              category.href === null
                ? '#'
                : category.href || `/categories/${slug}`,
            // Add a data-testid attribute to help with debugging
            testId:
              category.href === null
                ? 'category-with-null-href'
                : 'category-with-generated-href',
          };
        });

        setCategories(formattedCategories);
      } catch (err) {
        setError('カテゴリデータの取得に失敗しました');
        console.error('Error fetching categories:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  // カテゴリIDに基づいて画像URLを返す関数
  const getImageUrlForCategory = (id: number): string => {
    // 実際のアプリでは、カテゴリごとに適切な画像を設定する必要があります
    // ここでは簡易的に、IDに基づいてUnsplashの画像を返しています
    const imageUrls = [
      'https://images.unsplash.com/photo-1445205170230-053b83016050?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1471&q=80',
      'https://images.unsplash.com/photo-1550009158-9ebf69173e03?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1501&q=80',
      'https://images.unsplash.com/photo-1556228453-efd6c1ff04f6?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80',
      'https://images.unsplash.com/photo-1517466787929-bc90951d0974?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1626&q=80',
      'https://images.unsplash.com/photo-1596462502278-27bfdc403348?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1480&q=80',
      'https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80',
    ];

    // IDに基づいて画像を選択（循環させる）
    return imageUrls[(id - 1) % imageUrls.length];
  };

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
            <span aria-hidden="true" className="ml-1">
              →
            </span>
          </Link>
        </div>

        {/* ローディング状態 */}
        {loading && (
          <div className="flex justify-center py-10">
            <div
              role="status"
              className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"
            ></div>
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

        {/* カテゴリグリッド */}
        {!loading && !error && (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {categories.map((category) => (
              <Link
                key={category.id}
                href={category.href || '#'}
                data-testid={
                  category.testId ||
                  `category-link-${'href' in category && category.href === undefined ? 'fallback' : 'with-href'}`
                }
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
                    {category.description || ''}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default Categories;
