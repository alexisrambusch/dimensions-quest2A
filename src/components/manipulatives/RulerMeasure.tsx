"use client";

import { useRef, useState } from "react";
import { icon } from "./icons";

interface Props {
  object: string;
  icon: string;
  actualLength: number;
  maxLength: number;
  unit: "cm" | "in";
  unitLabel: string;
  onChange: (v: { estimate: number; measured: number } | undefined) => void;
}

export function RulerMeasure({ object, icon: iconKey, actualLength, maxLength, unit, unitLabel, onChange }: Props) {
  const [estimate, setEstimate] = useState<number | "">("");
  const [measured, setMeasured] = useState<number | null>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const ticks = Array.from({ length: maxLength + 1 }, (_, i) => i);
  // Inches get wider spacing and a tick at every unit (fewer, bigger marks);
  // centimeters get tighter spacing with a labeled mark every 5th tick.
  const pxPerUnit = unit === "in" ? 22 : 12;
  const majorEvery = unit === "in" ? 1 : 5;

  function commit(nextMeasured: number) {
    setMeasured(nextMeasured);
    if (estimate !== "") onChange({ estimate: Number(estimate), measured: nextMeasured });
  }

  // The tick buttons are precise but narrow targets, especially at inch
  // spacing — without this, tapping between them (very easy on a
  // touchscreen) silently does nothing. This makes the whole track tappable.
  function commitFromClientX(clientX: number) {
    const rect = trackRef.current!.getBoundingClientRect();
    const ratio = Math.min(1, Math.max(0, (clientX - rect.left) / rect.width));
    commit(Math.round(ratio * maxLength));
  }

  function commitEstimate(v: number) {
    setEstimate(v);
    if (measured !== null) onChange({ estimate: v, measured });
  }

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="flex items-center gap-2 text-sm font-semibold text-slate-600">
        <span>Estimate first:</span>
        <input
          type="number"
          inputMode="numeric"
          value={estimate}
          onChange={(e) => commitEstimate(Number(e.target.value))}
          placeholder={unit}
          className="w-20 text-center text-lg font-bold rounded-lg border-2 border-slate-300 focus:border-violet-500 outline-none py-1"
        />
        <span>{unitLabel}</span>
      </div>

      <div className="relative" style={{ width: maxLength * pxPerUnit + 20 }}>
        <div className="flex items-end gap-1 pl-1 pb-1" style={{ width: actualLength * pxPerUnit }}>
          <span className="text-4xl leading-none">{icon(iconKey)}</span>
          <div className="h-1 flex-1 bg-slate-400 rounded" />
        </div>
        <div
          ref={trackRef}
          onClick={(e) => commitFromClientX(e.clientX)}
          onTouchStart={(e) => commitFromClientX(e.touches[0].clientX)}
          className="relative h-10 bg-amber-50 border-2 border-amber-300 rounded-md cursor-pointer touch-none"
        >
          {ticks.map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => commit(t)}
              className="absolute top-0 h-full flex flex-col items-center justify-end pb-0.5"
              style={{ left: t * pxPerUnit }}
              aria-label={`Mark ${t} ${unitLabel}`}
            >
              <span className={`w-px ${t % majorEvery === 0 ? "h-5 bg-slate-600" : "h-3 bg-slate-400"}`} />
              {t % majorEvery === 0 && <span className="text-[10px] text-slate-500 -mt-0.5">{t}</span>}
            </button>
          ))}
          {measured !== null && (
            <div className="absolute top-0 h-full w-0.5 bg-violet-600" style={{ left: measured * pxPerUnit }} />
          )}
        </div>
      </div>
      <p className="text-sm text-slate-500">Tap the ruler where the {object} ends.</p>
      {measured !== null && (
        <p className="text-sm font-semibold text-violet-700">
          You measured {measured} {unitLabel}.
        </p>
      )}
    </div>
  );
}
