'use client'

import {useState} from "react";
import {useQueryClient} from "@tanstack/react-query";
import {orderService} from "../services";
import {productService} from "../../products/services";
import {useQuery} from "@tanstack/react-query";

interface OrderItemInput {
  product_id: number;
  quantity: number;
}

const OrderForm = () => {
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState({
    customer_name: "",
    customer_email: "",
  });
  const [orderItems, setOrderItems] = useState<OrderItemInput[]>([
    {product_id: 0, quantity: 1}
  ]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // 商品一覧を取得
  const {data: products} = useQuery({
    queryKey: ['products'],
    queryFn: productService.getProducts
  });

  // フォーム入力の更新
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const {name, value} = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // 注文商品の更新
  const handleItemChange = (index: number, field: keyof OrderItemInput, value: number) => {
    const newItems = [...orderItems];
    newItems[index] = {
      ...newItems[index],
      [field]: value
    };
    setOrderItems(newItems);
  };

  // 注文商品の追加
  const handleAddItem = () => {
    setOrderItems([...orderItems, {product_id: 0, quantity: 1}]);
  };

  // 注文商品の削除
  const handleRemoveItem = (index: number) => {
    if (orderItems.length > 1) {
      setOrderItems(orderItems.filter((_, i) => i !== index));
    }
  };

  // フォーム送信
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    setSuccess(null);

    // バリデーション
    if (!formData.customer_name.trim()) {
      setError("顧客名を入力してください");
      setIsSubmitting(false);
      return;
    }

    if (!formData.customer_email.trim()) {
      setError("メールアドレスを入力してください");
      setIsSubmitting(false);
      return;
    }

    // メールアドレスの簡易バリデーション
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.customer_email)) {
      setError("有効なメールアドレスを入力してください");
      setIsSubmitting(false);
      return;
    }

    // 商品のバリデーション
    const validItems = orderItems.filter(item => item.product_id > 0 && item.quantity > 0);
    if (validItems.length === 0) {
      setError("少なくとも1つの有効な商品を選択してください");
      setIsSubmitting(false);
      return;
    }

    try {
      await orderService.createOrder({
        customer_name: formData.customer_name,
        customer_email: formData.customer_email,
        items: validItems
      });

      // 成功したらフォームをリセットしてキャッシュを更新
      setFormData({
        customer_name: "",
        customer_email: "",
      });
      setOrderItems([{product_id: 0, quantity: 1}]);
      setSuccess("注文が正常に作成されました");
      await queryClient.invalidateQueries({queryKey: ['orders']});
    } catch (error) {
      console.error("Failed to create order:", error);
      setError("注文の作成に失敗しました");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="p-6 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-800">新規注文</h2>
      </div>
      <form onSubmit={handleSubmit} className="p-6 space-y-4">
        {error && (
          <div className="bg-red-50 text-red-500 p-3 rounded-md text-sm">
            {error}
          </div>
        )}
        {success && (
          <div className="bg-green-50 text-green-500 p-3 rounded-md text-sm">
            {success}
          </div>
        )}

        <div>
          <label htmlFor="customer_name" className="block text-sm font-medium text-gray-700 mb-1">
            顧客名 <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="customer_name"
            name="customer_name"
            value={formData.customer_name}
            onChange={handleChange}
            className="w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            required
          />
        </div>

        <div>
          <label htmlFor="customer_email" className="block text-sm font-medium text-gray-700 mb-1">
            メールアドレス <span className="text-red-500">*</span>
          </label>
          <input
            type="email"
            id="customer_email"
            name="customer_email"
            value={formData.customer_email}
            onChange={handleChange}
            className="w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            required
          />
        </div>

        <div>
          <div className="flex justify-between items-center mb-2">
            <label className="block text-sm font-medium text-gray-700">
              注文商品 <span className="text-red-500">*</span>
            </label>
            <button
              type="button"
              onClick={handleAddItem}
              className="text-sm text-blue-600 hover:text-blue-800"
            >
              + 商品を追加
            </button>
          </div>

          <div className="space-y-3">
            {orderItems.map((item, index) => (
              <div key={index} className="flex items-center space-x-2">
                <div className="flex-grow">
                  <select
                    value={item.product_id}
                    onChange={(e) => handleItemChange(index, 'product_id', parseInt(e.target.value))}
                    className="w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value={0}>商品を選択</option>
                    {products?.map(product => (
                      <option key={product.id} value={product.id}>
                        {product.name} (¥{product.price.toLocaleString()})
                      </option>
                    ))}
                  </select>
                </div>
                <div className="w-24">
                  <input
                    type="number"
                    min="1"
                    value={item.quantity}
                    onChange={(e) => handleItemChange(index, 'quantity', parseInt(e.target.value))}
                    className="w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => handleRemoveItem(index)}
                  className="text-red-500 hover:text-red-700"
                >
                  削除
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="pt-4">
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
          >
            {isSubmitting ? "送信中..." : "注文を作成"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default OrderForm;