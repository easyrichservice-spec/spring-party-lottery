"use client";

import { useState, useMemo } from "react";

export default function DashboardClient({ tickets }: { tickets: any[] }) {
  const [search, setSearch] = useState("");
  const [filterPrize, setFilterPrize] = useState("");
  const [filterArea, setFilterArea] = useState("");
  const [sortKey, setSortKey] = useState("ticket_no");
  const [sortAsc, setSortAsc] = useState(true);
  const [page, setPage] = useState(1);

  const pageSize = 10;

  // -----------------------------
  // 搜尋 + 篩選 + 排序
  // -----------------------------
  const filtered = useMemo(() => {
    let list = [...tickets];

    const q = search.toLowerCase();

    if (q) {
      list = list.filter(
        (r) =>
          r.ticket_no.toString().includes(q) ||
          r.prize_name?.toLowerCase().includes(q) ||
          r.prize_area?.toString().includes(q)
      );
    }

    if (filterPrize) {
      list = list.filter((r) => r.prize_name === filterPrize);
    }

    if (filterArea) {
      list = list.filter((r) => r.prize_area === filterArea);
    }

    list.sort((a, b) => {
      const A = a[sortKey]?.toString() || "";
      const B = b[sortKey]?.toString() || "";
      return sortAsc ? A.localeCompare(B) : B.localeCompare(A);
    });

    return list;
  }, [tickets, search, filterPrize, filterArea, sortKey, sortAsc]);

  // -----------------------------
  // 分頁
  // -----------------------------
  const totalPages = Math.ceil(filtered.length / pageSize);
  const paged = filtered.slice((page - 1) * pageSize, page * pageSize);

  // -----------------------------
  // 排序箭頭
  // -----------------------------
  function toggleSort(key: string) {
    if (sortKey === key) setSortAsc(!sortAsc);
    else {
      setSortKey(key);
      setSortAsc(true);
    }
  }

  const prizeList = [...new Set(tickets.map((t) => t.prize_name).filter(Boolean))];
  const areaList = [...new Set(tickets.map((t) => t.prize_area).filter(Boolean))];

  return (
    <div className="max-w-7xl mx-auto px-6 py-10">

      {/* 標題 */}
      <h1 className="text-4xl font-extrabold text-gray-900 mb-8">抽獎儀表板</h1>

      {/* 統計卡片 */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
        <StatCard label="總中獎券數" value={tickets.length} />
        <StatCard label="獎項種類數" value={prizeList.length} />
        <StatCard label="領獎區域數" value={areaList.length} />
      </div>

      {/* 搜尋 / 篩選 */}
      <div className="flex flex-wrap gap-4 mb-6">

        <input
          className="px-4 py-2 border rounded-lg bg-white text-gray-900 shadow-sm"
          placeholder="搜尋券號 / 獎品 / 區域"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
        />

        <select
          className="px-4 py-2 border rounded-lg bg-white text-gray-900 shadow-sm"
          value={filterPrize}
          onChange={(e) => {
            setFilterPrize(e.target.value);
            setPage(1);
          }}
        >
          <option value="">全部獎項</option>
          {prizeList.map((p) => (
            <option key={p}>{p}</option>
          ))}
        </select>

        <select
          className="px-4 py-2 border rounded-lg bg-white text-gray-900 shadow-sm"
          value={filterArea}
          onChange={(e) => {
            setFilterArea(e.target.value);
            setPage(1);
          }}
        >
          <option value="">全部區域</option>
          {areaList.map((a) => (
            <option key={a}>{a}</option>
          ))}
        </select>
      </div>

      {/* 表格 */}
      <div className="bg-white rounded-xl shadow overflow-hidden">
        <table className="min-w-full">
          <thead className="bg-gray-100">
            <tr className="text-gray-800">
              <Th onClick={() => toggleSort("ticket_no")}>
                券號 {sortKey === "ticket_no" ? (sortAsc ? "↑" : "↓") : ""}
              </Th>
              <Th onClick={() => toggleSort("prize_name")}>
                獎品 {sortKey === "prize_name" ? (sortAsc ? "↑" : "↓") : ""}
              </Th>
              <Th onClick={() => toggleSort("prize_area")}>
                區域 {sortKey === "prize_area" ? (sortAsc ? "↑" : "↓") : ""}
              </Th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-200 text-gray-900">
            {paged.map((row) => (
              <tr key={row.id} className="hover:bg-gray-200 transition">
                <Td>{row.ticket_no}</Td>
                <Td>{row.prize_name}</Td>
                <Td>{row.prize_area}</Td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* 分頁 */}
      <div className="flex items-center justify-between mt-6">
        <button
          className="px-4 py-2 bg-gray-300 rounded-lg disabled:opacity-40"
          disabled={page <= 1}
          onClick={() => setPage(page - 1)}
        >
          上一頁
        </button>

        <span className="text-white">
          第 {page} / {totalPages} 頁
        </span>

        <button
          className="px-4 py-2 bg-gray-300 rounded-lg disabled:opacity-40"
          disabled={page >= totalPages}
          onClick={() => setPage(page + 1)}
        >
          下一頁
        </button>
      </div>
    </div>
  );
}

function StatCard({ label, value }: any) {
  return (
    <div className="bg-white p-6 shadow rounded-xl border">
      <p className="text-gray-700 text-sm">{label}</p>
      <p className="text-3xl font-bold text-gray-900">{value}</p>
    </div>
  );
}

function Th({ children, onClick }: any) {
  return (
    <th
      className="px-6 py-3 text-left font-bold text-gray-700 uppercase text-sm cursor-pointer"
      onClick={onClick}
    >
      {children}
    </th>
  );
}

function Td({ children }: any) {
  return <td className="px-6 py-3 whitespace-nowrap">{children}</td>;
}
