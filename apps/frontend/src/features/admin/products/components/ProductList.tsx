'use client'

import {useQuery, useQueryClient} from "@tanstack/react-query";
import {useState} from "react";
import {productService} from "../services";
import {RiAddLine, RiArrowDownSLine, RiArrowRightSLine} from "react-icons/ri";
import Link from "next/link";

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

  if (isLoading) return <div className="p-4">読み込み中...</div>;
  if (error) return <div className="p-4 text-red-500">エラーが発生しました</div>;
  if (!products || products.length === 0) return <div className="p-4">商品がありません</div>;

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">商品一覧</h1>

      <div className="mb-4">
        <Link
          href="/admin/products/create"
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded inline-flex items-center"
        >
          <RiAddLine className="mr-1" /> 新規商品を追加
        </Link>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200">
          <thead>
            <tr className="bg-gray-100">
              <th className="py-2 px-4 border-b text-left">ID</th>
              <th className="py-2 px-4 border-b text-left">商品名</th>
              <th className="py-2 px-4 border-b text-left">価格</th>
              <th className="py-2 px-4 border-b text-left">在庫</th>
              <th className="py-2 px-4 border-b text-left">作成日</th>
              <th className="py-2 px-4 border-b text-left">アクション</th>
            </tr>
          </thead>
          <tbody>
            {products.map(product => (
              <>
                <tr key={product.id} className="hover:bg-gray-50">
                  <td className="py-2 px-4 border-b">{product.id}</td>
                  <td className="py-2 px-4 border-b">
                    <div className="flex items-center">
                      <button
                        onClick={() => toggleExpand(product.id)}
                        className="mr-2 focus:outline-none"
                      >
                        {expandedProductId === product.id ? (
                          <RiArrowDownSLine />
                        ) : (
                          <RiArrowRightSLine />
                        )}
                      </button>
                      {editingProductId === product.id ? (
                        <input
                          type="text"
                          name="name"
                          value={editFormData.name}
                          onChange={handleChange}
                          className="border p-1 w-full"
                        />
                      ) : (
                        <Link href={`/admin/products/${product.id}`} className="text-blue-500 hover:text-blue-700 hover:underline">
                          {product.name}
                        </Link>
                      )}
                    </div>
                  </td>
                  <td className="py-2 px-4 border-b">
                    {editingProductId === product.id ? (
                      <input
                        type="number"
                        name="price"
                        value={editFormData.price}
                        onChange={handleChange}
                        className="border p-1 w-full"
                      />
                    ) : (
                      `¥${product.price.toLocaleString()}`
                    )}
                  </td>
                  <td className="py-2 px-4 border-b">
                    {editingProductId === product.id ? (
                      <input
                        type="number"
                        name="stock"
                        value={editFormData.stock}
                        onChange={handleChange}
                        className="border p-1 w-full"
                      />
                    ) : (
                      product.stock
                    )}
                  </td>
                  <td className="py-2 px-4 border-b">
                    {new Date(product.created_at).toLocaleDateString()}
                  </td>
                  <td className="py-2 px-4 border-b">
                    {editingProductId === product.id ? (
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleUpdate(product.id)}
                          className="bg-green-500 hover:bg-green-700 text-white py-1 px-2 rounded text-sm"
                        >
                          保存
                        </button>
                        <button
                          onClick={handleCancelEdit}
                          className="bg-gray-500 hover:bg-gray-700 text-white py-1 px-2 rounded text-sm"
                        >
                          キャンセル
                        </button>
                      </div>
                    ) : (
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleEdit(product)}
                          className="bg-blue-500 hover:bg-blue-700 text-white py-1 px-2 rounded text-sm"
                        >
                          編集
                        </button>
                        <button
                          onClick={() => handleDelete(product.id)}
                          className="bg-red-500 hover:bg-red-700 text-white py-1 px-2 rounded text-sm"
                        >
                          削除
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
                {expandedProductId === product.id && (
                  <tr key={`expanded-${product.id}`}>
                    <td colSpan={6} className="py-2 px-4 border-b bg-gray-50">
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
              </>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ProductList;
