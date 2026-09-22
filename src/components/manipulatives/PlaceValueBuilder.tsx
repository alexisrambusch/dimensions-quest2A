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

  const targetH = Math.floor(target / 100);
  const targetT = Math.floor((target % 100) / 10);
  const targetO = target % 10;
  const complete = hundreds === targetH && tens === targetT && ones === targetO;

  function adjust(place: "h" | "t" | "o", delta: number) {
    if (place === "h") setHundreds((v) => Math.max(0, Math.min(9, v + delta)));
    if (place === "t") setTens((v) => Math.max(0, Math.min(9, v + delta)));
    if (place === "o") setOnes((v) => Math.max(0, Math.min(9, v + delta)));
    onBuilt(undefined); // any change resets the "confirmed" answer until they hit Confirm
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
      <button
        type="button"
        disabled={!complete}
        onClick={() => onBuilt(built)}
        className="rounded-2xl bg-violet-600 disabled:bg-slate-200 disabled:text-slate-400 text-white font-bold px-6 py-3 shadow-md"
      >
        {complete ? "That's my number!" : `Build ${target} to continue`}
      </button>
    </div>
  );
}
