'use client'

import UserLayout from "@/features/user/layout/UserLayout";
import Hero from "@/features/user/home/components/Hero";
import FeaturedProducts from "@/features/user/home/components/FeaturedProducts";
import Categories from "@/features/user/home/components/Categories";
import Link from "next/link";

export default function Home() {
  return (
    <UserLayout>
      {/* ヒーローセクション */}
      <Hero />

      {/* おすすめ商品 */}
      <FeaturedProducts />

      {/* カテゴリー */}
      <Categories />

      {/* 管理画面へのリンク */}
      <div className="bg-gray-50 py-8 dark:bg-gray-900">
        <div className="mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
          <Link
            href="/management"
            className="inline-block rounded-md bg-gray-800 px-4 py-2 font-medium text-white transition-colors hover:bg-gray-700"
          >
            管理画面へ
          </Link>
        </div>
      </div>
    </UserLayout>
  );
}
