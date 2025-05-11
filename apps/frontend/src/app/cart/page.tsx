'use client'

import React from 'react';
import UserLayout from '@/features/user/layout/UserLayout';
import Cart from '@/features/user/cart/components/Cart';

export default function CartPage() {
  return (
    <UserLayout>
      <Cart />
    </UserLayout>
  );
}