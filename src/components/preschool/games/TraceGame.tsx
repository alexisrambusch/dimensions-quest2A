"use client";

import { useState } from "react";
import clsx from "clsx";
import { DrawSurface } from "../DrawSurface";
import { PRIMARY_BUTTON } from "../../ui";
import type { TraceContent } from "@/lib/preschool/types";

/** Finger-trace a letter, number, or name — ungraded motor practice, not a correctness check. */
export function TraceGame({ content, studentName, onDone }: { content: TraceContent; studentName: string; onDone: () => void }) {
  const [hasDrawn, setHasDrawn] = useState(false);
  const guideText = content.target === "name" ? studentName : content.target;

  return (
    <div className="flex flex-col items-center gap-4">
      <DrawSurface guide={<span className="text-6xl font-black text-slate-300 select-none">{guideText}</span>} onChange={(data) => setHasDrawn(!!data)} />
      <button type="button" className={clsx(PRIMARY_BUTTON, !hasDrawn && "opacity-70")} onClick={onDone}>
        {hasDrawn ? "I traced it! ✏️" : "Skip for now"}
      </button>
    </div>
  );
}
