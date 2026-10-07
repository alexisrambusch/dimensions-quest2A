"use client";

import { useState } from "react";
import clsx from "clsx";
import { PRIMARY_BUTTON } from "../../ui";
import { SpeakButton } from "../../SpeakButton";
import { playCorrect, playWrong } from "@/lib/sound";
import type { DragSortContent } from "@/lib/preschool/types";

/** One item at a time — tap the bucket it belongs in. A wrong tap just wobbles; the item waits for the right answer, so there's nothing to get "wrong" permanently. */
export function DragSortGame({ content, onDone }: { content: DragSortContent; onDone: () => void }) {
  const [index, setIndex] = useState(0);
  const [wobble, setWobble] = useState<"A" | "B" | null>(null);
  const current = content.items[index];
  const done = index >= content.items.length;

  function tapBucket(bucket: "A" | "B") {
    if (!current) return;
    const correct = bucket === "A" ? current.belongsToA : !current.belongsToA;
    if (correct) {
      playCorrect();
      setIndex((i) => i + 1);
      setWobble(null);
    } else {
      playWrong();
      setWobble(bucket);
      window.setTimeout(() => setWobble(null), 350);
    }
  }

  if (done) {
    return (
      <div className="flex flex-col items-center gap-4">
        <p className="text-lg font-bold text-emerald-600">All sorted! 🎉</p>
        <button type="button" className={PRIMARY_BUTTON} onClick={onDone}>
          Next
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-6">
      <p className="text-sm font-semibold text-blue-500">
        {index + 1} of {content.items.length}
      </p>

      <div className="flex items-center gap-2">
        <div className="h-20 w-20 rounded-2xl bg-white border-2 border-slate-200 shadow-md flex items-center justify-center text-2xl font-black text-slate-800">
          {current.label}
        </div>
        <SpeakButton text={current.label} />
      </div>

      <div className="flex gap-4">
        <button
          type="button"
          onClick={() => tapBucket("A")}
          className={clsx(
            "min-h-20 min-w-28 rounded-2xl text-lg font-bold shadow-md active:scale-90 transition-transform touch-manipulation border-2 px-4",
            wobble === "A" ? "animate-shake-x bg-rose-50 border-rose-300" : "bg-blue-50 border-blue-200 text-blue-700 hover:border-blue-400",
          )}
        >
          {content.bucketALabel}
        </button>
        <button
          type="button"
          onClick={() => tapBucket("B")}
          className={clsx(
            "min-h-20 min-w-28 rounded-2xl text-lg font-bold shadow-md active:scale-90 transition-transform touch-manipulation border-2 px-4",
            wobble === "B" ? "animate-shake-x bg-rose-50 border-rose-300" : "bg-amber-50 border-amber-200 text-amber-700 hover:border-amber-400",
          )}
        >
          {content.bucketBLabel}
        </button>
      </div>
    </div>
  );
}
