'use client'

import NotificationList from "@/features/admin/notifications/components/NotificationList";
import NotificationForm from "@/features/admin/notifications/components/NotificationForm";

export default function NotificationsPage() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-800">通知一覧</h2>
            </div>
            <NotificationList/>
          </div>
        </div>

        <div className="lg:col-span-1">
          <NotificationForm/>
        </div>
      </div>
    </div>
  );
}