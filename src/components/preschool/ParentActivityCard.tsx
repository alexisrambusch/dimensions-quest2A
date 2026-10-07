"use client";

import { Users } from "lucide-react";
import { PRIMARY_BUTTON } from "../ui";
import type { ParentActivityContent } from "@/lib/preschool/types";

/** An offline activity for a parent and child to do together away from the screen — the app only tracks that it happened. */
export function ParentActivityCard({ content, onDone }: { content: ParentActivityContent; onDone: () => void }) {
  return (
    <div className="flex flex-col items-center gap-4 w-full max-w-sm text-center">
      <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-100 text-amber-700 text-xs font-bold px-3 py-1">
        <Users size={14} /> Parent Activity
      </span>
      <p className="text-slate-700">{content.description}</p>
      <button type="button" className={PRIMARY_BUTTON} onClick={onDone}>
        We did it!
      </button>
    </div>
  );
}
