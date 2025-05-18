'use client';

import { useCart } from '@/contexts/CartContext';
import Link from 'next/link';
import type React from 'react';

interface ProductCardProps {
  id: number;
  name: string;
  price: number;
  description: string;
  imageUrl: string;
}

const ProductCard: React.FC<ProductCardProps> = ({
  id,
  name,
  price,
  description,
  imageUrl,
}) => {
  const { addItem } = useCart();
  return (
    <div className="group relative overflow-hidden rounded-lg border border-gray-200 bg-white shadow-md transition-all hover:shadow-lg dark:border-gray-700 dark:bg-gray-800">
      {/* 商品画像 */}
      <div className="aspect-h-1 aspect-w-1 w-full overflow-hidden bg-gray-200">
        <img
          src={imageUrl}
          alt={name}
          className="h-full w-full object-cover object-center transition-transform duration-300 group-hover:scale-105"
        />
      </div>

      {/* 商品情報 */}
      <div className="p-4">
        <h3 className="mb-1 text-lg font-medium text-gray-900 dark:text-white">
          <Link href={`/products/${id}`} className="hover:text-blue-500">
            {name}
          </Link>
        </h3>
        <p className="mb-2 text-sm text-gray-500 line-clamp-2 dark:text-gray-400">
          {description}
        </p>
        <div className="flex items-center justify-between">
          <span className="text-lg font-bold text-gray-900 dark:text-white">
            ¥{price.toLocaleString()}
          </span>
          <button
            onClick={() => addItem({ id, name, price, image: imageUrl })}
            className="rounded-md bg-blue-500 px-3 py-1.5 text-sm font-medium text-white transition-colors hover:bg-blue-600"
          >
            カートに追加
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
