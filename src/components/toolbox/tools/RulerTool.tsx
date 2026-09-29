"use client";

import { useState } from "react";
import clsx from "clsx";

/** A static cm/inch reference ruler — no measuring task attached, just a ruler to look at or line objects up against on-screen. */
export function RulerTool() {
  const [unit, setUnit] = useState<"cm" | "in">("cm");
  const length = unit === "cm" ? 30 : 12;
  const pxPerUnit = unit === "cm" ? 11 : 26;
  const majorEvery = unit === "cm" ? 5 : 1;
  const ticks = Array.from({ length: length + 1 }, (_, i) => i);

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="flex gap-2">
        {(["cm", "in"] as const).map((u) => (
          <button
            key={u}
            type="button"
            onClick={() => setUnit(u)}
            className={clsx(
              "rounded-full px-4 py-1.5 text-sm font-bold border-2 touch-manipulation",
              unit === u ? "bg-violet-600 border-violet-600 text-white" : "bg-white border-slate-200 text-slate-600 hover:border-violet-300",
            )}
          >
            {u === "cm" ? "Centimeters" : "Inches"}
          </button>
        ))}
      </div>

      <div className="overflow-x-auto max-w-full">
        <div
          className="relative h-14 bg-amber-50 border-2 border-amber-300 rounded-md"
          style={{ width: length * pxPerUnit + 8 }}
        >
          {ticks.map((t) => (
            <div key={t} className="absolute top-0 h-full flex flex-col items-center justify-end pb-0.5" style={{ left: t * pxPerUnit + 4 }}>
              <span className={`w-px ${t % majorEvery === 0 ? "h-6 bg-slate-600" : "h-3 bg-slate-400"}`} />
              {t % majorEvery === 0 && <span className="text-[10px] text-slate-500 -mt-0.5">{t}</span>}
            </div>
          ))}
        </div>
      </div>
      <p className="text-sm text-slate-500">0 to {length} {unit === "cm" ? "centimeters" : "inches"}.</p>
    </div>
  );
}
