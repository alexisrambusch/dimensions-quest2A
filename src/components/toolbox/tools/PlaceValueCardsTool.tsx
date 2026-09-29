"use client";

import { useState } from "react";

const CARD_STYLE: Record<"h" | "t" | "o", string> = {
  h: "bg-rose-400",
  t: "bg-amber-400",
  o: "bg-sky-400",
};

/** Type any number and see it split into hundreds/tens/ones expander cards, showing its expanded form. */
export function PlaceValueCardsTool() {
  const [raw, setRaw] = useState("347");
  const n = Math.max(0, Math.min(999, Math.floor(Number(raw) || 0)));
  const hundreds = Math.floor(n / 100) * 100;
  const tens = Math.floor((n % 100) / 10) * 10;
  const ones = n % 10;
  const cards = (
    [
      { key: "h", value: hundreds },
      { key: "t", value: tens },
      { key: "o", value: ones },
    ] as const
  ).filter((c) => c.value > 0 || n === 0);

  return (
    <div className="flex flex-col items-center gap-5">
      <div className="flex items-center gap-2">
        <span className="text-sm font-semibold text-slate-500">Number:</span>
        <input
          type="number"
          inputMode="numeric"
          min={0}
          max={999}
          value={raw}
          onChange={(e) => setRaw(e.target.value)}
          className="w-24 text-center text-lg font-bold rounded-lg border-2 border-slate-300 focus:border-violet-500 outline-none py-1"
        />
      </div>

      <div className="flex flex-col items-end gap-2">
        {cards.map((c) => (
          <div
            key={c.key}
            className={`${CARD_STYLE[c.key]} rounded-lg shadow-md px-5 py-3 text-white font-black text-2xl tabular-nums`}
            style={{ minWidth: 90 + String(c.value).length * 4 }}
          >
            {c.value}
          </div>
        ))}
      </div>

      <p className="text-sm text-slate-500 text-center">
        {n} = {cards.map((c) => c.value).join(" + ") || "0"}
      </p>
    </div>
  );
}
