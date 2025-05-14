'use client'

import CompanyList from "@/features/admin/companies/components/CompanyList";
import CompanyForm from "@/features/admin/companies/components/CompanyForm";

export default function CompaniesPage() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-800">会社一覧</h2>
            </div>
            <CompanyList/>
          </div>
        </div>

        <div className="lg:col-span-1">
          <CompanyForm/>
        </div>
      </div>
    </div>
  );
}