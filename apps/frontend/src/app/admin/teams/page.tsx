'use client'

import TeamList from "@/features/admin/teams/components/TeamList";
import TeamForm from "@/features/admin/teams/components/TeamForm";

export default function TeamsPage() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-800">チーム一覧</h2>
            </div>
            <TeamList/>
          </div>
        </div>

        <div className="lg:col-span-1">
          <TeamForm/>
        </div>
      </div>
    </div>
  );
}