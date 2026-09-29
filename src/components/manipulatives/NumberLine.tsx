"use client";

import { useRef, useState } from "react";

interface Props {
  min: number;
  max: number;
  step: number;
  value: number | undefined;
  onChange: (n: number) => void;
}

const TRACK_WIDTH = 320;

export function NumberLine({ min, max, step, value, onChange }: Props) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [hover, setHover] = useState<number | null>(null);
  const ticks = Array.from({ length: Math.round((max - min) / step) + 1 }, (_, i) => min + i * step);

  function valueFromClientX(clientX: number): number {
    const rect = trackRef.current!.getBoundingClientRect();
    const ratio = Math.min(1, Math.max(0, (clientX - rect.left) / rect.width));
    return Math.round(min + ratio * (max - min));
  }

  function toPercent(v: number): number {
    return ((v - min) / (max - min)) * 100;
  }

  return (
    <div className="flex flex-col items-center gap-3">
      <div
        ref={trackRef}
        className="relative h-16 cursor-pointer select-none touch-none"
        style={{ width: TRACK_WIDTH }}
        onClick={(e) => onChange(valueFromClientX(e.clientX))}
        onMouseMove={(e) => setHover(valueFromClientX(e.clientX))}
        onMouseLeave={() => setHover(null)}
        onTouchStart={(e) => onChange(valueFromClientX(e.touches[0].clientX))}
      >
        <div className="absolute top-8 left-0 right-0 h-1.5 bg-slate-300 rounded-full" />
        {ticks.map((t) => (
          <div key={t} className="absolute top-6 flex flex-col items-center" style={{ left: `${toPercent(t)}%`, transform: "translateX(-50%)" }}>
            <div className="w-0.5 h-5 bg-slate-500" />
            <span className="text-xs text-slate-500 mt-0.5 whitespace-nowrap">{t}</span>
          </div>
        ))}
        {hover !== null && value === undefined && (
          <div
            className="absolute top-8 h-4 w-4 -mt-[7px] rounded-full bg-blue-200 border-2 border-blue-400"
            style={{ left: `${toPercent(hover)}%`, transform: "translateX(-50%)" }}
          />
        )}
        {value !== undefined && (
          <div
            className="absolute top-8 h-5 w-5 -mt-[8.5px] rounded-full bg-blue-600 border-2 border-white shadow-md"
            style={{ left: `${toPercent(value)}%`, transform: "translateX(-50%)" }}
          />
        )}
      </div>
      <p className="text-sm text-slate-500">
        {value !== undefined ? `Marked at ${value}. Tap again to move it.` : "Tap the line to place your mark."}
      </p>
    </div>
  );
}
