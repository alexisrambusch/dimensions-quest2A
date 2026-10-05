"use client";

import { useState } from "react";
import clsx from "clsx";
import { SECONDARY_BUTTON } from "../../ui";

const W = 160;
const H = 130;
const WHOLE_POS = { x: W / 2, y: 26 };
const LEFT_POS = { x: 34, y: 104 };
const RIGHT_POS = { x: W - 34, y: 104 };

/** A free-form Whole/Part/Part circle mat the student fills in themselves — no grading, just the model to reason with. */
export function PartPartWholeTool() {
  const [whole, setWhole] = useState("10");
  const [partA, setPartA] = useState("");
  const [partB, setPartB] = useState("");

  const bothFilled = partA !== "" && partB !== "";
  const sum = Number(partA) + Number(partB);
  const matches = bothFilled && Number(whole) === sum;

  function clear() {
    setPartA("");
    setPartB("");
  }

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="relative mx-auto" style={{ width: W, height: H }}>
        <svg className="absolute inset-0" width={W} height={H}>
          <line x1={WHOLE_POS.x} y1={WHOLE_POS.y + 24} x2={LEFT_POS.x} y2={LEFT_POS.y - 20} stroke="#cbd5e1" strokeWidth={3} />
          <line x1={WHOLE_POS.x} y1={WHOLE_POS.y + 24} x2={RIGHT_POS.x} y2={RIGHT_POS.y - 20} stroke="#cbd5e1" strokeWidth={3} />
        </svg>
        <input
          type="number"
          inputMode="numeric"
          value={whole}
          onChange={(e) => setWhole(e.target.value)}
          aria-label="Whole"
          className="absolute rounded-full border-2 border-blue-400 bg-blue-100 text-blue-800 text-center font-black text-lg outline-none focus:border-blue-600"
          style={{ left: WHOLE_POS.x - 26, top: WHOLE_POS.y - 26, width: 52, height: 52 }}
        />
        <input
          type="number"
          inputMode="numeric"
          value={partA}
          onChange={(e) => setPartA(e.target.value)}
          aria-label="Part"
          placeholder="?"
          className="absolute rounded-full border-2 border-slate-300 bg-white text-slate-700 text-center font-black outline-none focus:border-blue-500"
          style={{ left: LEFT_POS.x - 22, top: LEFT_POS.y - 22, width: 44, height: 44 }}
        />
        <input
          type="number"
          inputMode="numeric"
          value={partB}
          onChange={(e) => setPartB(e.target.value)}
          aria-label="Part"
          placeholder="?"
          className="absolute rounded-full border-2 border-slate-300 bg-white text-slate-700 text-center font-black outline-none focus:border-blue-500"
          style={{ left: RIGHT_POS.x - 22, top: RIGHT_POS.y - 22, width: 44, height: 44 }}
        />
      </div>

      {bothFilled && (
        <p className={clsx("text-sm font-semibold", matches ? "text-emerald-600" : "text-slate-500")}>
          {partA} + {partB} = {sum}
          {matches ? " ✓" : ""}
        </p>
      )}

      <button type="button" className={clsx(SECONDARY_BUTTON, "!min-h-10 !py-2 !px-4 text-sm")} onClick={clear}>
        Clear
      </button>
    </div>
  );
}
