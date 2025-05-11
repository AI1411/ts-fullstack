'use client'

import React from 'react';
import UserLayout from '@/features/user/layout/UserLayout';
import Account from '@/features/user/account/components/Account';

export default function AccountPage() {
  return (
    <UserLayout>
      <Account />
    </UserLayout>
  );
}