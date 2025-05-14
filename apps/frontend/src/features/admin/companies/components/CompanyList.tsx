'use client'

import {useQuery, useQueryClient} from "@tanstack/react-query";
import {useState} from "react";
import {companyService} from "../services";
import {RiArrowDownSLine, RiArrowRightSLine} from "react-icons/ri";
import Link from "next/link";

// Company型定義
type Company = {
  id: number;
  name: string;
  description: string | null;
  address: string | null;
  phone: string | null;
  email: string | null;
  website: string | null;
  created_at: string;
  updated_at: string;
};

const CompanyList = () => {
  const queryClient = useQueryClient();
  const [editingCompanyId, setEditingCompanyId] = useState<number | null>(null);
  const [expandedCompanyId, setExpandedCompanyId] = useState<number | null>(null);
  const [editFormData, setEditFormData] = useState({
    name: "",
    description: "",
    address: "",
    phone: "",
    email: "",
    website: ""
  });

  // Company一覧を取得
  const {data: companies, isLoading, error} = useQuery({
    queryKey: ['companies'],
    queryFn: companyService.getCompanies
  });

  // 編集モードを開始
  const handleEdit = (company: Company) => {
    setEditingCompanyId(company.id);
    setEditFormData({
      name: company.name,
      description: company.description || "",
      address: company.address || "",
      phone: company.phone || "",
      email: company.email || "",
      website: company.website || ""
    });
  };

  // 編集をキャンセル
  const handleCancelEdit = () => {
    setEditingCompanyId(null);
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

  // Companyを更新
  const handleUpdate = async (companyId: number) => {
    try {
      const updateData = {
        ...editFormData
      };

      await companyService.updateCompany(companyId, updateData);

      // 成功したらキャッシュを更新
      await queryClient.invalidateQueries({queryKey: ['companies']});
      setEditingCompanyId(null);
    } catch (error) {
      console.error("Failed to update company:", error);
      alert("会社の更新に失敗しました");
    }
  };

  // Companyを削除
  const handleDelete = async (companyId: number) => {
    if (!confirm("本当にこの会社を削除しますか？")) return;

    try {
      await companyService.deleteCompany(companyId);
      // 成功したらキャッシュを更新
      await queryClient.invalidateQueries({queryKey: ['companies']});
    } catch (error) {
      console.error("Failed to delete company:", error);
      alert("会社の削除に失敗しました");
    }
  };

  // 詳細表示の切り替え
  const toggleExpand = (companyId: number) => {
    setExpandedCompanyId(expandedCompanyId === companyId ? null : companyId);
  };

  if (isLoading) return <div className="text-center py-4">読み込み中...</div>;
  if (error) return <div className="text-center py-4 text-red-500">エラーが発生しました</div>;
  if (!companies || companies.length === 0) return <div className="text-center py-4">会社がありません</div>;

  return (
    <div className="bg-white shadow-md rounded-lg overflow-hidden">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">会社名</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">メール</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">電話番号</th>
            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">アクション</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {companies.map(company => (
            <>
              <tr key={company.id} className={expandedCompanyId === company.id ? 'bg-gray-50' : ''}>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{company.id}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    {editingCompanyId === company.id ? (
                      <input
                        type="text"
                        name="name"
                        value={editFormData.name}
                        onChange={handleChange}
                        className="border rounded px-2 py-1 w-full"
                      />
                    ) : (
                      <div className="text-sm font-medium text-gray-900">
                        <Link href={`/admin/companies/${company.id}`} className="hover:text-blue-500">
                          {company.name}
                        </Link>
                      </div>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {editingCompanyId === company.id ? (
                    <input
                      type="email"
                      name="email"
                      value={editFormData.email}
                      onChange={handleChange}
                      className="border rounded px-2 py-1 w-full"
                    />
                  ) : (
                    <div className="text-sm text-gray-900">{company.email || "-"}</div>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {editingCompanyId === company.id ? (
                    <input
                      type="text"
                      name="phone"
                      value={editFormData.phone}
                      onChange={handleChange}
                      className="border rounded px-2 py-1 w-full"
                    />
                  ) : (
                    <div className="text-sm text-gray-900">{company.phone || "-"}</div>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div className="flex items-center justify-end space-x-2">
                    {editingCompanyId === company.id ? (
                      <>
                        <button
                          onClick={() => handleUpdate(company.id)}
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
                          onClick={() => toggleExpand(company.id)}
                          className="text-gray-600 hover:text-gray-900 flex items-center"
                        >
                          {expandedCompanyId === company.id ? <RiArrowDownSLine /> : <RiArrowRightSLine />}
                        </button>
                        <button
                          onClick={() => handleEdit(company)}
                          className="text-indigo-600 hover:text-indigo-900"
                        >
                          編集
                        </button>
                        <button
                          onClick={() => handleDelete(company.id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          削除
                        </button>
                      </>
                    )}
                  </div>
                </td>
              </tr>
              {expandedCompanyId === company.id && (
                <tr>
                  <td colSpan={5} className="px-6 py-4">
                    <div className="p-2">
                      <h3 className="font-bold mb-2">会社詳細</h3>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm text-gray-600 mb-1">説明:</p>
                          <p>{company.description || "説明なし"}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600 mb-1">住所:</p>
                          <p>{company.address || "住所なし"}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600 mb-1">ウェブサイト:</p>
                          <p className="break-all">
                            {company.website ? (
                              <a href={company.website} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
                                {company.website}
                              </a>
                            ) : "ウェブサイトなし"}
                          </p>
                        </div>
                      </div>
                      <div className="mt-2">
                        <p className="text-sm text-gray-600 mb-1">最終更新日:</p>
                        <p>{new Date(company.updated_at).toLocaleString()}</p>
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
  );
};

export default CompanyList;