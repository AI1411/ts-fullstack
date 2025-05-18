'use client';

import type React from 'react';
import CartItem from './CartItem';

export interface CartItemType {
  id: number;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

interface CartListProps {
  items: CartItemType[];
  onRemoveItem: (id: number) => void;
  onUpdateQuantity: (id: number, quantity: number) => void;
}

const CartList: React.FC<CartListProps> = ({
  items,
  onRemoveItem,
  onUpdateQuantity,
}) => {
  if (items.length === 0) {
    return (
      <div className="rounded-lg bg-white p-6 text-center shadow-md dark:bg-gray-800">
        <p className="text-lg text-gray-600 dark:text-gray-400">
          カートに商品がありません
        </p>
        <p className="mt-2 text-sm text-gray-500 dark:text-gray-500">
          商品を追加してください
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-lg bg-white p-6 shadow-md dark:bg-gray-800">
      <h2 className="mb-6 text-xl font-semibold text-gray-800 dark:text-white">
        ショッピングカート
      </h2>
      <div className="space-y-2">
        {items.map((item) => (
          <CartItem
            key={item.id}
            id={item.id}
            name={item.name}
            price={item.price}
            quantity={item.quantity}
            image={item.image}
            onRemove={onRemoveItem}
            onUpdateQuantity={onUpdateQuantity}
          />
        ))}
      </div>
    </div>
  );
};

export default CartList;
