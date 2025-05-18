'use client';

import { useQuery, useQueryClient } from '@tanstack/react-query';
import Link from 'next/link';
import React, { useState } from 'react';
import { RiArrowDownSLine, RiArrowRightSLine } from 'react-icons/ri';
import { invoiceService } from '../services';

// Invoice型定義
type Invoice = {
  id: number;
  order_id: number | null;
  invoice_number: string;
  issue_date: string;
  due_date: string | null;
  total_amount: number;
  status: string;
  payment_method: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
};

const InvoiceList = () => {
  const queryClient = useQueryClient();
  const [editingInvoiceId, setEditingInvoiceId] = useState<number | null>(null);
  const [expandedInvoiceId, setExpandedInvoiceId] = useState<number | null>(
    null
  );
  const [editFormData, setEditFormData] = useState({
    invoice_number: '',
    total_amount: '',
    status: '',
    payment_method: '',
    notes: '',
  });

  // Invoice一覧を取得
  const {
    data: invoices,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['invoices'],
    queryFn: invoiceService.getInvoices,
  });

  // 編集モードを開始
  const handleEdit = (invoice: Invoice) => {
    setEditingInvoiceId(invoice.id);
    setEditFormData({
      invoice_number: invoice.invoice_number,
      total_amount: invoice.total_amount.toString(),
      status: invoice.status,
      payment_method: invoice.payment_method || '',
      notes: invoice.notes || '',
    });
  };

  // 編集をキャンセル
  const handleCancelEdit = () => {
    setEditingInvoiceId(null);
  };

  // 編集フォームの入力値を更新
  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setEditFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Invoiceを更新
  const handleUpdate = async (invoiceId: number) => {
    try {
      const updateData = {
        ...editFormData,
        total_amount: Number.parseInt(editFormData.total_amount),
      };

      await invoiceService.updateInvoice(invoiceId, updateData);

      // 成功したらキャッシュを更新
      await queryClient.invalidateQueries({ queryKey: ['invoices'] });
      setEditingInvoiceId(null);
    } catch (error) {
      console.error('Failed to update invoice:', error);
      alert('領収書の更新に失敗しました');
    }
  };

  // Invoiceを削除
  const handleDelete = async (invoiceId: number) => {
    if (!confirm('本当にこの領収書を削除しますか？')) return;

    try {
      await invoiceService.deleteInvoice(invoiceId);
      // 成功したらキャッシュを更新
      await queryClient.invalidateQueries({ queryKey: ['invoices'] });
    } catch (error) {
      console.error('Failed to delete invoice:', error);
      alert('領収書の削除に失敗しました');
    }
  };

  // 詳細表示の切り替え
  const toggleExpand = (invoiceId: number) => {
    setExpandedInvoiceId(expandedInvoiceId === invoiceId ? null : invoiceId);
  };

  if (isLoading) return <div className="text-center py-4">読み込み中...</div>;
  if (error)
    return (
      <div className="text-center py-4 text-red-500">エラーが発生しました</div>
    );
  if (!invoices || invoices.length === 0)
    return <div className="text-center py-4">領収書がありません</div>;

  return (
    <div className="bg-white shadow-md rounded-lg overflow-hidden">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              ID
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              領収書番号
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              金額
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              ステータス
            </th>
            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
              アクション
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {invoices.map((invoice) => (
            <React.Fragment key={invoice.id}>
              <tr
                className={expandedInvoiceId === invoice.id ? 'bg-gray-50' : ''}
              >
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {invoice.id}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    {editingInvoiceId === invoice.id ? (
                      <input
                        type="text"
                        name="invoice_number"
                        value={editFormData.invoice_number}
                        onChange={handleChange}
                        className="border rounded px-2 py-1 w-full"
                      />
                    ) : (
                      <div className="text-sm font-medium text-gray-900">
                        <Link
                          href={`/admin/invoices/${invoice.id}`}
                          className="hover:text-blue-500"
                        >
                          {invoice.invoice_number}
                        </Link>
                      </div>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {editingInvoiceId === invoice.id ? (
                    <input
                      type="number"
                      name="total_amount"
                      value={editFormData.total_amount}
                      onChange={handleChange}
                      className="border rounded px-2 py-1 w-full"
                    />
                  ) : (
                    <div className="text-sm text-gray-900">{`¥${invoice.total_amount.toLocaleString()}`}</div>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {editingInvoiceId === invoice.id ? (
                    <select
                      name="status"
                      value={editFormData.status}
                      onChange={handleChange}
                      className="border rounded px-2 py-1 w-full"
                      aria-label="ステータス"
                    >
                      <option value="PENDING">未払い</option>
                      <option value="PAID">支払済み</option>
                      <option value="CANCELLED">キャンセル</option>
                    </select>
                  ) : (
                    <div className="text-sm text-gray-900">
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                        ${
                          invoice.status === 'PAID'
                            ? 'bg-green-100 text-green-800'
                            : invoice.status === 'CANCELLED'
                              ? 'bg-red-100 text-red-800'
                              : 'bg-yellow-100 text-yellow-800'
                        }`}
                      >
                        {invoice.status === 'PAID'
                          ? '支払済み'
                          : invoice.status === 'CANCELLED'
                            ? 'キャンセル'
                            : '未払い'}
                      </span>
                    </div>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div className="flex items-center justify-end space-x-2">
                    {editingInvoiceId === invoice.id ? (
                      <>
                        <button
                          onClick={() => handleUpdate(invoice.id)}
                          className="text-indigo-600 hover:text-indigo-900"
                        >
                          保存
                        </button>
                        <button
                          onClick={handleCancelEdit}
                          className="text-gray-600 hover:text-gray-900"
                        >
                          キャンセル
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          onClick={() => toggleExpand(invoice.id)}
                          className="text-gray-600 hover:text-gray-900 flex items-center"
                        >
                          {expandedInvoiceId === invoice.id ? (
                            <RiArrowDownSLine />
                          ) : (
                            <RiArrowRightSLine />
                          )}
                        </button>
                        <button
                          onClick={() => handleEdit(invoice)}
                          className="text-indigo-600 hover:text-indigo-900"
                        >
                          編集
                        </button>
                        <button
                          onClick={() => handleDelete(invoice.id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          削除
                        </button>
                      </>
                    )}
                  </div>
                </td>
              </tr>
              {expandedInvoiceId === invoice.id && (
                <tr key={`${invoice.id}-details`}>
                  <td colSpan={5} className="px-6 py-4">
                    <div className="p-2">
                      <h3 className="font-bold mb-2">領収書詳細</h3>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm text-gray-600 mb-1">注文ID:</p>
                          <p>{invoice.order_id || '関連注文なし'}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600 mb-1">発行日:</p>
                          <p>
                            {new Date(invoice.issue_date).toLocaleDateString()}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600 mb-1">
                            支払期限:
                          </p>
                          <p>
                            {invoice.due_date
                              ? new Date(invoice.due_date).toLocaleDateString()
                              : '期限なし'}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600 mb-1">
                            支払方法:
                          </p>
                          <p>{invoice.payment_method || '未指定'}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600 mb-1">備考:</p>
                          <p>{invoice.notes || '備考なし'}</p>
                        </div>
                      </div>
                      <div className="mt-2">
                        <p className="text-sm text-gray-600 mb-1">
                          最終更新日:
                        </p>
                        <p>{new Date(invoice.updated_at).toLocaleString()}</p>
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

export default InvoiceList;
