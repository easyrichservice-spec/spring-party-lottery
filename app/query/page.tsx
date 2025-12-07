'use client';

import { useState } from 'react';

export default function QueryPage() {
  const [inputs, setInputs] = useState(['', '', '', '', '']);
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // 更新輸入框
  function updateInput(index: number, value: string) {
    const next = [...inputs];
    next[index] = value;
    setInputs(next);
  }

  // 查詢
  async function query() {
    setErrorMessage('');
    setResults([]);

    const tickets = inputs.map(x => x.trim()).filter(Boolean);

    if (tickets.length === 0) {
      setErrorMessage('請至少輸入一張券號再查詢');
      return;
    }

    setLoading(true);

    try {
      const res = await fetch('/api/query', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tickets }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || '查詢失敗');

      setResults(data.results || []);
    } catch (err: any) {
      setErrorMessage(err.message || '查詢時發生錯誤');
    }

    setLoading(false);
  }

  // 清除
  function clearAll() {
    setInputs(['', '', '', '', '']);
    setResults([]);
    setErrorMessage('');
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-extrabold mb-6">中獎查詢系統</h1>
      <p className="text-gray-600 mb-6">
        可輸入最多 5 張券號（每欄一張），按「查詢」即可顯示結果。
      </p>

      {/* 輸入欄位 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {inputs.map((v, i) => (
          <input
            key={i}
            value={v}
            onChange={(e) => updateInput(i, e.target.value)}
            placeholder={`券號 ${i + 1}`}
            className="p-3 border rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
          />
        ))}
      </div>

      {/* 按鈕列 */}
      <div className="flex gap-4 mt-6">
        <button
          onClick={query}
          disabled={loading}
          className={`bg-blue-600 text-white font-semibold py-2 px-6 rounded-lg shadow hover:bg-blue-700 transition ${
            loading ? 'opacity-60 cursor-not-allowed' : ''
          }`}
        >
          {loading ? '查詢中…' : '查詢'}
        </button>

        <button
          onClick={clearAll}
          className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold py-2 px-6 rounded-lg shadow"
        >
          清除
        </button>
      </div>

      {/* 錯誤訊息 */}
      {errorMessage && (
        <div className="mt-6 p-4 bg-red-100 text-red-700 border border-red-300 rounded-lg">
          {errorMessage}
        </div>
      )}

      {/* 查詢結果 */}
      <div className="mt-6 space-y-4">
        {results.map((r, i) => (
          <div
            key={i}
            className="p-4 bg-white rounded-xl shadow border flex justify-between items-center"
          >
            <div>
              <div className="text-xs text-gray-500 mb-1">抽獎券號碼</div>
              <div className="text-xl font-bold">{r.ticket}</div>
            </div>

            <div className="text-center">
              <div className="text-xs text-gray-500 mb-1">獎品</div>
              <div
                className={`text-lg font-semibold ${
                  r.prize && r.prize !== '查無中獎紀錄'
                    ? 'text-green-700'
                    : 'text-red-600'
                }`}
              >
                {r.prize || '查無中獎紀錄'}
              </div>
            </div>

            <div className="text-right">
              <div className="text-xs text-gray-500 mb-1">領獎區域</div>
              <div className="text-lg text-gray-700">
                第{r.area || '—'}桌
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
