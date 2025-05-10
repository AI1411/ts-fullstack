'use client'

import { useQuery } from "@tanstack/react-query";
import { productService } from "@/features/admin/products/services";
import { useParams } from "next/navigation";
import ProductForm from "@/features/admin/products/components/ProductForm";
import Link from "next/link";
import { RiArrowLeftLine } from "react-icons/ri";

export default function EditProductPage() {
  const params = useParams();
  const productId = parseInt(params.id as string);

  // 商品詳細を取得
  const { data: product, isLoading, error } = useQuery({
    queryKey: ['product', productId],
    queryFn: () => productService.getProductById(productId),
    enabled: !isNaN(productId)
  });

  if (isLoading) return <div className="p-6">読み込み中...</div>;
  if (error) return <div className="p-6 text-red-500">エラーが発生しました</div>;
  if (!product) return <div className="p-6">商品が見つかりません</div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center mb-6">
        <Link 
          href={`/admin/products/${productId}`} 
          className="flex items-center text-blue-500 hover:text-blue-700"
        >
          <RiArrowLeftLine className="mr-1" />
          商品詳細に戻る
        </Link>
      </div>

      <div className="grid grid-cols-1 gap-6">
        <div>
          <div className="bg-white rounded-lg shadow">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-800">商品を編集: {product.name}</h2>
            </div>
            <div className="p-6">
              <ProductForm initialData={product} isEditing={true} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}