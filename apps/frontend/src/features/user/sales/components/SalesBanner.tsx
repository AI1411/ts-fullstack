'use client';

import Link from 'next/link';
import type React from 'react';

const SalesBanner: React.FC = () => {
  return (
    <div className="relative bg-gradient-to-r from-blue-600 to-indigo-700 py-16 sm:py-24">
      <div className="absolute inset-0">
        <div className="h-1/3 bg-white sm:h-2/3"></div>
      </div>
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl lg:text-5xl">
            期間限定セール開催中！
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-xl text-gray-100">
            最大50%オフの特別価格でお買い得。お見逃しなく！
          </p>
          <div className="mt-8 flex justify-center">
            <div className="inline-flex rounded-md shadow">
              <Link
                href="#sales-products"
                className="inline-flex items-center justify-center rounded-md border border-transparent bg-white px-5 py-3 text-base font-medium text-blue-600 hover:bg-gray-50"
              >
                セール商品を見る
              </Link>
            </div>
            <div className="ml-3 inline-flex">
              <Link
                href="/products"
                className="inline-flex items-center justify-center rounded-md border border-transparent bg-blue-100 px-5 py-3 text-base font-medium text-blue-700 hover:bg-blue-200"
              >
                すべての商品
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* セール終了カウントダウン */}
      <div className="mt-10 text-center">
        <div className="mx-auto max-w-xl rounded-lg bg-white bg-opacity-10 p-4 backdrop-blur-sm">
          <p className="text-lg font-medium text-white">セール終了まで</p>
          <div className="mt-2 flex justify-center space-x-4">
            <div className="flex flex-col items-center">
              <span className="text-2xl font-bold text-white">3</span>
              <span className="text-sm text-gray-200">日</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-2xl font-bold text-white">12</span>
              <span className="text-sm text-gray-200">時間</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-2xl font-bold text-white">45</span>
              <span className="text-sm text-gray-200">分</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-2xl font-bold text-white">30</span>
              <span className="text-sm text-gray-200">秒</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SalesBanner;
