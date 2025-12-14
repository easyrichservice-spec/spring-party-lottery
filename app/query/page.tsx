'use client';

import { useState } from 'react';

export default function QueryPage() {
  const [inputs, setInputs] = useState(['', '', '', '', '']);
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [fieldErrors, setFieldErrors] = useState(['', '', '', '', '']); // 每欄錯誤訊息

  // 更新輸入框（含五碼驗證）
  function updateInput(index: number, rawValue: string) {
    let value = rawValue.trim();
    let errors = [...fieldErrors];

    // 1️⃣ 只能輸入數字
    if (!/^\d*$/.test(value)) {
      errors[index] = '僅能輸入數字';
      value = '';
    }
    // 2️⃣ 限制最多五碼
    else if (value.length > 5) {
      errors[index] = '券號需為 5 位數';
      value = '';
    }
    // 3️⃣ 剛好五碼才算有效
    else if (value.length > 0 && value.length < 5) {
      errors[index] = '需為完整 5 位數';
    } else {
      errors[index] = '';
    }

    const next = [...inputs];
    next[index] = value;
    setInputs(next);
    setFieldErrors(errors);
  }

  // 查詢
  async function query() {
    setErrorMessage('');
    setResults([]);

    const tickets = inputs
      .map(x => x.trim())
      .filter(x => x.length === 5); // 只接受 5 碼券號

    if (tickets.length === 0) {
      setErrorMessage('請至少輸入一張正確的 5 位數券號再查詢');
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
    setFieldErrors(['', '', '', '', '']);
    setResults([]);
    setErrorMessage('');
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-extrabold mb-6">中獎查詢系統</h1>
      <p className="text-gray-600 mb-6">
        可輸入最多 5 張券號<br /> 超過五張票請開新分頁查詢。
      </p>

      {/* 輸入欄位 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {inputs.map((v, i) => (
          <input
            key={i}
            value={v}
            maxLength={5}
            inputMode="numeric"
            pattern="[0-9]*"
            placeholder={`券號 ${i + 1}`}
            className="p-3 border rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 text-center text-lg"
            onChange={(e) => {
              // 只允許數字
              const cleaned = e.target.value.replace(/\D/g, '');
              updateInput(i, cleaned);

              // 滿 5 碼 → 跳下一格
              if (cleaned.length === 5 && i < inputs.length - 1) {
                const nextInput = document.getElementById(`ticket-${i + 1}`);
                nextInput?.focus();
              }
            }}
            onKeyDown={(e) => {
              // Backspace 且欄位為空 → 回上一格
              if (e.key === "Backspace" && inputs[i] === "" && i > 0) {
                const prevInput = document.getElementById(`ticket-${i - 1}`);
                prevInput?.focus();
              }
            }}
            id={`ticket-${i}`}
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
                {r.area && r.area !== '-' ? (
                  // 檢查 r.area 是否為有效數字。
                  // 如果是數字 (例如: '1', '2')，則顯示「第X桌」。
                  // 如果不是數字 (例如: '準備中...')，則直接顯示原始字串，避免錯誤。
                  isNaN(Number(r.area)) 
                    ? <>{r.area}</> 
                    : <>第{r.area}桌</>
                ) : (
                  <>—</>  // r.area 為空或 '-'
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
