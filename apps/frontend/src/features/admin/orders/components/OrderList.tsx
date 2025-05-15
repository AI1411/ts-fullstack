'use client'

import React from "react";
import {useQuery, useQueryClient} from "@tanstack/react-query";
import {useState} from "react";
import {orderService} from "../services";
import {Order} from "../controllers";
import {RiArrowDownSLine, RiArrowRightSLine} from "react-icons/ri";
import Link from "next/link";

const OrderList = () => {
  const queryClient = useQueryClient();
  const [expandedOrderId, setExpandedOrderId] = useState<number | null>(null);

  // Order一覧を取得
  const {data: orders, isLoading, error} = useQuery({
    queryKey: ['orders'],
    queryFn: orderService.getOrders
  });

  // 詳細表示の切り替え
  const toggleExpand = (orderId: number) => {
    setExpandedOrderId(expandedOrderId === orderId ? null : orderId);
  };

  // 注文ステータスの更新
  const handleUpdateStatus = async (orderId: number, status: Order['status']) => {
    try {
      await orderService.updateOrderStatus(orderId, status);
      // 成功したらキャッシュを更新
      await queryClient.invalidateQueries({queryKey: ['orders']});
    } catch (error) {
      console.error("Failed to update order status:", error);
      alert("注文ステータスの更新に失敗しました");
    }
  };

  // 注文の削除
  const handleDelete = async (orderId: number) => {
    if (!confirm("本当にこの注文を削除しますか？")) return;

    try {
      await orderService.deleteOrder(orderId);
      // 成功したらキャッシュを更新
      await queryClient.invalidateQueries({queryKey: ['orders']});
    } catch (error) {
      console.error("Failed to delete order:", error);
      alert("注文の削除に失敗しました");
    }
  };

  // ステータスに応じたバッジの色を返す
  const getStatusBadgeClass = (status: Order['status']) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'processing':
        return 'bg-blue-100 text-blue-800';
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // ステータスの日本語表示
  const getStatusText = (status: Order['status']) => {
    switch (status) {
      case 'pending':
        return '保留中';
      case 'processing':
        return '処理中';
      case 'completed':
        return '完了';
      case 'cancelled':
        return 'キャンセル';
      default:
        return status;
    }
  };

  if (isLoading) return <div className="text-center py-4">読み込み中...</div>;
  if (error) return <div className="text-center py-4 text-red-500">エラーが発生しました</div>;
  if (!orders || orders.length === 0) return <div className="text-center py-4">注文がありません</div>;

  return (
    <div className="bg-white shadow-md rounded-lg overflow-hidden">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">顧客名</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">金額</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ステータス</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">注文日</th>
            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">アクション</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {orders.map(order => (
            <React.Fragment key={order.id}>
              <tr className={expandedOrderId === order.id ? 'bg-gray-50' : ''}>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{order.id}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="text-sm font-medium text-gray-900">
                      <Link href={`/admin/orders/${order.id}`} className="hover:text-blue-500">
                        {order.customer_name}
                      </Link>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{`¥${order.total_amount.toLocaleString()}`}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadgeClass(order.status)}`}>
                    {getStatusText(order.status)}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">
                    {new Date(order.created_at).toLocaleDateString()}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div className="flex items-center justify-end space-x-2">
                    <button
                      onClick={() => toggleExpand(order.id)}
                      className="text-gray-600 hover:text-gray-900 flex items-center"
                    >
                      {expandedOrderId === order.id ? <RiArrowDownSLine /> : <RiArrowRightSLine />}
                    </button>
                    <select
                      value={order.status}
                      onChange={(e) => handleUpdateStatus(order.id, e.target.value as Order['status'])}
                      className="text-sm border-gray-300 rounded-md"
                    >
                      <option value="pending">保留中</option>
                      <option value="processing">処理中</option>
                      <option value="completed">完了</option>
                      <option value="cancelled">キャンセル</option>
                    </select>
                    <button
                      onClick={() => handleDelete(order.id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      削除
                    </button>
                  </div>
                </td>
              </tr>
              {expandedOrderId === order.id && (
                <tr>
                  <td colSpan={6} className="px-6 py-4">
                    <div className="p-2">
                      <h3 className="font-bold mb-2">注文詳細</h3>
                      <div className="mb-4">
                        <p className="text-sm text-gray-600 mb-1">顧客メール:</p>
                        <p>{order.customer_email}</p>
                      </div>
                      <div className="mb-4">
                        <p className="text-sm text-gray-600 mb-1">注文商品:</p>
                        <table className="min-w-full divide-y divide-gray-200">
                          <thead className="bg-gray-50">
                            <tr>
                              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">商品名</th>
                              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">数量</th>
                              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">単価</th>
                              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">小計</th>
                            </tr>
                          </thead>
                          <tbody className="bg-white divide-y divide-gray-200">
                            {order.items.map(item => (
                              <tr key={item.id}>
                                <td className="px-4 py-2 whitespace-nowrap text-sm">{item.product_name}</td>
                                <td className="px-4 py-2 whitespace-nowrap text-sm">{item.quantity}</td>
                                <td className="px-4 py-2 whitespace-nowrap text-sm">{`¥${item.price.toLocaleString()}`}</td>
                                <td className="px-4 py-2 whitespace-nowrap text-sm">{`¥${(item.price * item.quantity).toLocaleString()}`}</td>
                              </tr>
                            ))}
                          </tbody>
                          <tfoot>
                            <tr>
                              <td colSpan={3} className="px-4 py-2 text-right font-medium">合計:</td>
                              <td className="px-4 py-2 font-bold">{`¥${order.total_amount.toLocaleString()}`}</td>
                            </tr>
                          </tfoot>
                        </table>
                      </div>
                      <div className="mt-2">
                        <p className="text-sm text-gray-600 mb-1">最終更新日:</p>
                        <p>{new Date(order.updated_at).toLocaleString()}</p>
                      </div>
                    </div>
                  </td>
                </tr>
              )}
            </React.Fragment>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default OrderList;
