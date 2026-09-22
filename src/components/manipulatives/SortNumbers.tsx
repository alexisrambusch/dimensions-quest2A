"use client";

import { useState } from "react";
import { CHOICE_BUTTON_IDLE, SECONDARY_BUTTON } from "../ui";
import clsx from "clsx";

interface Props {
  values: number[];
  onChange: (ordered: number[] | undefined) => void;
}

/** Tap numbers in order from least to greatest — simpler and more reliable on touch than drag-and-drop. */
export function SortNumbers({ values, onChange }: Props) {
  const [placed, setPlaced] = useState<number[]>([]);
  const remaining = values.filter((v) => !placed.includes(v));

  function place(v: number) {
    const next = [...placed, v];
    setPlaced(next);
    onChange(next.length === values.length ? next : undefined);
  }

  function reset() {
    setPlaced([]);
    onChange(undefined);
  }

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="flex gap-2 min-h-14">
        {placed.map((v, i) => (
          <div key={i} className="min-w-14 h-14 rounded-xl bg-violet-100 border-2 border-violet-400 flex items-center justify-center text-xl font-bold text-violet-800">
            {v}
          </div>
        ))}
        {placed.length < values.length &&
          Array.from({ length: values.length - placed.length }, (_, i) => (
            <div key={`empty-${i}`} className="min-w-14 h-14 rounded-xl border-2 border-dashed border-slate-300" />
          ))}
      </div>
      <div className="flex gap-3 flex-wrap justify-center">
        {remaining.map((v) => (
          <button key={v} type="button" onClick={() => place(v)} className={clsx(CHOICE_BUTTON_IDLE)}>
            {v}
          </button>
        ))}
      </div>
      {placed.length > 0 && (
        <button type="button" onClick={reset} className={clsx(SECONDARY_BUTTON, "!min-h-10 !py-1 text-sm")}>
          Start over
        </button>
      )}
      <p className="text-sm text-slate-500">Tap numbers from least to greatest.</p>
    </div>
  );
}
