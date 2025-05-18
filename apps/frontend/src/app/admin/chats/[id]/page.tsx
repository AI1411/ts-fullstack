'use client';

import ChatDetail from '@/features/admin/chats/components/ChatDetail';

interface ChatDetailPageProps {
  params: {
    id: string;
  };
}

export default function ChatDetailPage({ params }: ChatDetailPageProps) {
  const chatId = Number.parseInt(params.id);

  return (
    <div className="space-y-6">
      <ChatDetail chatId={chatId} />
    </div>
  );
}
