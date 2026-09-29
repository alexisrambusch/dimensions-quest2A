"use client";

import { useState } from "react";
import { SECONDARY_BUTTON } from "../ui";
import clsx from "clsx";

interface Props {
  target: number;
  onBuilt: (n: number | undefined) => void;
}

/** Drag/tap hundreds, tens, and ones blocks to build a target number (concrete stage). */
export function PlaceValueBuilder({ target, onBuilt }: Props) {
  const [hundreds, setHundreds] = useState(0);
  const [tens, setTens] = useState(0);
  const [ones, setOnes] = useState(0);
  const built = hundreds * 100 + tens * 10 + ones;

  // Report the built value continuously as it changes (right or wrong) — no
  // confirm step, since a button that only enables once the blocks happen to
  // match the target would itself reveal correctness before "Check my answer."
  function adjust(place: "h" | "t" | "o", delta: number) {
    const nextH = place === "h" ? Math.max(0, Math.min(9, hundreds + delta)) : hundreds;
    const nextT = place === "t" ? Math.max(0, Math.min(9, tens + delta)) : tens;
    const nextO = place === "o" ? Math.max(0, Math.min(9, ones + delta)) : ones;
    setHundreds(nextH);
    setTens(nextT);
    setOnes(nextO);
    const nextBuilt = nextH * 100 + nextT * 10 + nextO;
    onBuilt(nextBuilt > 0 ? nextBuilt : undefined);
  }

  const columns: Array<{ key: "h" | "t" | "o"; label: string; count: number; blockClass: string; blockSize: string }> = [
    { key: "h", label: "Hundreds", count: hundreds, blockClass: "bg-rose-400", blockSize: "h-12 w-12" },
    { key: "t", label: "Tens", count: tens, blockClass: "bg-amber-400", blockSize: "h-12 w-3" },
    { key: "o", label: "Ones", count: ones, blockClass: "bg-sky-400", blockSize: "h-3 w-3" },
  ];

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="flex gap-6 justify-center flex-wrap">
        {columns.map((col) => (
          <div key={col.key} className="flex flex-col items-center gap-2">
            <span className="text-sm font-semibold text-slate-500">{col.label}</span>
            <div className="min-h-32 w-24 rounded-xl border-2 border-dashed border-slate-200 bg-slate-50 flex flex-wrap gap-1 p-2 content-start justify-center">
              {Array.from({ length: col.count }, (_, i) => (
                <div key={i} className={clsx("rounded-sm", col.blockClass, col.blockSize)} />
              ))}
            </div>
            <div className="flex gap-2">
              <button type="button" className={clsx(SECONDARY_BUTTON, "!min-h-10 !min-w-10 !px-3 !py-1 text-base")} onClick={() => adjust(col.key, -1)} aria-label={`Remove a ${col.label.toLowerCase()} block`}>
                −
              </button>
              <button type="button" className={clsx(SECONDARY_BUTTON, "!min-h-10 !min-w-10 !px-3 !py-1 text-base")} onClick={() => adjust(col.key, 1)} aria-label={`Add a ${col.label.toLowerCase()} block`}>
                +
              </button>
            </div>
          </div>
        ))}
      </div>
      <div className="text-3xl font-black text-violet-700 tabular-nums">{built}</div>
      <p className="text-sm text-slate-500">Build {target}, then tap &quot;Check my answer&quot; below.</p>
    </div>
  );
}
