"use client";

export type Mood = "happy" | "okay" | "sad" | "silly";

const MOOD_COLOR: Record<Mood, string> = {
  happy: "#fbbf24",
  okay: "#60a5fa",
  sad: "#94a3b8",
  silly: "#f472b6",
};

/** A simple hand-drawn-style SVG face per mood — no emoji, so it renders identically everywhere. */
export function MoodFace({ mood, size = 48 }: { mood: Mood; size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" aria-label={mood}>
      <circle cx="24" cy="24" r="22" fill={MOOD_COLOR[mood]} />
      <circle cx="17" cy="20" r="2.5" fill="#1e293b" />
      <circle cx="31" cy="20" r="2.5" fill="#1e293b" />
      {mood === "happy" && <path d="M14 28 Q24 38 34 28" stroke="#1e293b" strokeWidth="3" fill="none" strokeLinecap="round" />}
      {mood === "okay" && <line x1="15" y1="31" x2="33" y2="31" stroke="#1e293b" strokeWidth="3" strokeLinecap="round" />}
      {mood === "sad" && <path d="M14 33 Q24 25 34 33" stroke="#1e293b" strokeWidth="3" fill="none" strokeLinecap="round" />}
      {mood === "silly" && <path d="M14 29 Q24 36 34 29 Q24 34 14 29" fill="#1e293b" />}
    </svg>
  );
}
