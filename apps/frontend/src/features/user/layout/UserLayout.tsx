'use client';

import type React from 'react';
import UserFooter from './UserFooter';
import UserHeader from './UserHeader';

interface UserLayoutProps {
  children: React.ReactNode;
}

const UserLayout: React.FC<UserLayoutProps> = ({ children }) => {
  return (
    <div className="flex min-h-screen flex-col bg-gray-50 dark:bg-gray-900">
      <UserHeader />
      <main className="flex-grow">{children}</main>
      <UserFooter />
    </div>
  );
};

export default UserLayout;
