'use client';

import Cart from '@/features/user/cart/components/Cart';
import UserLayout from '@/features/user/layout/UserLayout';
import React from 'react';

export default function CartPage() {
  return (
    <UserLayout>
      <Cart />
    </UserLayout>
  );
}
