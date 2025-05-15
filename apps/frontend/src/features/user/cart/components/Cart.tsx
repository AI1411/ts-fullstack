'use client'

import React from 'react';
import CartList from './CartList';
import CartSummary from './CartSummary';
import { useCart } from '@/contexts/CartContext';

// Define shipping fee constant
const SHIPPING_FEE = 800;

const Cart: React.FC = () => {
  const { items, removeItem, updateQuantity, subtotal, tax, total } = useCart();

  // Handle removing an item from the cart
  const handleRemoveItem = (id: number) => {
    removeItem(id);
  };

  // Handle updating the quantity of an item
  const handleUpdateQuantity = (id: number, quantity: number) => {
    updateQuantity(id, quantity);
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <h1 className="mb-8 text-2xl font-bold text-gray-900 dark:text-white">ショッピングカート</h1>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <CartList 
            items={items} 
            onRemoveItem={handleRemoveItem} 
            onUpdateQuantity={handleUpdateQuantity} 
          />
        </div>
        <div>
          <CartSummary 
            subtotal={subtotal} 
            tax={tax} 
            shipping={items.length > 0 ? SHIPPING_FEE : 0} 
            total={total} 
          />
        </div>
      </div>
    </div>
  );
};

export default Cart;
