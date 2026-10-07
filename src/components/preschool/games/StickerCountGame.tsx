"use client";

import { useState } from "react";
import clsx from "clsx";
import { PRIMARY_BUTTON, SECONDARY_BUTTON } from "../../ui";
import { SpeakButton } from "../../SpeakButton";
import { playCorrect, playWrong } from "@/lib/sound";
import type { StickerCountContent } from "@/lib/preschool/types";

/** Tap stickers from the tray into the scene until the count feels right, then check — teaches counting by doing and self-correcting, not by naming a numeral. */
export function StickerCountGame({ content, onDone }: { content: StickerCountContent; onDone: () => void }) {
  const [placed, setPlaced] = useState<number>(0);
  const [checked, setChecked] = useState<"idle" | "correct" | "wrong">("idle");
  const promptText = `Put ${content.targetCount} in ${content.sceneLabel}.`;

  function check() {
    if (placed === content.targetCount) {
      playCorrect();
      setChecked("correct");
    } else {
      playWrong();
      setChecked("wrong");
    }
  }

  return (
    <div className="flex flex-col items-center gap-5">
      <div className="flex items-start gap-2 max-w-sm">
        <p className="text-lg font-semibold text-slate-800 text-center flex-1">{promptText}</p>
        <SpeakButton text={promptText} />
      </div>

      <div className="w-full max-w-sm rounded-2xl border-2 border-slate-200 bg-blue-50 p-4 min-h-20 flex flex-wrap gap-2 items-center justify-center">
        {Array.from({ length: placed }, (_, i) => (
          <button
            key={i}
            type="button"
            onClick={() => {
              setPlaced((p) => Math.max(0, p - 1));
              setChecked("idle");
            }}
            aria-label="Remove one"
            className="h-10 w-10 rounded-full bg-amber-400 shadow-sm active:scale-90 transition-transform touch-manipulation"
          />
        ))}
        {placed === 0 && <p className="text-sm text-slate-400">Tap a sticker below to add it here</p>}
      </div>

      <div className="flex flex-wrap gap-2 justify-center">
        {Array.from({ length: Math.max(0, content.trayCount - placed) }, (_, i) => (
          <button
            key={i}
            type="button"
            onClick={() => {
              setPlaced((p) => p + 1);
              setChecked("idle");
            }}
            aria-label="Add one"
            className="h-12 w-12 rounded-full bg-amber-300 border-2 border-amber-400 shadow-sm active:scale-90 transition-transform touch-manipulation"
          />
        ))}
      </div>

      <p className="text-sm font-semibold text-slate-500">
        You placed <span className="text-blue-600">{placed}</span>
      </p>

      {checked === "wrong" && <p className="text-sm font-semibold text-rose-500">Not quite — count them together and try again!</p>}

      <div className="flex gap-3">
        <button type="button" className={clsx(SECONDARY_BUTTON, "!min-h-11 !py-2 !px-5 text-sm")} onClick={check} disabled={checked === "correct"}>
          Check
        </button>
        {checked === "correct" && (
          <button type="button" className={clsx(PRIMARY_BUTTON, "animate-pop-in")} onClick={onDone}>
            That&apos;s right! 🎉
          </button>
        )}
      </div>
    </div>
  );
}
