"use client";

interface Props {
  count: number;
}

/** Classic 5x2 ten-frame: filled counters in reading order (row 1 left-to-right,
 * then row 2), empty slots shown as dashed outlines. Drawn entirely with CSS —
 * no emoji glyphs — so it renders identically on every device, and the grid is
 * always a true 5-wide ten-frame rather than a wrapping box of icons. */
export function TenFrame({ count }: Props) {
  const cells = Array.from({ length: 10 }, (_, i) => i < count);
  return (
    <div className="inline-grid grid-cols-5 gap-2 rounded-2xl border-2 border-slate-300 bg-white p-3">
      {cells.map((filled, i) => (
        <div
          key={i}
          className={
            filled
              ? "h-9 w-9 rounded-full bg-red-500 shadow-sm sm:h-10 sm:w-10"
              : "h-9 w-9 rounded-full border-2 border-dashed border-slate-300 sm:h-10 sm:w-10"
          }
        />
      ))}
    </div>
  );
}
