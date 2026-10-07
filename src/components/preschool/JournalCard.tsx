"use client";

import { useState } from "react";
import { DrawSurface } from "./DrawSurface";
import { PRIMARY_BUTTON } from "../ui";
import type { JournalContent } from "@/lib/preschool/types";

/** A free-drawing journal page — the prompt is read aloud/shown, the child draws, the drawing is saved as their response. */
export function JournalCard({ content, onDone }: { content: JournalContent; onDone: (drawingDataUrl: string) => void }) {
  const [drawing, setDrawing] = useState("");

  return (
    <div className="flex flex-col items-center gap-4">
      <DrawSurface
        showColorPicker
        width={300}
        height={220}
        guide={content.guideText ? <span className="text-5xl font-black text-slate-200 select-none">{content.guideText}</span> : undefined}
        onChange={setDrawing}
      />
      <button type="button" className={PRIMARY_BUTTON} onClick={() => onDone(drawing)}>
        I&apos;m done! 🎨
      </button>
    </div>
  );
}
