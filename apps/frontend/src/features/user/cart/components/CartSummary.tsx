'use client'

import React from 'react';
import Link from 'next/link';

interface CartSummaryProps {
  subtotal: number;
  tax: number;
  shipping: number;
  total: number;
}

const CartSummary: React.FC<CartSummaryProps> = ({
  subtotal,
  tax,
  shipping,
  total,
}) => {
  return (
    <div className="rounded-lg bg-white p-6 shadow-md dark:bg-gray-800">
      <h2 className="mb-4 text-lg font-semibold text-gray-800 dark:text-white">注文サマリー</h2>
      <div className="space-y-3">
        <div className="flex justify-between">
          <p className="text-gray-600 dark:text-gray-400">小計</p>
          <p data-testid="subtotal" className="font-medium text-gray-800 dark:text-white">¥{subtotal.toLocaleString()}</p>
        </div>
        <div className="flex justify-between">
          <p className="text-gray-600 dark:text-gray-400">消費税</p>
          <p data-testid="tax" className="font-medium text-gray-800 dark:text-white">¥{tax.toLocaleString()}</p>
        </div>
        <div className="flex justify-between">
          <p className="text-gray-600 dark:text-gray-400">配送料</p>
          <p data-testid="shipping" className="font-medium text-gray-800 dark:text-white">¥{shipping.toLocaleString()}</p>
        </div>
        <div className="border-t border-gray-200 pt-3 dark:border-gray-700">
          <div className="flex justify-between">
            <p className="text-lg font-semibold text-gray-800 dark:text-white">合計</p>
            <p data-testid="total" className="text-lg font-semibold text-gray-800 dark:text-white">¥{total.toLocaleString()}</p>
          </div>
        </div>
      </div>
      <button className="mt-6 w-full rounded-md bg-blue-600 py-3 text-center font-medium text-white transition-colors hover:bg-blue-700">
        レジに進む
      </button>
      <Link
        href="/"
        className="mt-4 block text-center text-sm text-blue-600 hover:underline dark:text-blue-400"
      >
        買い物を続ける
      </Link>
    </div>
  );
};

export default CartSummary;
