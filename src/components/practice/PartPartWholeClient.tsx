"use client";

import { useState } from "react";
import clsx from "clsx";
import { PRIMARY_BUTTON, SECONDARY_BUTTON, CARD } from "../ui";
import { PartPartWholeDiagram } from "./PartPartWholeDiagram";

type RowStatus = "unchecked" | "correct" | "wrong";

export function PartPartWholeClient() {
  const [whole, setWhole] = useState(8);
  const [inputs, setInputs] = useState<Record<number, string>>({});
  const [statuses, setStatuses] = useState<Record<number, RowStatus>>({});
  const [checked, setChecked] = useState(false);

  const combos = Array.from({ length: whole + 1 }, (_, partA) => partA);

  function pickWhole(n: number) {
    setWhole(n);
    setInputs({});
    setStatuses({});
    setChecked(false);
  }

  function setInput(partA: number, v: string) {
    setInputs((prev) => ({ ...prev, [partA]: v }));
    setStatuses((prev) => ({ ...prev, [partA]: "unchecked" }));
  }

  function check() {
    const next: Record<number, RowStatus> = {};
    for (const partA of combos) {
      const expected = whole - partA;
      next[partA] = Number(inputs[partA]) === expected && inputs[partA] !== undefined && inputs[partA] !== "" ? "correct" : "wrong";
    }
    setStatuses(next);
    setChecked(true);
  }

  const correctCount = combos.filter((partA) => statuses[partA] === "correct").length;
  const allCorrect = checked && correctCount === combos.length;

  return (
    <div className="flex flex-col gap-6">
      <div className={`${CARD} flex flex-col gap-3`}>
        <p className="text-sm font-semibold text-slate-600">Choose a whole number:</p>
        <div className="flex flex-wrap gap-2">
          {Array.from({ length: 10 }, (_, i) => i + 1).map((n) => (
            <button
              key={n}
              type="button"
              onClick={() => pickWhole(n)}
              className={clsx(
                "h-11 w-11 rounded-full font-black border-2 touch-manipulation",
                n === whole ? "bg-blue-600 border-blue-600 text-white" : "bg-white border-slate-200 text-slate-600 hover:border-blue-300",
              )}
            >
              {n}
            </button>
          ))}
        </div>
      </div>

      <div className={`${CARD} flex flex-col gap-4`}>
        <p className="text-sm text-slate-500">
          Find every pair of parts that makes <span className="font-bold text-blue-700">{whole}</span>. Fill in the missing part for each pair.
        </p>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-y-4 gap-x-2 place-items-center">
          {combos.map((partA) => (
            <PartPartWholeDiagram
              key={partA}
              whole={whole}
              partA={partA}
              value={inputs[partA] ?? ""}
              onChange={(v) => setInput(partA, v)}
              status={statuses[partA] ?? "unchecked"}
            />
          ))}
        </div>

        <div className="flex items-center justify-center gap-3">
          <button type="button" className={clsx(PRIMARY_BUTTON, "!min-h-11 !py-2 !px-6")} onClick={check}>
            Check my answers
          </button>
          <button type="button" className={clsx(SECONDARY_BUTTON, "!min-h-11 !py-2 !px-4 text-sm")} onClick={() => pickWhole(whole)}>
            Clear
          </button>
        </div>

        {checked && (
          <p className={clsx("text-center font-bold", allCorrect ? "text-emerald-600" : "text-slate-500")}>
            {allCorrect ? `You found all ${combos.length} ways to make ${whole}! 🎉` : `${correctCount} of ${combos.length} correct — fix the red ones and check again.`}
          </p>
        )}
      </div>
    </div>
  );
}
