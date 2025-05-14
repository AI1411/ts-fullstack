'use client'

import CountryList from '@/features/admin/countries/components/CountryList';
import { Suspense } from 'react';

export default function CountriesPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">国管理</h1>
        <p className="text-gray-600">国の一覧を表示、編集、削除できます。</p>
      </div>
      
      <div className="bg-white rounded-lg shadow p-6">
        <Suspense fallback={<div className="text-center py-4">読み込み中...</div>}>
          <CountryList />
        </Suspense>
      </div>
    </div>
  );
}