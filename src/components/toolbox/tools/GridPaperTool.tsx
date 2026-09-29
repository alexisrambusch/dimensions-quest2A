"use client";

import { useState } from "react";
import clsx from "clsx";
import { SECONDARY_BUTTON } from "../../ui";

const COLS = 12;
const ROWS = 10;

/** Blank grid paper — tap cells to shade them in, for tallying, drawing arrays, or scratch work. */
export function GridPaperTool() {
  const [filled, setFilled] = useState<Set<number>>(new Set());

  function toggle(i: number) {
    setFilled((prev) => {
      const next = new Set(prev);
      if (next.has(i)) next.delete(i);
      else next.add(i);
      return next;
    });
  }

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="grid gap-0" style={{ gridTemplateColumns: `repeat(${COLS}, minmax(0, 1fr))` }}>
        {Array.from({ length: COLS * ROWS }, (_, i) => (
          <button
            key={i}
            type="button"
            onClick={() => toggle(i)}
            className={clsx(
              "h-6 w-6 border border-slate-200 touch-manipulation transition-colors",
              filled.has(i) ? "bg-blue-500" : "bg-white hover:bg-slate-50",
            )}
            aria-label={`Grid cell ${i + 1}`}
          />
        ))}
      </div>
      <div className="flex items-center gap-3">
        <span className="text-sm font-semibold text-slate-500">{filled.size} shaded</span>
        <button type="button" className={clsx(SECONDARY_BUTTON, "!min-h-10 !py-2 !px-4 text-sm")} onClick={() => setFilled(new Set())}>
          Clear
        </button>
      </div>
    </div>
  );
}
