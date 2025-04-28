'use client'

import Todos from "@/components/Todos";
import TodoInput from "@/components/TodoInput";
import Link from "next/link";

export default function Home() {
  return (
    <div className="mt-10">
      <div className="flex justify-between items-center max-w-[600px] mx-auto mb-6">
        <h1 className="text-3xl font-bold">Todo</h1>
        <Link
          href="/admin"
          className="bg-gray-800 hover:bg-gray-700 text-white font-medium py-2 px-4 rounded transition-colors"
        >
          管理画面へ
        </Link>
      </div>
      <TodoInput />
      <Todos />
    </div>
  );
}