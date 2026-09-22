"use client";

import { icon } from "./icons";

interface Props {
  rows: number;
  cols: number;
  itemIcon?: string;
}

/** True rows-by-columns array — distinct from the equal-groups model: same
 * total, but the multiplication is read directly off the grid dimensions. */
export function ArrayGrid({ rows, cols, itemIcon }: Props) {
  const glyph = icon(itemIcon ?? "cube");
  return (
    <div className="flex flex-col items-center gap-2">
      <div className="flex items-center gap-3">
        <div className="flex flex-col gap-1">
          {Array.from({ length: rows }, (_, r) => (
            <div key={r} className="flex gap-1">
              {Array.from({ length: cols }, (_, c) => (
                <span
                  key={c}
                  className="h-8 w-8 flex items-center justify-center rounded-md bg-violet-50 border border-violet-200 text-lg leading-none"
                >
                  {glyph}
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>
      <p className="text-sm text-slate-500">
        {rows} rows × {cols} columns
      </p>
    </div>
  );
}
