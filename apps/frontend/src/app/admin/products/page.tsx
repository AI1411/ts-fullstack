'use client'

import ProductList from "@/features/admin/products/components/ProductList";

export default function ProductsPage() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-6">
        <div>
          <div className="bg-white rounded-lg shadow">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-800">商品一覧</h2>
            </div>
            <ProductList />
          </div>
        </div>
      </div>
    </div>
  );
}