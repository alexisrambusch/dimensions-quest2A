import clsx from "clsx";

/** A non-interactive 1-100 grid for highlighting specific numbers (e.g. an arrow game's start/end). */
export function MiniHundredChart({ highlights }: { highlights: Record<number, string> }) {
  return (
    <div className="grid grid-cols-10 gap-1 select-none mx-auto w-fit">
      {Array.from({ length: 100 }, (_, i) => i + 1).map((n) => (
        <div
          key={n}
          className={clsx(
            "h-7 w-7 rounded-md text-[10px] font-bold flex items-center justify-center",
            highlights[n] ?? "bg-slate-50 text-slate-500",
          )}
        >
          {n}
        </div>
      ))}
    </div>
  );
}
