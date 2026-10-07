"use client";

import { useMemo, useState } from "react";
import clsx from "clsx";
import { PRIMARY_BUTTON } from "../../ui";
import { SpeakButton } from "../../SpeakButton";
import { playCorrect, playWrong } from "@/lib/sound";
import type { HuntContent } from "@/lib/preschool/types";

/** Tap every matching tile. Wrong taps just wobble and nothing is lost — this is a search game, not a quiz. */
export function HuntGame({ content, onDone }: { content: HuntContent; onDone: () => void }) {
  const items = useMemo(() => content.items.map((item, i) => ({ ...item, id: i })), [content.items]);
  const [foundIds, setFoundIds] = useState<Set<number>>(new Set());
  const [wobbleId, setWobbleId] = useState<number | null>(null);

  const totalMatches = items.filter((i) => i.isMatch).length;
  const allFound = foundIds.size === totalMatches;

  function tap(item: (typeof items)[number]) {
    if (foundIds.has(item.id)) return;
    if (item.isMatch) {
      playCorrect();
      setFoundIds((prev) => new Set(prev).add(item.id));
    } else {
      playWrong();
      setWobbleId(item.id);
      window.setTimeout(() => setWobbleId((id) => (id === item.id ? null : id)), 350);
    }
  }

  return (
    <div className="flex flex-col items-center gap-5">
      <div className="flex items-start gap-2 max-w-sm">
        <p className="text-lg font-semibold text-slate-800 text-center flex-1">{content.promptText}</p>
        <SpeakButton text={content.promptText} />
      </div>

      <p className="text-sm font-semibold text-blue-500">
        Found {foundIds.size} of {totalMatches}
      </p>

      <div className="flex flex-wrap gap-3 justify-center max-w-sm">
        {items.map((item) => {
          const found = foundIds.has(item.id);
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => tap(item)}
              disabled={found}
              className={clsx(
                "h-16 w-16 rounded-2xl text-3xl font-black shadow-md transition-transform touch-manipulation border-2",
                found && "bg-emerald-100 border-emerald-400 text-emerald-700 scale-95",
                !found && wobbleId === item.id && "animate-shake-x bg-rose-50 border-rose-300",
                !found && wobbleId !== item.id && "bg-white border-slate-200 text-slate-800 active:scale-90 hover:border-blue-300",
              )}
            >
              {item.label}
            </button>
          );
        })}
      </div>

      {allFound && (
        <button type="button" className={clsx(PRIMARY_BUTTON, "animate-pop-in")} onClick={onDone}>
          Found them all! 🎉
        </button>
      )}
    </div>
  );
}
