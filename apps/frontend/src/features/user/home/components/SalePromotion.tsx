'use client';

import Link from 'next/link';
import type React from 'react';

const SalePromotion: React.FC = () => {
  return (
    <section
      data-testid="sale-promotion-section"
      className="bg-gradient-to-r from-blue-500 to-indigo-600 py-12 sm:py-16"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
            期間限定セール開催中！
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-xl text-blue-100">
            最大50%オフの特別価格でお買い得。お見逃しなく！
          </p>
          <div className="mt-8">
            <Link
              href="/sales"
              className="inline-flex items-center justify-center rounded-md border border-transparent bg-white px-5 py-3 text-base font-medium text-blue-600 hover:bg-blue-50 sm:w-auto"
            >
              セールページへ
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SalePromotion;
