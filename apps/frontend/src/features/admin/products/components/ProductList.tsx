'use client'

import {useQuery, useQueryClient} from "@tanstack/react-query";
import {useState} from "react";
import {productService} from "../services";
import {RiArrowDownSLine, RiArrowRightSLine} from "react-icons/ri";
import Link from "next/link";
import React from "react";

// Product型定義
type Product = {
  id: number;
  name: string;
  description: string | null;
  price: number;
  stock: number;
  image_url: string | null;
  created_at: string;
  updated_at: string;
};

const ProductList = () => {
  const queryClient = useQueryClient();
  const [editingProductId, setEditingProductId] = useState<number | null>(null);
  const [expandedProductId, setExpandedProductId] = useState<number | null>(null);
  const [editFormData, setEditFormData] = useState({
    name: "",
    description: "",
    price: "",
    stock: "",
    image_url: ""
  });

  // Product一覧を取得
  const {data: products, isLoading, error} = useQuery({
    queryKey: ['products'],
    queryFn: productService.getProducts
  });

  // 編集モードを開始
  const handleEdit = (product: Product) => {
    setEditingProductId(product.id);
    setEditFormData({
      name: product.name,
      description: product.description || "",
      price: product.price.toString(),
      stock: product.stock.toString(),
      image_url: product.image_url || ""
    });
  };

  // 編集をキャンセル
  const handleCancelEdit = () => {
    setEditingProductId(null);
  };

  // 編集フォームの入力値を更新
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const {name, value} = e.target;
    setEditFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Productを更新
  const handleUpdate = async (productId: number) => {
    try {
      const updateData = {
        ...editFormData,
        price: parseFloat(editFormData.price),
        stock: parseInt(editFormData.stock)
      };

      await productService.updateProduct(productId, updateData);

      // 成功したらキャッシュを更新
      await queryClient.invalidateQueries({queryKey: ['products']});
      setEditingProductId(null);
    } catch (error) {
      console.error("Failed to update product:", error);
      alert("商品の更新に失敗しました");
    }
  };

  // Productを削除
  const handleDelete = async (productId: number) => {
    if (!confirm("本当にこの商品を削除しますか？")) return;

    try {
      await productService.deleteProduct(productId);
      // 成功したらキャッシュを更新
      await queryClient.invalidateQueries({queryKey: ['products']});
    } catch (error) {
      console.error("Failed to delete product:", error);
      alert("商品の削除に失敗しました");
    }
  };

  // 詳細表示の切り替え
  const toggleExpand = (productId: number) => {
    setExpandedProductId(expandedProductId === productId ? null : productId);
  };

  if (isLoading) return <div className="text-center py-4">読み込み中...</div>;
  if (error) return <div className="text-center py-4 text-red-500">エラーが発生しました</div>;
  if (!products || products.length === 0) return <div className="text-center py-4">商品がありません</div>;

  return (
    <div className="bg-white shadow-md rounded-lg overflow-hidden">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">商品名</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">価格</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">在庫</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">作成日</th>
            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">アクション</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {products.map(product => (
            <React.Fragment key={product.id}>
              <tr className={expandedProductId === product.id ? 'bg-gray-50' : ''}>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{product.id}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    {editingProductId === product.id ? (
                      <input
                        type="text"
                        name="name"
                        value={editFormData.name}
                        onChange={handleChange}
                        className="border rounded px-2 py-1 w-full"
                      />
                    ) : (
                      <div className="text-sm font-medium text-gray-900">
                        <Link href={`/admin/products/${product.id}`} className="hover:text-blue-500">
                          {product.name}
                        </Link>
                      </div>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {editingProductId === product.id ? (
                    <input
                      type="number"
                      name="price"
                      value={editFormData.price}
                      onChange={handleChange}
                      className="border rounded px-2 py-1 w-full"
                    />
                  ) : (
                    <div className="text-sm text-gray-900">{`¥${product.price.toLocaleString()}`}</div>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {editingProductId === product.id ? (
                    <input
                      type="number"
                      name="stock"
                      value={editFormData.stock}
                      onChange={handleChange}
                      className="border rounded px-2 py-1 w-full"
                    />
                  ) : (
                    <div className="text-sm text-gray-900">{product.stock}</div>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">
                    {new Date(product.created_at).toLocaleDateString()}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div className="flex items-center justify-end space-x-2">
                    {editingProductId === product.id ? (
                      <>
                        <button
                          onClick={() => handleUpdate(product.id)}
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
                          onClick={() => toggleExpand(product.id)}
                          className="text-gray-600 hover:text-gray-900 flex items-center"
                        >
                          {expandedProductId === product.id ? <RiArrowDownSLine /> : <RiArrowRightSLine />}
                        </button>
                        <button
                          onClick={() => handleEdit(product)}
                          className="text-indigo-600 hover:text-indigo-900"
                        >
                          編集
                        </button>
                        <button
                          onClick={() => handleDelete(product.id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          削除
                        </button>
                      </>
                    )}
                  </div>
                </td>
              </tr>
              {expandedProductId === product.id && (
                <tr>
                  <td colSpan={6} className="px-6 py-4">
                    <div className="p-2">
                      <h3 className="font-bold mb-2">商品詳細</h3>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm text-gray-600 mb-1">説明:</p>
                          <p>{product.description || "説明なし"}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600 mb-1">画像URL:</p>
                          <p className="break-all">{product.image_url || "画像なし"}</p>
                          {product.image_url && (
                            <div className="mt-2">
                              <img 
                                src={product.image_url} 
                                alt={product.name} 
                                className="max-w-xs max-h-32 object-contain"
                                onError={(e) => {
                                  e.currentTarget.src = "https://via.placeholder.com/150?text=No+Image";
                                }}
                              />
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="mt-2">
                        <p className="text-sm text-gray-600 mb-1">最終更新日:</p>
                        <p>{new Date(product.updated_at).toLocaleString()}</p>
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

export default ProductList;
