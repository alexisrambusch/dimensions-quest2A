"use client";

import { useState } from "react";
import clsx from "clsx";
import { PRIMARY_BUTTON, SECONDARY_BUTTON } from "../../ui";
import { SpeakButton } from "../../SpeakButton";
import { playCorrect, playWrong } from "@/lib/sound";
import { icon } from "../../manipulatives/icons";
import type { StickerCountContent } from "@/lib/preschool/types";

// Scene backdrop keyed by the activity's sticker icon, so "the pond" reads as
// a pond and "the night sky" reads as a night sky instead of one generic box.
const SCENE_THEME: Record<string, string> = {
  frog: "from-teal-100 to-emerald-100",
  star: "from-indigo-900 to-slate-800",
  brick: "from-amber-100 to-stone-200",
  bone: "from-orange-100 to-amber-100",
  flower: "from-lime-100 to-green-100",
};

/** Tap stickers from the tray into the scene until the count feels right, then check — teaches counting by doing and self-correcting, not by naming a numeral. */
export function StickerCountGame({ content, onDone }: { content: StickerCountContent; onDone: () => void }) {
  const [placed, setPlaced] = useState<number>(0);
  const [checked, setChecked] = useState<"idle" | "correct" | "wrong">("idle");
  const promptText = `Put ${content.targetCount} in ${content.sceneLabel}.`;
  const stickerEmoji = icon(content.stickerIcon);
  const sceneGradient = SCENE_THEME[content.stickerIcon] ?? "from-blue-50 to-sky-100";

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

      <div
        className={clsx(
          "relative overflow-hidden w-full max-w-sm rounded-2xl border-2 border-slate-200 bg-gradient-to-b p-4 min-h-24 flex flex-wrap gap-2 items-center justify-center",
          sceneGradient,
        )}
      >
        <span className="absolute inset-0 flex items-center justify-center text-[6rem] leading-none opacity-20 pointer-events-none select-none">
          {stickerEmoji}
        </span>
        {Array.from({ length: placed }, (_, i) => (
          <button
            key={i}
            type="button"
            onClick={() => {
              setPlaced((p) => Math.max(0, p - 1));
              setChecked("idle");
            }}
            aria-label="Remove one"
            className="relative animate-pop-in h-14 w-14 rounded-2xl bg-white shadow-md border border-slate-100 flex items-center justify-center text-4xl active:scale-90 transition-transform touch-manipulation"
          >
            {stickerEmoji}
          </button>
        ))}
        {placed === 0 && <p className="relative text-sm font-semibold text-slate-500 bg-white/70 rounded-lg px-3 py-1">Tap a sticker below to add it here</p>}
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
            className="h-16 w-16 rounded-2xl bg-white border-2 border-amber-300 shadow-sm flex items-center justify-center text-4xl active:scale-90 transition-transform touch-manipulation"
          >
            {stickerEmoji}
          </button>
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
