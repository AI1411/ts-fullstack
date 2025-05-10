'use client'

import { useQueryClient } from "@tanstack/react-query";
import { useState, useEffect } from "react";
import { productService } from "../services";
import { useRouter } from "next/navigation";
import { Product } from "../controllers";

interface ProductFormProps {
  initialData?: Product;
  isEditing?: boolean;
}

const ProductForm = ({ initialData, isEditing = false }: ProductFormProps) => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    stock: "",
    image_url: ""
  });
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 編集モードの場合、初期データをセット
  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name,
        description: initialData.description || "",
        price: initialData.price.toString(),
        stock: initialData.stock.toString(),
        image_url: initialData.image_url || ""
      });
    }
  }, [initialData]);

  // フォームの入力値を更新
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // 商品を追加または更新
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      // 数値フィールドを変換
      const productData = {
        ...formData,
        price: parseFloat(formData.price),
        stock: parseInt(formData.stock)
      };

      if (isEditing && initialData) {
        // 商品を更新
        await productService.updateProduct(initialData.id, productData);
        await queryClient.invalidateQueries({ queryKey: ['products'] });
        router.push('/admin/products');
      } else {
        // 新規商品を作成
        await productService.createProduct(productData);
        // 成功したらフォームをリセットしてキャッシュを更新
        setFormData({
          name: "",
          description: "",
          price: "",
          stock: "",
          image_url: ""
        });
        await queryClient.invalidateQueries({ queryKey: ['products'] });
        router.push('/admin/products');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : '商品の保存に失敗しました');
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white shadow-md rounded-lg p-6">
      <h2 className="text-lg font-semibold text-gray-800 mb-4">
        {isEditing ? '商品を編集' : '新規商品を追加'}
      </h2>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
            商品名
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div className="mb-4">
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
            説明
          </label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div className="mb-4">
          <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-1">
            価格
          </label>
          <input
            type="number"
            id="price"
            name="price"
            value={formData.price}
            onChange={handleChange}
            required
            min="0"
            step="0.01"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div className="mb-4">
          <label htmlFor="stock" className="block text-sm font-medium text-gray-700 mb-1">
            在庫数
          </label>
          <input
            type="number"
            id="stock"
            name="stock"
            value={formData.stock}
            onChange={handleChange}
            required
            min="0"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div className="mb-4">
          <label htmlFor="image_url" className="block text-sm font-medium text-gray-700 mb-1">
            画像URL
          </label>
          <input
            type="text"
            id="image_url"
            name="image_url"
            value={formData.image_url}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          />
          {formData.image_url && (
            <div className="mt-2">
              <img
                src={formData.image_url}
                alt="商品画像プレビュー"
                className="max-w-xs max-h-32 object-contain"
                onError={(e) => {
                  e.currentTarget.src = "https://via.placeholder.com/150?text=No+Image";
                }}
              />
            </div>
          )}
        </div>

        <div className="flex space-x-4">
          <button
            type="submit"
            disabled={isSubmitting}
            className="flex-1 bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded transition-colors disabled:bg-blue-300"
          >
            {isSubmitting ? '送信中...' : isEditing ? '更新する' : '追加する'}
          </button>
          <button
            type="button"
            onClick={() => router.push('/admin/products')}
            className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-800 font-medium py-2 px-4 rounded transition-colors"
          >
            キャンセル
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProductForm;
