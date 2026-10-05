"use client";

import { Volume2 } from "lucide-react";
import clsx from "clsx";
import { useSpeech } from "@/lib/useSpeech";

interface Props {
  text: string;
  className?: string;
}

/** Reads the given text aloud on tap, for students who can't yet read fluently. Hides itself if the browser has no speech support. */
export function SpeakButton({ text, className }: Props) {
  const { speak, stop, speaking, supported } = useSpeech();

  if (!supported) return null;

  return (
    <button
      type="button"
      onClick={() => (speaking ? stop() : speak(text))}
      aria-label={speaking ? "Stop reading aloud" : "Read aloud"}
      className={clsx(
        "shrink-0 flex items-center justify-center h-10 w-10 rounded-full border-2 touch-manipulation transition-colors active:scale-90",
        speaking ? "bg-blue-600 border-blue-600 text-white animate-pulse" : "bg-blue-50 border-blue-200 text-blue-500 hover:bg-blue-100",
        className,
      )}
    >
      <Volume2 size={18} strokeWidth={2.25} />
    </button>
  );
}
