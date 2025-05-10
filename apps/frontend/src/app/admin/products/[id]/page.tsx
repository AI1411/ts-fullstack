'use client'

import { useQuery } from "@tanstack/react-query";
import { productService } from "@/features/admin/products/services";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { RiArrowLeftLine, RiEditLine, RiDeleteBin6Line } from "react-icons/ri";

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const productId = parseInt(params.id as string);

  // 商品詳細を取得
  const { data: product, isLoading, error } = useQuery({
    queryKey: ['product', productId],
    queryFn: () => productService.getProductById(productId),
    enabled: !isNaN(productId)
  });

  // 商品を削除
  const handleDelete = async () => {
    if (!confirm("本当にこの商品を削除しますか？")) return;

    try {
      await productService.deleteProduct(productId);
      router.push('/admin/products');
    } catch (error) {
      console.error("Failed to delete product:", error);
      alert("商品の削除に失敗しました");
    }
  };

  if (isLoading) return <div className="p-6">読み込み中...</div>;
  if (error) return <div className="p-6 text-red-500">エラーが発生しました</div>;
  if (!product) return <div className="p-6">商品が見つかりません</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-6">
        <Link 
          href="/admin/products" 
          className="flex items-center text-blue-500 hover:text-blue-700"
        >
          <RiArrowLeftLine className="mr-1" />
          商品一覧に戻る
        </Link>
        <div className="flex space-x-2">
          <Link
            href={`/admin/products/${productId}/edit`}
            className="bg-blue-500 hover:bg-blue-700 text-white py-2 px-4 rounded flex items-center"
          >
            <RiEditLine className="mr-1" />
            編集
          </Link>
          <button
            onClick={handleDelete}
            className="bg-red-500 hover:bg-red-700 text-white py-2 px-4 rounded flex items-center"
          >
            <RiDeleteBin6Line className="mr-1" />
            削除
          </button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-800">{product.name}</h2>
        </div>
        
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-semibold mb-4">商品情報</h3>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-500">商品ID</p>
                  <p className="font-medium">{product.id}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">価格</p>
                  <p className="font-medium text-lg">¥{product.price.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">在庫数</p>
                  <p className="font-medium">{product.stock} 個</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">作成日</p>
                  <p className="font-medium">{new Date(product.created_at).toLocaleDateString()}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">最終更新日</p>
                  <p className="font-medium">{new Date(product.updated_at).toLocaleDateString()}</p>
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-4">商品詳細</h3>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-500">説明</p>
                  <p className="font-medium whitespace-pre-line">{product.description || "説明なし"}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">商品画像</p>
                  {product.image_url ? (
                    <div className="mt-2">
                      <img
                        src={product.image_url}
                        alt={product.name}
                        className="max-w-full max-h-64 object-contain border border-gray-200 rounded"
                        onError={(e) => {
                          e.currentTarget.src = "https://via.placeholder.com/300?text=No+Image";
                        }}
                      />
                    </div>
                  ) : (
                    <p className="text-gray-500 italic">画像なし</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}