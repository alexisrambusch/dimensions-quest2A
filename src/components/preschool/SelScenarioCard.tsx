"use client";

import { useState } from "react";
import clsx from "clsx";
import { PRIMARY_BUTTON } from "../ui";
import { SpeakButton } from "../SpeakButton";
import type { SelScenarioContent } from "@/lib/preschool/types";

/** "What should you do?" — a branching social-emotional scenario. Every choice gets a kind, explanatory response; this isn't graded pass/fail, it's a conversation starter. */
export function SelScenarioCard({ content, onDone }: { content: SelScenarioContent; onDone: (choiceText: string) => void }) {
  const [pickedIndex, setPickedIndex] = useState<number | null>(null);
  const picked = pickedIndex !== null ? content.choices[pickedIndex] : null;

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="flex items-start gap-2 max-w-md">
        <p className="text-lg font-semibold text-slate-800 text-center flex-1">{content.scenario}</p>
        <SpeakButton text={content.scenario} />
      </div>

      {!picked && (
        <div className="flex flex-col gap-3 w-full max-w-sm">
          {content.choices.map((choice, i) => (
            <button
              key={choice.text}
              type="button"
              onClick={() => setPickedIndex(i)}
              className="rounded-2xl border-2 border-slate-200 bg-white px-5 py-3 text-left font-semibold text-slate-700 hover:border-blue-300 active:scale-95 transition-transform touch-manipulation"
            >
              {choice.text}
            </button>
          ))}
        </div>
      )}

      {picked && (
        <div
          className={clsx(
            "animate-pop-in rounded-xl p-4 text-center max-w-sm",
            picked.isBest ? "bg-emerald-50 border border-emerald-200" : "bg-sky-50 border border-sky-200",
          )}
        >
          <p className={clsx("font-bold", picked.isBest ? "text-emerald-700" : "text-sky-800")}>{picked.isBest ? "Great choice!" : "Let's think about it:"}</p>
          <p className="text-slate-600 mt-1">{picked.feedback}</p>
          <button type="button" className={clsx(PRIMARY_BUTTON, "mt-3")} onClick={() => onDone(picked.text)}>
            Next
          </button>
        </div>
      )}
    </div>
  );
}
