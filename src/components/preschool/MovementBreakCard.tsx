"use client";

import { useState } from "react";
import { PersonStanding } from "lucide-react";
import { PRIMARY_BUTTON, SECONDARY_BUTTON } from "../ui";
import type { MovementBreakContent } from "@/lib/preschool/types";

/** An offline movement activity with a simple countdown timer — "take a movement break" per the curriculum's gross-motor requirement. */
export function MovementBreakCard({ content, onDone }: { content: MovementBreakContent; onDone: () => void }) {
  const [secondsLeft, setSecondsLeft] = useState(content.timerSeconds);
  const [running, setRunning] = useState(false);

  function start() {
    setRunning(true);
    const start = Date.now();
    const tick = () => {
      const remaining = Math.max(0, content.timerSeconds - Math.floor((Date.now() - start) / 1000));
      setSecondsLeft(remaining);
      if (remaining > 0) requestAnimationFrame(tick);
      else setRunning(false);
    };
    requestAnimationFrame(tick);
  }

  return (
    <div className="flex flex-col items-center gap-4 w-full max-w-sm text-center">
      <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-100 text-emerald-700 text-xs font-bold px-3 py-1">
        <PersonStanding size={14} /> Movement Break
      </span>
      <p className="text-slate-700">{content.description}</p>
      <div className="text-4xl font-black text-blue-600 tabular-nums">{secondsLeft}s</div>
      <button type="button" className={SECONDARY_BUTTON} onClick={start} disabled={running}>
        {running ? "Go!" : "Start timer"}
      </button>
      <button type="button" className={PRIMARY_BUTTON} onClick={onDone}>
        Done!
      </button>
    </div>
  );
}
