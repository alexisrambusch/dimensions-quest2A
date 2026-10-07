"use client";

import { useEffect, useRef, useState } from "react";
import clsx from "clsx";

const COLORS = ["#1e293b", "#dc2626", "#2563eb", "#16a34a", "#f59e0b"];

interface Props {
  /** Rendered behind the canvas — a faint guide to trace, or nothing for free drawing. */
  guide?: React.ReactNode;
  /** Shows a small color picker above the canvas (used for free-drawing journal pages, not plain tracing). */
  showColorPicker?: boolean;
  width?: number;
  height?: number;
  onChange?: (dataUrl: string) => void;
}

/** A finger/mouse-drawable canvas over an optional guide picture — shared by guided tracing and free journal drawing. Purely a motor-practice surface: nothing here is graded. */
export function DrawSurface({ guide, showColorPicker, width = 320, height = 220, onChange }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const drawingRef = useRef(false);
  const lastPointRef = useRef<{ x: number; y: number } | null>(null);
  const [color, setColor] = useState(COLORS[0]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.lineWidth = 6;
  }, []);

  function pointFromEvent(e: React.PointerEvent<HTMLCanvasElement>) {
    const canvas = canvasRef.current!;
    const rect = canvas.getBoundingClientRect();
    return { x: e.clientX - rect.left, y: e.clientY - rect.top };
  }

  function handlePointerDown(e: React.PointerEvent<HTMLCanvasElement>) {
    drawingRef.current = true;
    lastPointRef.current = pointFromEvent(e);
  }

  function handlePointerMove(e: React.PointerEvent<HTMLCanvasElement>) {
    if (!drawingRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx || !lastPointRef.current) return;
    const point = pointFromEvent(e);
    ctx.strokeStyle = color;
    ctx.beginPath();
    ctx.moveTo(lastPointRef.current.x, lastPointRef.current.y);
    ctx.lineTo(point.x, point.y);
    ctx.stroke();
    lastPointRef.current = point;
  }

  function finishStroke() {
    if (!drawingRef.current) return;
    drawingRef.current = false;
    lastPointRef.current = null;
    onChange?.(canvasRef.current?.toDataURL() ?? "");
  }

  function clear() {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    onChange?.("");
  }

  return (
    <div className="flex flex-col items-center gap-3">
      {showColorPicker && (
        <div className="flex gap-2">
          {COLORS.map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => setColor(c)}
              aria-label={`Pick color ${c}`}
              className={clsx(
                "h-8 w-8 rounded-full border-2 touch-manipulation active:scale-90 transition-transform",
                color === c ? "border-slate-700 scale-110" : "border-white",
              )}
              style={{ backgroundColor: c }}
            />
          ))}
        </div>
      )}
      <div className="relative rounded-2xl border-2 border-slate-300 bg-white overflow-hidden touch-none" style={{ width, height }}>
        {guide && <div className="absolute inset-0 flex items-center justify-center pointer-events-none">{guide}</div>}
        <canvas
          ref={canvasRef}
          width={width}
          height={height}
          className="absolute inset-0 touch-none"
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={finishStroke}
          onPointerLeave={finishStroke}
        />
      </div>
      <button type="button" onClick={clear} className="text-sm font-semibold text-slate-400 hover:text-slate-600 underline">
        Clear
      </button>
    </div>
  );
}
