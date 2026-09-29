"use client";

import { useState } from "react";
import clsx from "clsx";
import { SECONDARY_BUTTON } from "../../ui";

/** Two blank 5x2 ten-frames the student can tap to fill in — for counting, addition, and making ten. */
export function TenFrameTool() {
  const [filled, setFilled] = useState<Set<number>>(new Set());

  function toggle(i: number) {
    setFilled((prev) => {
      const next = new Set(prev);
      if (next.has(i)) next.delete(i);
      else next.add(i);
      return next;
    });
  }

  function frame(offset: number) {
    return (
      <div className="grid grid-cols-5 grid-rows-2 gap-1.5 rounded-lg border-2 border-slate-400 bg-slate-50 p-1.5">
        {Array.from({ length: 10 }, (_, i) => offset + i).map((i) => (
          <button
            key={i}
            type="button"
            onClick={() => toggle(i)}
            className={clsx(
              "h-9 w-9 rounded-md border-2 border-slate-300 touch-manipulation transition-colors flex items-center justify-center",
              filled.has(i) ? "bg-blue-500 border-blue-600" : "bg-white hover:bg-slate-100",
            )}
            aria-label={`Ten-frame cell ${i + 1}`}
          />
        ))}
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="flex flex-col gap-3">
        {frame(0)}
        {frame(10)}
      </div>
      <div className="text-2xl font-black text-blue-700 tabular-nums">{filled.size}</div>
      <button type="button" className={clsx(SECONDARY_BUTTON, "!min-h-10 !py-2 !px-4 text-sm")} onClick={() => setFilled(new Set())}>
        Clear
      </button>
    </div>
  );
}
