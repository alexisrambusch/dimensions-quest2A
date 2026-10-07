"use client";

import { useMemo, useState } from "react";
import clsx from "clsx";
import { PRIMARY_BUTTON } from "../../ui";
import { playCorrect, playWrong } from "@/lib/sound";
import type { MatchPairsContent } from "@/lib/preschool/types";

function shuffle<T>(arr: T[]): T[] {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

/** Tap a left item, then its matching right item, to connect them. A wrong pair just flashes and deselects — try again, nothing lost. */
export function MatchPairsGame({ content, onDone }: { content: MatchPairsContent; onDone: () => void }) {
  const rightOrder = useMemo(() => shuffle(content.pairs.map((p, i) => ({ value: p.right, pairIndex: i }))), [content.pairs]);
  const [matched, setMatched] = useState<Set<number>>(new Set());
  const [selectedLeft, setSelectedLeft] = useState<number | null>(null);
  const [wrongRight, setWrongRight] = useState<number | null>(null);

  const allMatched = matched.size === content.pairs.length;

  function tapRight(entry: (typeof rightOrder)[number], rightIdx: number) {
    if (selectedLeft === null || matched.has(entry.pairIndex)) return;
    if (entry.pairIndex === selectedLeft) {
      playCorrect();
      setMatched((prev) => new Set(prev).add(entry.pairIndex));
      setSelectedLeft(null);
    } else {
      playWrong();
      setWrongRight(rightIdx);
      window.setTimeout(() => setWrongRight(null), 350);
      setSelectedLeft(null);
    }
  }

  return (
    <div className="flex flex-col items-center gap-5">
      <p className="text-sm font-semibold text-blue-500">
        Matched {matched.size} of {content.pairs.length}
      </p>

      <div className="flex gap-10">
        <div className="flex flex-col gap-3">
          {content.pairs.map((pair, i) => {
            const done = matched.has(i);
            return (
              <button
                key={i}
                type="button"
                disabled={done}
                onClick={() => setSelectedLeft(i)}
                className={clsx(
                  "h-14 w-20 rounded-xl text-xl font-black border-2 shadow-sm transition-transform touch-manipulation",
                  done && "bg-emerald-100 border-emerald-400 text-emerald-700 opacity-60",
                  !done && selectedLeft === i && "bg-blue-100 border-blue-500 text-blue-800 scale-105",
                  !done && selectedLeft !== i && "bg-white border-slate-200 text-slate-800 active:scale-95 hover:border-blue-300",
                )}
              >
                {pair.left}
              </button>
            );
          })}
        </div>

        <div className="flex flex-col gap-3">
          {rightOrder.map((entry, i) => {
            const done = matched.has(entry.pairIndex);
            return (
              <button
                key={i}
                type="button"
                disabled={done}
                onClick={() => tapRight(entry, i)}
                className={clsx(
                  "h-14 w-20 rounded-xl text-xl font-black border-2 shadow-sm transition-transform touch-manipulation",
                  done && "bg-emerald-100 border-emerald-400 text-emerald-700 opacity-60",
                  !done && wrongRight === i && "animate-shake-x bg-rose-50 border-rose-300",
                  !done && wrongRight !== i && "bg-white border-slate-200 text-slate-800 active:scale-95 hover:border-blue-300",
                )}
              >
                {entry.value}
              </button>
            );
          })}
        </div>
      </div>

      {allMatched && (
        <button type="button" className={clsx(PRIMARY_BUTTON, "animate-pop-in")} onClick={onDone}>
          All matched! 🎉
        </button>
      )}
    </div>
  );
}
