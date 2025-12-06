import Link from "next/link";

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100">

      {/* 內容置中 */}
      <div className="flex flex-1 items-center justify-center px-6 py-20">
        
        {/* 卡片 */}
        <div
          className="
            max-w-xl w-full bg-white shadow-2xl rounded-3xl p-10 text-center border
            animate-fadeInUp
          "
        >
          {/* 標題 */}
          <h1 className="text-5xl font-extrabold text-gray-900 mb-4">
            🎉 抽獎系統入口
          </h1>

          <p className="text-gray-600 text-lg mb-10">
            提供快速查詢獎項資訊與後台統計管理  
            <br />
            請選擇您要使用的功能
          </p>

          {/* 兩個按鈕 */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">

            <Link
              href="/query"
              className="
                px-6 py-3 rounded-lg bg-blue-600 text-white font-semibold text-lg shadow
                hover:bg-blue-700 hover:scale-105 active:scale-95 transition
              "
            >
              🔍 查詢獎項
            </Link>

            <Link
              href="/dashboard"
              className="
                px-6 py-3 rounded-lg bg-gray-200 text-gray-800 font-semibold text-lg shadow
                hover:bg-gray-300 hover:scale-105 active:scale-95 transition
              "
            >
              📊 管理儀表板
            </Link>
          </div>
        </div>

      </div>

      {/* Footer */}
      <footer className="py-6 text-center text-gray-600 text-sm">
        <p>活動主辦：輕易豐盛的快樂天堂</p>
        <p>© 2025 All Rights Reserved</p>
      </footer>

      {/* Animations */}
      <style jsx>{`
        @keyframes fadeInUp {
          0% {
            opacity: 0;
            transform: translateY(20px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fadeInUp {
          animation: fadeInUp 0.8s ease-out;
        }
      `}</style>

    </div>
  );
}
