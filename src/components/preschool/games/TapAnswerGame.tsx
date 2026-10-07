"use client";

import { useState } from "react";
import clsx from "clsx";
import { PRIMARY_BUTTON, CHOICE_BUTTON_IDLE, CHOICE_BUTTON_SELECTED, CHOICE_BUTTON_CORRECT, CHOICE_BUTTON_WRONG } from "../../ui";
import { SpeakButton } from "../../SpeakButton";
import { playCorrect, playWrong } from "@/lib/sound";
import type { TapAnswerContent } from "@/lib/preschool/types";

/** A lightweight confirmation check — the mastery engine only ever schedules this after a skill already has some practice behind it, never on first exposure. */
export function TapAnswerGame({ content, onDone }: { content: TapAnswerContent; onDone: (correct: boolean) => void }) {
  const [picked, setPicked] = useState<number | null>(null);
  const [showHint, setShowHint] = useState(false);

  function pick(i: number) {
    if (picked !== null) return;
    setPicked(i);
    if (i === content.correctIndex) playCorrect();
    else playWrong();
  }

  const answered = picked !== null;
  const correct = picked === content.correctIndex;

  return (
    <div className="flex flex-col items-center gap-5">
      <div className="flex items-start gap-2 max-w-sm">
        <p className="text-lg font-semibold text-slate-800 text-center flex-1">{content.promptText}</p>
        <SpeakButton text={content.promptText} />
      </div>

      <div className="flex gap-3 flex-wrap justify-center">
        {content.choices.map((choice, i) => {
          let cls = CHOICE_BUTTON_IDLE;
          if (answered) {
            if (i === content.correctIndex) cls = CHOICE_BUTTON_CORRECT;
            else if (i === picked) cls = CHOICE_BUTTON_WRONG;
          } else if (picked === i) {
            cls = CHOICE_BUTTON_SELECTED;
          }
          return (
            <button key={choice} type="button" disabled={answered} onClick={() => pick(i)} className={cls}>
              {choice}
            </button>
          );
        })}
      </div>

      {answered && !correct && content.hint && !showHint && (
        <button type="button" className="text-sm font-semibold text-blue-500 underline" onClick={() => setShowHint(true)}>
          💡 Get a hint
        </button>
      )}
      {showHint && content.hint && <p className="text-sm text-slate-500 text-center max-w-sm">{content.hint}</p>}

      {answered && (
        <button type="button" className={clsx(PRIMARY_BUTTON, "animate-pop-in")} onClick={() => onDone(correct)}>
          {correct ? "Great job! ⭐" : "Next"}
        </button>
      )}
    </div>
  );
}
