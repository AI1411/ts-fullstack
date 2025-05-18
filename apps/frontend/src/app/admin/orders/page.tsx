'use client';

import OrderForm from '@/features/admin/orders/components/OrderForm';
import OrderList from '@/features/admin/orders/components/OrderList';

export default function OrdersPage() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-800">注文一覧</h2>
            </div>
            <OrderList />
          </div>
        </div>

        <div className="lg:col-span-1">
          <OrderForm />
        </div>
      </div>
    </div>
  );
}
