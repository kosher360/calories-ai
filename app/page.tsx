"use client";

import { useState } from "react";

type Result = {
  calories?: number;
  protein?: number;
  carbs?: number;
  fat?: number;
  [k: string]: any;
};

export default function Home() {
  const [food, setFood] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<Result | null>(null);

  async function analyze() {
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ food }),
      });

      if (!res.ok) {
        const j = await res.json().catch(() => ({}));
        throw new Error(j.error || `Request failed (${res.status})`);
      }

      const data = await res.json();
      setResult(data);
    } catch (e: any) {
      setError(e.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen flex flex-col items-center p-6 gap-6">
      <h1 className="text-2xl font-semibold">Calories Analyzer (text MVP)</h1>

      <div className="w-full max-w-xl flex gap-2">
        <input
          className="flex-1 border rounded px-3 py-2"
          placeholder='e.g. "200g rice, 1 banana, 200ml milk"'
          value={food}
          onChange={(e) => setFood(e.target.value)}
        />
        <button
          onClick={analyze}
          disabled={!food || loading}
          className="px-4 py-2 rounded bg-black text-white disabled:opacity-50"
        >
          {loading ? "Analyzing…" : "Analyze"}
        </button>
      </div>

      {error && (
        <div className="w-full max-w-xl text-red-600 text-sm border border-red-200 bg-red-50 p-3 rounded">
          {error}
        </div>
      )}

      {result && (
        <div className="w-full max-w-xl border rounded p-4 bg-white">
          <h2 className="font-medium mb-2">Result</h2>
          <div className="grid grid-cols-4 gap-2 text-center">
            <div><div className="text-xs text-gray-500">Calories</div><div className="text-lg">{result.calories ?? "—"}</div></div>
            <div><div className="text-xs text-gray-500">Protein (g)</div><div className="text-lg">{result.protein ?? "—"}</div></div>
            <div><div className="text-xs text-gray-500">Carbs (g)</div><div className="text-lg">{result.carbs ?? "—"}</div></div>
            <div><div className="text-xs text-gray-500">Fat (g)</div><div className="text-lg">{result.fat ?? "—"}</div></div>
          </div>

          <pre className="mt-4 text-xs bg-gray-50 p-3 rounded overflow-auto">
            {JSON.stringify(result, null, 2)}
          </pre>
        </div>
      )}

      <p className="text-xs text-gray-500">
        Tip: start with something simple like <strong>“200g rice”</strong>.
      </p>
    </main>
  );
}
