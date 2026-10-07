"use client";

import { useState } from "react";
import clsx from "clsx";
import { Sun, Cloud, CloudRain, CloudSnow } from "lucide-react";
import { PRIMARY_BUTTON } from "../ui";
import { MoodFace, type Mood } from "./MoodFace";
import type { MorningRoutineContent } from "@/lib/preschool/types";

const MOODS: Mood[] = ["happy", "okay", "sad", "silly"];
const WEATHER = [
  { key: "sun", Icon: Sun, label: "Sunny" },
  { key: "cloud", Icon: Cloud, label: "Cloudy" },
  { key: "rain", Icon: CloudRain, label: "Rainy" },
  { key: "snow", Icon: CloudSnow, label: "Snowy" },
] as const;

const TODAY = new Date();
const DAY_LABEL = TODAY.toLocaleDateString(undefined, { weekday: "long" });
const DATE_LABEL = TODAY.toLocaleDateString(undefined, { month: "long", day: "numeric" });

/** The day's opening ritual: how am I feeling, what's today, what's the weather like outside. */
export function MorningRoutineCard({ content, onDone }: { content: MorningRoutineContent; onDone: (mood: Mood, weather: string) => void }) {
  const [mood, setMood] = useState<Mood | null>(null);
  const [weather, setWeather] = useState<string | null>(null);

  return (
    <div className="flex flex-col items-center gap-5 w-full max-w-sm">
      <div className="text-center">
        <p className="text-2xl font-black text-blue-800">{DAY_LABEL}</p>
        <p className="text-slate-500">{DATE_LABEL}</p>
      </div>

      <div className="w-full">
        <p className="text-center font-semibold text-slate-700 mb-2">{content.prompt}</p>
        <div className="flex justify-center gap-3">
          {MOODS.map((m) => (
            <button
              key={m}
              type="button"
              onClick={() => setMood(m)}
              aria-label={m}
              className={clsx(
                "rounded-full p-1.5 border-2 touch-manipulation active:scale-90 transition-transform",
                mood === m ? "border-blue-500 bg-blue-50" : "border-transparent",
              )}
            >
              <MoodFace mood={m} />
            </button>
          ))}
        </div>
      </div>

      <div className="w-full">
        <p className="text-center font-semibold text-slate-700 mb-2">What&apos;s the weather like today?</p>
        <div className="flex justify-center gap-3">
          {WEATHER.map(({ key, Icon, label }) => (
            <button
              key={key}
              type="button"
              onClick={() => setWeather(key)}
              aria-label={label}
              className={clsx(
                "h-12 w-12 rounded-full flex items-center justify-center border-2 touch-manipulation active:scale-90 transition-transform",
                weather === key ? "border-blue-500 bg-blue-50 text-blue-600" : "border-slate-200 text-slate-400",
              )}
            >
              <Icon size={22} />
            </button>
          ))}
        </div>
      </div>

      <button type="button" disabled={!mood || !weather} className={PRIMARY_BUTTON} onClick={() => mood && weather && onDone(mood, weather)}>
        Let&apos;s start the day!
      </button>
    </div>
  );
}
