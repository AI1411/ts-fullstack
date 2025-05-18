'use client';

import ProductForm from '@/features/admin/products/components/ProductForm';

export default function CreateProductPage() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-6">
        <div>
          <div className="bg-white rounded-lg shadow">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-800">
                新規商品を追加
              </h2>
            </div>
            <div className="p-6">
              <ProductForm />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
