'use client';

import Account from '@/features/user/account/components/Account';
import UserLayout from '@/features/user/layout/UserLayout';
import React from 'react';

export default function AccountPage() {
  return (
    <UserLayout>
      <Account />
    </UserLayout>
  );
}
