"use client";

import { useState } from "react";
import clsx from "clsx";

const FACTORS = Array.from({ length: 10 }, (_, i) => i + 1);
const SPOTLIGHTS = [2, 5, 10];

/** A 10x10 multiplication reference chart, with the ×2/×5/×10 row & column spotlighted for this grade's curriculum scope. */
export function MultiplicationChartTool() {
  const [spotlight, setSpotlight] = useState<number | null>(null);

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => setSpotlight(null)}
          className={clsx(
            "rounded-full px-3 py-1.5 text-xs font-bold border-2 touch-manipulation",
            spotlight === null ? "bg-blue-600 border-blue-600 text-white" : "bg-white border-slate-200 text-slate-600 hover:border-blue-300",
          )}
        >
          All facts
        </button>
        {SPOTLIGHTS.map((f) => (
          <button
            key={f}
            type="button"
            onClick={() => setSpotlight(f)}
            className={clsx(
              "rounded-full px-3 py-1.5 text-xs font-bold border-2 touch-manipulation",
              spotlight === f ? "bg-blue-600 border-blue-600 text-white" : "bg-white border-slate-200 text-slate-600 hover:border-blue-300",
            )}
          >
            ×{f}
          </button>
        ))}
      </div>

      <div className="overflow-x-auto max-w-full">
        <table className="border-collapse text-xs">
          <thead>
            <tr>
              <th className="h-7 w-7 bg-slate-100 text-slate-400">×</th>
              {FACTORS.map((c) => (
                <th
                  key={c}
                  className={clsx(
                    "h-7 w-7 font-bold",
                    spotlight === c ? "bg-blue-600 text-white" : "bg-slate-100 text-slate-600",
                  )}
                >
                  {c}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {FACTORS.map((r) => (
              <tr key={r}>
                <th
                  className={clsx(
                    "h-7 w-7 font-bold",
                    spotlight === r ? "bg-blue-600 text-white" : "bg-slate-100 text-slate-600",
                  )}
                >
                  {r}
                </th>
                {FACTORS.map((c) => {
                  const isSpot = spotlight !== null && (spotlight === r || spotlight === c);
                  return (
                    <td
                      key={c}
                      className={clsx(
                        "h-7 w-7 text-center tabular-nums border border-slate-100",
                        isSpot ? "bg-amber-100 text-amber-900 font-bold" : "text-slate-600",
                      )}
                    >
                      {r * c}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
