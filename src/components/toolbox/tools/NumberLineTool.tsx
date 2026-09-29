"use client";

import { useState } from "react";
import clsx from "clsx";
import { NumberLine } from "../../manipulatives/NumberLine";
import { SECONDARY_BUTTON } from "../../ui";

const RANGES: Array<{ label: string; min: number; max: number; step: number }> = [
  { label: "0-10", min: 0, max: 10, step: 1 },
  { label: "0-20", min: 0, max: 20, step: 1 },
  { label: "0-100 by 10s", min: 0, max: 100, step: 10 },
  { label: "0-1000 by 100s", min: 0, max: 1000, step: 100 },
];

/** A free reference number line with a few common range presets — tap to place a mark. */
export function NumberLineTool() {
  const [rangeIdx, setRangeIdx] = useState(1);
  const [value, setValue] = useState<number | undefined>(undefined);
  const range = RANGES[rangeIdx];

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="flex gap-2 flex-wrap justify-center">
        {RANGES.map((r, i) => (
          <button
            key={r.label}
            type="button"
            onClick={() => {
              setRangeIdx(i);
              setValue(undefined);
            }}
            className={clsx(
              "rounded-full px-3 py-1.5 text-xs font-bold border-2 touch-manipulation",
              i === rangeIdx ? "bg-violet-600 border-violet-600 text-white" : "bg-white border-slate-200 text-slate-600 hover:border-violet-300",
            )}
          >
            {r.label}
          </button>
        ))}
      </div>
      <NumberLine min={range.min} max={range.max} step={range.step} value={value} onChange={setValue} />
      <button type="button" className={clsx(SECONDARY_BUTTON, "!min-h-10 !py-2 !px-4 text-sm")} onClick={() => setValue(undefined)}>
        Clear
      </button>
    </div>
  );
}
