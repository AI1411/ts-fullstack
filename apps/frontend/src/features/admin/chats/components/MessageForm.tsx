'use client'

import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { chatService } from "../services";
import { RiSendPlaneFill } from "react-icons/ri";

// 仮のユーザーID（実際の認証システムができたら変更する）
const CURRENT_USER_ID = 1;

interface MessageFormProps {
  chatId: number;
}

const MessageForm = ({ chatId }: MessageFormProps) => {
  const queryClient = useQueryClient();
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!message.trim()) return;

    setIsSubmitting(true);

    try {
      await chatService.createChatMessage(chatId, {
        sender_id: CURRENT_USER_ID,
        content: message.trim()
      });

      // 成功したらフォームをリセットしてキャッシュを更新
      setMessage("");
      await queryClient.invalidateQueries({ queryKey: ['chatMessages', chatId] });
    } catch (error) {
      console.error('Failed to send message:', error);
      // エラー処理（必要に応じて）
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex items-center" role="form">
      <input
        type="text"
        placeholder="メッセージを入力..."
        className="flex-1 px-4 py-2 rounded-l-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        disabled={isSubmitting}
      />
      <button
        type="submit"
        className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-r-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        disabled={!message.trim() || isSubmitting}
      >
        {isSubmitting ? (
          <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full" role="status"></div>
        ) : (
          <RiSendPlaneFill className="h-5 w-5" />
        )}
      </button>
    </form>
  );
};

export default MessageForm;
