"use client";

import { useMemo, useState } from "react";
import clsx from "clsx";
import { PRIMARY_BUTTON, SECONDARY_BUTTON, CARD } from "../ui";
import { buildStaircase, type StaircaseOp, type StaircaseRange } from "@/lib/practice/staircase";

type CellStatus = "unchecked" | "correct" | "wrong";

const OP_SYMBOL: Record<StaircaseOp, string> = { add: "+", sub: "−" };

function key(col: number, row: number): string {
  return `${col}-${row}`;
}

export function FactStaircaseClient() {
  const [range, setRange] = useState<StaircaseRange>(10);
  const [op, setOp] = useState<StaircaseOp>("add");
  const [inputs, setInputs] = useState<Record<string, string>>({});
  const [statuses, setStatuses] = useState<Record<string, CellStatus>>({});
  const [checked, setChecked] = useState(false);

  const { cells, cols } = useMemo(() => buildStaircase(range, op), [range, op]);

  function switchTable(nextRange: StaircaseRange, nextOp: StaircaseOp) {
    setRange(nextRange);
    setOp(nextOp);
    setInputs({});
    setStatuses({});
    setChecked(false);
  }

  function setInput(k: string, v: string) {
    setInputs((prev) => ({ ...prev, [k]: v }));
    setStatuses((prev) => ({ ...prev, [k]: "unchecked" }));
  }

  function check() {
    const next: Record<string, CellStatus> = {};
    for (const cell of cells) {
      const k = key(cell.col, cell.row);
      next[k] = Number(inputs[k]) === cell.answer && inputs[k] !== undefined && inputs[k] !== "" ? "correct" : "wrong";
    }
    setStatuses(next);
    setChecked(true);
  }

  const correctCount = cells.filter((c) => statuses[key(c.col, c.row)] === "correct").length;

  return (
    <div className="flex flex-col gap-6">
      <div className={`${CARD} flex flex-col gap-3`}>
        <div className="flex flex-wrap gap-2">
          {([10, 20] as const).map((r) => (
            <button
              key={r}
              type="button"
              onClick={() => switchTable(r, op)}
              className={clsx(
                "rounded-full px-3 py-1.5 text-sm font-bold border-2 touch-manipulation",
                r === range ? "bg-violet-600 border-violet-600 text-white" : "bg-white border-slate-200 text-slate-600 hover:border-violet-300",
              )}
            >
              Within {r}
            </button>
          ))}
          <span className="w-px bg-slate-200 mx-1" />
          {([
            { key: "add", label: "Addition" },
            { key: "sub", label: "Subtraction" },
          ] as const).map((o) => (
            <button
              key={o.key}
              type="button"
              onClick={() => switchTable(range, o.key)}
              className={clsx(
                "rounded-full px-3 py-1.5 text-sm font-bold border-2 touch-manipulation",
                o.key === op ? "bg-violet-600 border-violet-600 text-white" : "bg-white border-slate-200 text-slate-600 hover:border-violet-300",
              )}
            >
              {o.label}
            </button>
          ))}
        </div>
      </div>

      <div className={`${CARD} flex flex-col gap-4`}>
        <p className="text-sm text-slate-500">Fill in every fact, then check your answers. Look for patterns down each column!</p>

        <div className="overflow-x-auto pb-2">
          <div
            className="grid gap-1.5"
            style={{ gridTemplateColumns: `repeat(${cols}, minmax(60px, 1fr))`, width: cols * 64 }}
          >
            {cells.map((cell) => {
              const k = key(cell.col, cell.row);
              const status = statuses[k] ?? "unchecked";
              return (
                <div
                  key={k}
                  style={{ gridColumn: cell.col, gridRow: cell.row }}
                  className={clsx(
                    "flex flex-col items-center gap-1 rounded-lg border-2 p-1.5",
                    status === "correct" && "bg-emerald-50 border-emerald-400",
                    status === "wrong" && "bg-rose-50 border-rose-400",
                    status === "unchecked" && "bg-slate-50 border-slate-200",
                  )}
                >
                  <span className="text-[11px] font-semibold text-slate-500 whitespace-nowrap">
                    {cell.a} {OP_SYMBOL[op]} {cell.b}
                  </span>
                  <input
                    type="number"
                    inputMode="numeric"
                    value={inputs[k] ?? ""}
                    onChange={(e) => setInput(k, e.target.value)}
                    className="w-10 h-7 text-center text-sm font-bold rounded border border-slate-300 focus:border-violet-500 outline-none"
                  />
                </div>
              );
            })}
          </div>
        </div>

        <div className="flex items-center justify-center gap-3">
          <button type="button" className={clsx(PRIMARY_BUTTON, "!min-h-11 !py-2 !px-6")} onClick={check}>
            Check my answers
          </button>
          <button type="button" className={clsx(SECONDARY_BUTTON, "!min-h-11 !py-2 !px-4 text-sm")} onClick={() => switchTable(range, op)}>
            Clear
          </button>
        </div>

        {checked && (
          <p className={clsx("text-center font-bold", correctCount === cells.length ? "text-emerald-600" : "text-slate-500")}>
            {correctCount === cells.length ? `Perfect! All ${cells.length} facts correct! 🎉` : `${correctCount} of ${cells.length} correct so far.`}
          </p>
        )}
      </div>
    </div>
  );
}
