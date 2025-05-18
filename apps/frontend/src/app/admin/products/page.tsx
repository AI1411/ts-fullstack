'use client';

import ProductForm from '@/features/admin/products/components/ProductForm';
import ProductList from '@/features/admin/products/components/ProductList';

export default function ProductsPage() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-800">商品一覧</h2>
            </div>
            <ProductList />
          </div>
        </div>

        <div className="lg:col-span-1">
          <ProductForm />
        </div>
      </div>
    </div>
  );
}
