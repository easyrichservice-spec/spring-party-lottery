"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const pathname = usePathname();

  const linkClass = (path: string) =>
    `px-4 py-2 rounded-lg font-semibold transition
     ${pathname === path ? "bg-blue-600 text-white" : "text-gray-700 hover:bg-gray-200"}`;

  return (
    <nav className="w-full bg-white shadow-sm border-b mb-6">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">

        {/* 左側 Logo */}
        <Link href="/" className="text-2xl font-bold text-gray-900">
          2026財富覺醒高峰會抽獎查詢系統
        </Link>

        {/* 右側導覽 */}
        <div className="flex gap-3">
          <Link href="/query" className={linkClass("/query")}>查詢頁面</Link>
          
        </div>

      </div>
    </nav>
  );
}
