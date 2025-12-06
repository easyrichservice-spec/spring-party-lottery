'use client';

import { useState } from 'react';

export default function QueryPage() {
  const [inputs, setInputs] = useState(['', '', '', '', '']);
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  function updateInput(index: number, value: string) {
    const next = [...inputs];
    next[index] = value;
    setInputs(next);
  }

  async function query() {
    const tickets = inputs.map(x => x.trim()).filter(Boolean);

    if (tickets.length === 0) {
      setResults([{ error: '請至少輸入一張券號再查詢。' }]);
      return;
    }

    setLoading(true);

    const res = await fetch('/api/query', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ tickets })
    }).then(r => r.json());

    setLoading(false);

    if (res.ok) setResults(res.results);
    else setResults([{ error: res.message }]);
  }

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h1 className="text-3xl font-extrabold mb-4">中獎查詢系統</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-4">
        {inputs.map((v, i) => (
          <input
            key={i}
            value={v}
            onChange={(e) => updateInput(i, e.target.value)}
            className="p-3 border border-gray-300 rounded-lg"
            placeholder={`券號 ${i + 1}`}
          />
        ))}
      </div>

      <div className="flex gap-3 mb-6">
        <button
          onClick={query}
          className="bg-blue-600 text-white px-6 py-2 rounded-lg"
        >
          查詢
        </button>

        <button
          onClick={() => {
            setInputs(['', '', '', '', '']);
            setResults([]);
          }}
          className="bg-gray-300 px-6 py-2 rounded-lg"
        >
          清除
        </button>
      </div>

      {loading && <div className="text-blue-600">查詢中，請稍候…</div>}

      <div className="space-y-4">
        {results.map((r, i) =>
          r.error ? (
            <div key={i} className="p-4 bg-yellow-100 text-yellow-800">
              {r.error}
            </div>
          ) : (
            <div
              key={i}
              className="p-4 bg-white shadow rounded-lg border flex justify-between"
            >
              <div>
                <div className="text-xs text-gray-500">抽獎券號碼</div>
                <div className="text-xl font-bold">{r.ticket}</div>
              </div>

              <div>
                <div className="text-xs text-gray-500">獎項</div>
                <div className="text-xl font-semibold text-green-700">{r.prize}</div>
              </div>

              <div className="text-right">
                <div className="text-xs text-gray-500">領獎區域</div>
                <div className="text-lg">{r.area}</div>
              </div>
            </div>
          )
        )}
      </div>
    </div>
  );
}
