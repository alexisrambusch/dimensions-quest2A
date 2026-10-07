"use client";

import { useState } from "react";
import clsx from "clsx";
import { DrawSurface } from "./DrawSurface";
import { PRIMARY_BUTTON } from "../ui";
import type { TraceContent } from "@/lib/preschool/types";

function LinesGuide() {
  return (
    <svg width={280} height={160} viewBox="0 0 280 160" className="opacity-25">
      <line x1="20" y1="30" x2="260" y2="30" stroke="#64748b" strokeWidth="3" strokeDasharray="2 10" strokeLinecap="round" />
      <line x1="60" y1="60" x2="60" y2="150" stroke="#64748b" strokeWidth="3" strokeDasharray="2 10" strokeLinecap="round" />
      <path d="M110 150 L140 70 L170 150 L200 70 L230 150" stroke="#64748b" strokeWidth="3" fill="none" strokeDasharray="2 10" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/** Finger-trace a letter, a name, or a few pre-writing lines — ungraded motor practice, not a correctness check. */
export function TraceCard({ content, studentName, onDone }: { content: TraceContent; studentName: string; onDone: () => void }) {
  const [hasDrawn, setHasDrawn] = useState(false);
  const guideText = content.target === "name" ? studentName : content.target === "lines" ? null : content.target;

  return (
    <div className="flex flex-col items-center gap-4">
      {guideText ? (
        <DrawSurface
          guide={<span className="text-6xl font-black text-slate-300 select-none">{guideText}</span>}
          onChange={(data) => setHasDrawn(!!data)}
        />
      ) : (
        <DrawSurface guide={<LinesGuide />} width={280} height={160} onChange={(data) => setHasDrawn(!!data)} />
      )}
      <button type="button" className={clsx(PRIMARY_BUTTON, !hasDrawn && "opacity-70")} onClick={onDone}>
        {hasDrawn ? "I traced it! ✏️" : "Skip for now"}
      </button>
    </div>
  );
}
