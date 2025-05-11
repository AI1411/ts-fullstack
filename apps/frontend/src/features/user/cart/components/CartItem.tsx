'use client'

import React from 'react';
import Image from 'next/image';
import { RiDeleteBinLine } from 'react-icons/ri';

interface CartItemProps {
  id: number;
  name: string;
  price: number;
  quantity: number;
  image: string;
  onRemove: (id: number) => void;
  onUpdateQuantity: (id: number, quantity: number) => void;
}

const CartItem: React.FC<CartItemProps> = ({
  id,
  name,
  price,
  quantity,
  image,
  onRemove,
  onUpdateQuantity,
}) => {
  return (
    <div className="flex items-center justify-between border-b border-gray-200 py-4 dark:border-gray-700">
      <div className="flex items-center space-x-4">
        <div className="relative h-20 w-20 overflow-hidden rounded-md">
          <Image
            src={image}
            alt={name}
            fill
            className="object-cover"
          />
        </div>
        <div>
          <h3 className="text-lg font-medium text-gray-800 dark:text-white">{name}</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">¥{price.toLocaleString()}</p>
        </div>
      </div>
      <div className="flex items-center space-x-4">
        <div className="flex items-center rounded-md border border-gray-300 dark:border-gray-600">
          <button
            onClick={() => onUpdateQuantity(id, Math.max(1, quantity - 1))}
            className="px-3 py-1 text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
          >
            -
          </button>
          <span className="px-3 py-1 text-gray-800 dark:text-white">{quantity}</span>
          <button
            onClick={() => onUpdateQuantity(id, quantity + 1)}
            className="px-3 py-1 text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
          >
            +
          </button>
        </div>
        <p className="w-24 text-right font-medium text-gray-800 dark:text-white">
          ¥{(price * quantity).toLocaleString()}
        </p>
        <button
          onClick={() => onRemove(id)}
          className="text-red-500 hover:text-red-600 dark:text-red-400 dark:hover:text-red-300"
        >
          <RiDeleteBinLine className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
};

export default CartItem;