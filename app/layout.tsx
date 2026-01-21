import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "./components/Navbar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "2026春酒抽獎查詢系統",
  description: "Query System",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh-TW">
      <body
        className={`
          ${geistSans.variable}
          ${geistMono.variable}
          antialiased
          bg-gray-100
          text-gray-900
          min-h-screen
        `}
      >
        {/* 🔹 全站通用 Navbar */}
        <Navbar />

        {/* 🔹 各頁面內容 */}
        <main className="max-w-7xl mx-auto px-6 pb-10">
          {children}
        </main>
      </body>
    </html>
  );
}
