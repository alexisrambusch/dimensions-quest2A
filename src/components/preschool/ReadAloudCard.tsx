"use client";

import { BookOpen } from "lucide-react";
import { PRIMARY_BUTTON } from "../ui";
import { SpeakButton } from "../SpeakButton";
import type { ReadAloudContent } from "@/lib/preschool/types";

/** A parent-led read-aloud guide: find the book at home or the library, then use these before/during/after questions — the app never reproduces the book's own text. */
export function ReadAloudCard({ content, onDone }: { content: ReadAloudContent; onDone: () => void }) {
  const fullText = [
    `Before reading: ${content.beforeQuestion}`,
    ...content.duringQuestions.map((q) => `While reading: ${q}`),
    `After reading: ${content.afterQuestion}`,
  ].join(" ");

  return (
    <div className="flex flex-col items-center gap-4 w-full max-w-sm">
      <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-100 text-amber-700 text-xs font-bold px-3 py-1">
        <BookOpen size={14} /> Parent-Led Activity
      </span>
      <div className="flex items-start gap-2 w-full">
        <div className="flex-1 text-center">
          <p className="font-black text-lg text-slate-800">{content.bookTitle}</p>
          <p className="text-sm text-slate-500">by {content.bookAuthor}</p>
        </div>
        <SpeakButton text={fullText} />
      </div>

      <div className="w-full rounded-xl bg-blue-50 border border-blue-100 p-4 flex flex-col gap-3 text-sm">
        <div>
          <p className="font-bold text-blue-800">Before reading</p>
          <p className="text-slate-600">{content.beforeQuestion}</p>
        </div>
        <div>
          <p className="font-bold text-blue-800">While reading</p>
          <ul className="list-disc list-inside text-slate-600">
            {content.duringQuestions.map((q) => (
              <li key={q}>{q}</li>
            ))}
          </ul>
        </div>
        <div>
          <p className="font-bold text-blue-800">After reading</p>
          <p className="text-slate-600">{content.afterQuestion}</p>
        </div>
      </div>

      <button type="button" className={PRIMARY_BUTTON} onClick={onDone}>
        We read it! 📖
      </button>
    </div>
  );
}
