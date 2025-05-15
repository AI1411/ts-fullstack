'use client'

import {useQuery, useQueryClient} from "@tanstack/react-query";
import React, {useState} from "react";
import {countryService} from "../services";
import {RiArrowDownSLine, RiArrowRightSLine} from "react-icons/ri";
import Link from "next/link";

// Country型定義
type Country = {
  id: number;
  name: string;
  code: string | null;
  flag_url: string | null;
  created_at: string;
  updated_at: string;
};

const CountryList = () => {
  const queryClient = useQueryClient();
  const [editingCountryId, setEditingCountryId] = useState<number | null>(null);
  const [expandedCountryId, setExpandedCountryId] = useState<number | null>(null);
  const [editFormData, setEditFormData] = useState({
    name: "",
    code: "",
    flag_url: ""
  });

  // Country一覧を取得
  const {data: countries, isLoading, error} = useQuery({
    queryKey: ['countries'],
    queryFn: countryService.getCountries
  });

  // 編集モードを開始
  const handleEdit = (country: Country) => {
    setEditingCountryId(country.id);
    setEditFormData({
      name: country.name,
      code: country.code || "",
      flag_url: country.flag_url || ""
    });
  };

  // 編集をキャンセル
  const handleCancelEdit = () => {
    setEditingCountryId(null);
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

  // Countryを更新
  const handleUpdate = async (countryId: number) => {
    try {
      const updateData = {
        ...editFormData
      };

      await countryService.updateCountry(countryId, updateData);

      // 成功したらキャッシュを更新
      await queryClient.invalidateQueries({queryKey: ['countries']});
      setEditingCountryId(null);
    } catch (error) {
      console.error("Failed to update country:", error);
      alert("国の更新に失敗しました");
    }
  };

  // Countryを削除
  const handleDelete = async (countryId: number) => {
    if (!confirm("本当にこの国を削除しますか？")) return;

    try {
      await countryService.deleteCountry(countryId);
      // 成功したらキャッシュを更新
      await queryClient.invalidateQueries({queryKey: ['countries']});
    } catch (error) {
      console.error("Failed to delete country:", error);
      alert("国の削除に失敗しました");
    }
  };

  // 詳細表示の切り替え
  const toggleExpand = (countryId: number) => {
    setExpandedCountryId(expandedCountryId === countryId ? null : countryId);
  };

  if (isLoading) return <div className="text-center py-4">読み込み中...</div>;
  if (error) return <div className="text-center py-4 text-red-500">エラーが発生しました</div>;
  if (!countries || countries.length === 0) return <div className="text-center py-4">国がありません</div>;

  return (
    <div className="bg-white shadow-md rounded-lg overflow-hidden">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">国名</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">コード</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">作成日</th>
            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">アクション</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {countries.map(country => (
            <React.Fragment key={country.id}>
              <tr className={expandedCountryId === country.id ? 'bg-gray-50' : ''}>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{country.id}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    {editingCountryId === country.id ? (
                      <input
                        type="text"
                        name="name"
                        value={editFormData.name}
                        onChange={handleChange}
                        className="border rounded px-2 py-1 w-full"
                      />
                    ) : (
                      <div className="text-sm font-medium text-gray-900">
                        <Link href={`/admin/countries/${country.id}`} className="hover:text-blue-500">
                          {country.name}
                        </Link>
                      </div>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {editingCountryId === country.id ? (
                    <input
                      type="text"
                      name="code"
                      value={editFormData.code}
                      onChange={handleChange}
                      className="border rounded px-2 py-1 w-full"
                    />
                  ) : (
                    <div className="text-sm text-gray-900">{country.code || "-"}</div>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">
                    {new Date(country.created_at).toLocaleDateString()}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div className="flex items-center justify-end space-x-2">
                    {editingCountryId === country.id ? (
                      <>
                        <button
                          onClick={() => handleUpdate(country.id)}
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
                          onClick={() => toggleExpand(country.id)}
                          className="text-gray-600 hover:text-gray-900 flex items-center"
                        >
                          {expandedCountryId === country.id ? <RiArrowDownSLine /> : <RiArrowRightSLine />}
                        </button>
                        <button
                          onClick={() => handleEdit(country)}
                          className="text-indigo-600 hover:text-indigo-900"
                        >
                          編集
                        </button>
                        <button
                          onClick={() => handleDelete(country.id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          削除
                        </button>
                      </>
                    )}
                  </div>
                </td>
              </tr>
              {expandedCountryId === country.id && (
                <tr key={`${country.id}-details`}>
                  <td colSpan={5} className="px-6 py-4">
                    <div className="p-2">
                      <h3 className="font-bold mb-2">国の詳細</h3>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm text-gray-600 mb-1">国旗URL:</p>
                          <p className="break-all">{country.flag_url || "国旗なし"}</p>
                          {country.flag_url && (
                            <div className="mt-2">
                              <img 
                                src={country.flag_url} 
                                alt={country.name} 
                                className="max-w-xs max-h-32 object-contain"
                                onError={(e) => {
                                  e.currentTarget.src = "https://via.placeholder.com/150?text=No+Flag";
                                }}
                              />
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="mt-2">
                        <p className="text-sm text-gray-600 mb-1">最終更新日:</p>
                        <p>{new Date(country.updated_at).toLocaleString()}</p>
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

export default CountryList;
