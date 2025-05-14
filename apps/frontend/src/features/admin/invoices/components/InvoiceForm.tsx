'use client'

import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { invoiceService } from "../services";

const InvoiceForm = () => {
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState({
    order_id: "",
    invoice_number: "",
    issue_date: new Date().toISOString().split('T')[0],
    due_date: "",
    total_amount: "",
    status: "PENDING",
    payment_method: "",
    notes: ""
  });
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // フォームの入力値を更新
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // 領収書を追加
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      // Convert string values to appropriate types
      const invoiceData = {
        ...formData,
        order_id: formData.order_id ? parseInt(formData.order_id) : null,
        total_amount: parseInt(formData.total_amount),
        due_date: formData.due_date || null,
        payment_method: formData.payment_method || null,
        notes: formData.notes || null
      };

      await invoiceService.createInvoice(invoiceData);
      
      // 成功したらフォームをリセットしてキャッシュを更新
      setFormData({
        order_id: "",
        invoice_number: "",
        issue_date: new Date().toISOString().split('T')[0],
        due_date: "",
        total_amount: "",
        status: "PENDING",
        payment_method: "",
        notes: ""
      });
      await queryClient.invalidateQueries({ queryKey: ['invoices'] });
    } catch (err) {
      setError(err instanceof Error ? err.message : '領収書の追加に失敗しました');
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white shadow-md rounded-lg p-6">
      <h2 className="text-lg font-semibold text-gray-800 mb-4">領収書を追加</h2>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}
      
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="invoice_number" className="block text-sm font-medium text-gray-700 mb-1">
            領収書番号
          </label>
          <input
            type="text"
            id="invoice_number"
            name="invoice_number"
            value={formData.invoice_number}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        
        <div className="mb-4">
          <label htmlFor="order_id" className="block text-sm font-medium text-gray-700 mb-1">
            注文ID
          </label>
          <input
            type="number"
            id="order_id"
            name="order_id"
            value={formData.order_id}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        
        <div className="mb-4">
          <label htmlFor="total_amount" className="block text-sm font-medium text-gray-700 mb-1">
            合計金額
          </label>
          <input
            type="number"
            id="total_amount"
            name="total_amount"
            value={formData.total_amount}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        
        <div className="mb-4">
          <label htmlFor="issue_date" className="block text-sm font-medium text-gray-700 mb-1">
            発行日
          </label>
          <input
            type="date"
            id="issue_date"
            name="issue_date"
            value={formData.issue_date}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        
        <div className="mb-4">
          <label htmlFor="due_date" className="block text-sm font-medium text-gray-700 mb-1">
            支払期限
          </label>
          <input
            type="date"
            id="due_date"
            name="due_date"
            value={formData.due_date}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        
        <div className="mb-4">
          <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
            ステータス
          </label>
          <select
            id="status"
            name="status"
            value={formData.status}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="PENDING">未払い</option>
            <option value="PAID">支払済み</option>
            <option value="CANCELLED">キャンセル</option>
          </select>
        </div>
        
        <div className="mb-4">
          <label htmlFor="payment_method" className="block text-sm font-medium text-gray-700 mb-1">
            支払方法
          </label>
          <input
            type="text"
            id="payment_method"
            name="payment_method"
            value={formData.payment_method}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        
        <div className="mb-4">
          <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-1">
            備考
          </label>
          <textarea
            id="notes"
            name="notes"
            value={formData.notes}
            onChange={handleChange}
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded transition-colors disabled:bg-blue-300"
        >
          {isSubmitting ? '送信中...' : '領収書を追加'}
        </button>
      </form>
    </div>
  );
};

export default InvoiceForm;