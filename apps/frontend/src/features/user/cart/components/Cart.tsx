'use client'

import React, { useState, useEffect } from 'react';
import CartList, { CartItemType } from './CartList';
import CartSummary from './CartSummary';

// Mock data for demonstration
const initialCartItems: CartItemType[] = [
  {
    id: 1,
    name: 'プレミアムレザーウォレット',
    price: 12800,
    quantity: 1,
    image: 'https://images.unsplash.com/photo-1627123424574-724758594e93?q=80&w=2787&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  },
  {
    id: 2,
    name: 'クラシックデニムジャケット',
    price: 18500,
    quantity: 2,
    image: 'https://images.unsplash.com/photo-1576995853123-5a10305d93c0?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  },
  {
    id: 3,
    name: 'ミニマリストバックパック',
    price: 9800,
    quantity: 1,
    image: 'https://images.unsplash.com/photo-1622560480605-d83c853bc5c3?q=80&w=2960&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  },
];

const TAX_RATE = 0.1; // 10% tax
const SHIPPING_FEE = 800; // 800 yen shipping fee

const Cart: React.FC = () => {
  const [cartItems, setCartItems] = useState<CartItemType[]>(initialCartItems);
  const [subtotal, setSubtotal] = useState(0);
  const [tax, setTax] = useState(0);
  const [total, setTotal] = useState(0);

  // Calculate totals whenever cart items change
  useEffect(() => {
    const newSubtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const newTax = Math.round(newSubtotal * TAX_RATE);
    const newTotal = newSubtotal + newTax + (cartItems.length > 0 ? SHIPPING_FEE : 0);

    setSubtotal(newSubtotal);
    setTax(newTax);
    setTotal(newTotal);
  }, [cartItems]);

  // Handle removing an item from the cart
  const handleRemoveItem = (id: number) => {
    setCartItems(cartItems.filter(item => item.id !== id));
  };

  // Handle updating the quantity of an item
  const handleUpdateQuantity = (id: number, quantity: number) => {
    setCartItems(
      cartItems.map(item => 
        item.id === id ? { ...item, quantity } : item
      )
    );
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <h1 className="mb-8 text-2xl font-bold text-gray-900 dark:text-white">ショッピングカート</h1>
      
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <CartList 
            items={cartItems} 
            onRemoveItem={handleRemoveItem} 
            onUpdateQuantity={handleUpdateQuantity} 
          />
        </div>
        <div>
          <CartSummary 
            subtotal={subtotal} 
            tax={tax} 
            shipping={cartItems.length > 0 ? SHIPPING_FEE : 0} 
            total={total} 
          />
        </div>
      </div>
    </div>
  );
};

export default Cart;