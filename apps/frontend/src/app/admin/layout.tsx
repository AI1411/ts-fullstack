'use client'

import Sidebar from "@/common/components/layout/Sidebar";
import Header from "@/common/components/layout/Header";
import React, {useState} from "react";

export default function AdminLayout({
                                      children,
                                    }: Readonly<{
  children: React.ReactNode;
}>) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
      {/* サイドバー */}
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen}/>

      {/* メインコンテンツ */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen}/>
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50 dark:bg-gray-900 p-4 md:p-6">
          <div className="mx-auto max-w-screen-2xl">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
