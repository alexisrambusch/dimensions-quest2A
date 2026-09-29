"use client";

import { useState } from "react";
import clsx from "clsx";
import { SECONDARY_BUTTON } from "../../ui";

/** A 1-100 grid the student can tap to highlight numbers — for skip counting, patterns, and place value. */
export function HundredChartTool() {
  const [highlighted, setHighlighted] = useState<Set<number>>(new Set());

  function toggle(n: number) {
    setHighlighted((prev) => {
      const next = new Set(prev);
      if (next.has(n)) next.delete(n);
      else next.add(n);
      return next;
    });
  }

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="grid grid-cols-10 gap-1 select-none">
        {Array.from({ length: 100 }, (_, i) => i + 1).map((n) => (
          <button
            key={n}
            type="button"
            onClick={() => toggle(n)}
            className={clsx(
              "h-8 w-8 rounded-md text-[11px] font-bold flex items-center justify-center touch-manipulation transition-colors",
              highlighted.has(n) ? "bg-violet-600 text-white" : "bg-slate-50 text-slate-600 hover:bg-slate-100",
            )}
          >
            {n}
          </button>
        ))}
      </div>
      <button type="button" className={clsx(SECONDARY_BUTTON, "!min-h-10 !py-2 !px-4 text-sm")} onClick={() => setHighlighted(new Set())}>
        Clear
      </button>
    </div>
  );
}
