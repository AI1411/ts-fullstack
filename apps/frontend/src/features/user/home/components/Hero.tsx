'use client'

import React from 'react';
import Link from 'next/link';

const Hero: React.FC = () => {
  return (
    <div data-testid="hero-container" className="relative overflow-hidden bg-gradient-to-r from-blue-500 to-purple-600 py-16 sm:py-24">
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/90 to-purple-600/90"></div>
      </div>
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 md:gap-16">
          {/* テキストコンテンツ */}
          <div className="flex flex-col justify-center">
            <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl">
              最高の商品を<br />お届けします
            </h1>
            <p className="mt-6 max-w-lg text-xl text-blue-50">
              高品質な商品を取り揃えたオンラインストアへようこそ。
              特別な割引や限定商品をお見逃しなく。
            </p>
            <div className="mt-10 flex flex-wrap gap-4">
              <Link
                href="/products"
                className="rounded-md bg-white px-6 py-3 text-base font-medium text-blue-600 shadow-sm hover:bg-blue-50"
              >
                商品を見る
              </Link>
              <Link
                href="/about"
                className="rounded-md border border-white bg-transparent px-6 py-3 text-base font-medium text-white hover:bg-white/10"
              >
                詳細を見る
              </Link>
            </div>
          </div>

          {/* 画像 */}
          <div className="hidden md:flex md:items-center">
            <div className="relative h-full w-full">
              <div className="absolute -right-20 top-1/2 h-64 w-64 -translate-y-1/2 rounded-full bg-purple-300 opacity-50 blur-3xl"></div>
              <div className="absolute -left-10 top-1/4 h-40 w-40 rounded-full bg-blue-300 opacity-50 blur-2xl"></div>
              <div className="relative mx-auto h-80 w-80 overflow-hidden rounded-xl bg-white/10 p-4 backdrop-blur-sm">
                <img
                  src="https://images.unsplash.com/photo-1523275335684-37898b6baf30?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1399&q=80"
                  alt="Featured Product"
                  className="h-full w-full rounded-lg object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
