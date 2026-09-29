"use client";

import { icon } from "./icons";

interface Props {
  groups: number;
  perGroup: number;
  itemIcon?: string;
}

/** Concrete/pictorial "equal groups" model — the foundation of multiplication meaning. */
export function EqualGroupsVisual({ groups, perGroup, itemIcon }: Props) {
  const glyph = icon(itemIcon ?? "cube");
  return (
    <div className="flex flex-wrap gap-4 justify-center">
      {Array.from({ length: groups }, (_, g) => (
        <div key={g} className="rounded-2xl border-2 border-violet-200 bg-violet-50 p-3 flex flex-wrap gap-1 content-start max-w-40">
          {Array.from({ length: perGroup }, (_, i) => (
            <span key={i} className="text-2xl leading-none">
              {glyph}
            </span>
          ))}
        </div>
      ))}
    </div>
  );
}
