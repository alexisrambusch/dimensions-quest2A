"use client";

import clsx from "clsx";
import { ArrayGrid } from "../manipulatives/ArrayGrid";
import { EqualGroupsVisual } from "../manipulatives/EqualGroupsVisual";
import { BarModelMultiplication, BarModelDivision, BarModelPartWhole, BarModelCompare } from "../manipulatives/BarModel";
import { icon } from "../manipulatives/icons";

export interface LearnVisualSpec {
  view: string;
  data: Record<string, unknown>;
}

// Every component below is a static, read-only picture — no inputs, no
// handlers — matching the textbook's Learn-page diagrams. The interactive
// question-answering versions of these same ideas live in ../manipulatives.

function PlaceValueBlocksStatic({ hundreds, tens, ones }: { hundreds: number; tens: number; ones: number }) {
  const columns = [
    { label: "Hundreds", count: hundreds, blockClass: "bg-rose-400", blockSize: "h-10 w-10" },
    { label: "Tens", count: tens, blockClass: "bg-amber-400", blockSize: "h-10 w-2.5" },
    { label: "Ones", count: ones, blockClass: "bg-sky-400", blockSize: "h-2.5 w-2.5" },
  ];
  return (
    <div className="flex gap-5 justify-center flex-wrap">
      {columns.map((col) => (
        <div key={col.label} className="flex flex-col items-center gap-1.5">
          <span className="text-xs font-semibold text-slate-500">{col.label}</span>
          <div className="min-h-16 w-20 rounded-lg border-2 border-slate-200 bg-slate-50 flex flex-wrap gap-1 p-1.5 content-start justify-center">
            {Array.from({ length: col.count }, (_, i) => (
              <div key={i} className={clsx("rounded-sm", col.blockClass, col.blockSize)} />
            ))}
          </div>
          <span className="text-sm font-bold text-slate-700">{col.count}</span>
        </div>
      ))}
    </div>
  );
}

function StaticNumberLine({ min, max, step, value }: { min: number; max: number; step: number; value: number }) {
  const TRACK_WIDTH = 280;
  const ticks = Array.from({ length: Math.round((max - min) / step) + 1 }, (_, i) => min + i * step);
  const toPercent = (v: number) => ((v - min) / (max - min)) * 100;
  return (
    <div className="relative h-14" style={{ width: TRACK_WIDTH }}>
      <div className="absolute top-7 left-0 right-0 h-1.5 bg-slate-300 rounded-full" />
      {ticks.map((t) => (
        <div key={t} className="absolute top-5 flex flex-col items-center" style={{ left: `${toPercent(t)}%`, transform: "translateX(-50%)" }}>
          <div className="w-0.5 h-4 bg-slate-500" />
          <span className="text-[10px] text-slate-500 mt-0.5 whitespace-nowrap">{t}</span>
        </div>
      ))}
      <div
        className="absolute top-7 h-4 w-4 -mt-[7px] rounded-full bg-blue-600 border-2 border-white shadow-md"
        style={{ left: `${toPercent(value)}%`, transform: "translateX(-50%)" }}
      />
    </div>
  );
}

function StaticNumberBond({ whole, part1, part2 }: { whole: number; part1: number; part2: number }) {
  return (
    <div className="flex flex-col items-center gap-3">
      <div className="flex flex-col items-center">
        <div className="h-14 w-14 rounded-full bg-blue-600 text-white flex items-center justify-center text-xl font-black shadow-md">{whole}</div>
        <svg width="140" height="44" className="-mt-1">
          <line x1="70" y1="0" x2="18" y2="44" stroke="#60a5fa" strokeWidth="3" />
          <line x1="70" y1="0" x2="122" y2="44" stroke="#60a5fa" strokeWidth="3" />
        </svg>
      </div>
      <div className="flex gap-8 -mt-5">
        <div className="h-12 w-12 rounded-full bg-amber-400 text-white flex items-center justify-center text-lg font-black shadow-md">{part1}</div>
        <div className="h-12 w-12 rounded-full bg-sky-400 text-white flex items-center justify-center text-lg font-black shadow-md">{part2}</div>
      </div>
    </div>
  );
}

function StaticRuler({
  object,
  icon: iconKey,
  actualLength,
  maxLength,
  unitLabel,
}: {
  object: string;
  icon: string;
  actualLength: number;
  maxLength: number;
  unitLabel: string;
}) {
  const pxPerUnit = 14;
  const ticks = Array.from({ length: maxLength + 1 }, (_, i) => i);
  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative" style={{ width: maxLength * pxPerUnit + 16 }}>
        <div className="flex items-end gap-1 pl-1 pb-1" style={{ width: actualLength * pxPerUnit }}>
          <span className="text-3xl leading-none">{icon(iconKey)}</span>
          <div className="h-1 flex-1 bg-slate-400 rounded" />
        </div>
        <div className="relative h-8 bg-amber-50 border-2 border-amber-300 rounded-md">
          {ticks.map((t) => (
            <div key={t} className="absolute top-0 h-full flex flex-col items-center justify-end pb-0.5" style={{ left: t * pxPerUnit }}>
              <span className={`w-px ${t % 5 === 0 ? "h-4 bg-slate-600" : "h-2.5 bg-slate-400"}`} />
              {t % 5 === 0 && <span className="text-[9px] text-slate-500 -mt-0.5">{t}</span>}
            </div>
          ))}
          <div className="absolute top-0 h-full w-0.5 bg-blue-600" style={{ left: actualLength * pxPerUnit }} />
        </div>
      </div>
      <p className="text-xs text-slate-500">
        The {object} measures {actualLength} {unitLabel}.
      </p>
    </div>
  );
}

function StaticSortedNumbers({ values }: { values: number[] }) {
  return (
    <div className="flex items-center gap-2 flex-wrap justify-center">
      {values.map((v, i) => (
        <div key={i} className="flex items-center gap-2">
          <div className="min-w-12 h-12 rounded-xl bg-blue-100 border-2 border-blue-400 flex items-center justify-center text-lg font-bold text-blue-800">
            {v}
          </div>
          {i < values.length - 1 && <span className="text-slate-400">→</span>}
        </div>
      ))}
    </div>
  );
}

function StaticCompareNumbers({ a, b, symbol }: { a: number | string; b: number | string; symbol: string }) {
  return (
    <div className="flex items-center gap-3 text-2xl font-black text-slate-800">
      <span>{a}</span>
      <span className="text-blue-600">{symbol}</span>
      <span>{b}</span>
    </div>
  );
}

function StaticScaleBalance({
  leftLabel,
  leftIcon,
  rightLabel,
  rightIcon,
  heavier,
}: {
  leftLabel: string;
  leftIcon?: string;
  rightLabel: string;
  rightIcon?: string;
  heavier: "left" | "right" | "equal";
}) {
  const tilt = heavier === "left" ? "-rotate-6" : heavier === "right" ? "rotate-6" : "rotate-0";
  return (
    <div className="flex flex-col items-center gap-2">
      <div className={clsx("flex items-end gap-10 transition-transform", tilt)}>
        <div className="flex flex-col items-center gap-1">
          <div className="rounded-xl border-2 border-slate-300 bg-slate-50 px-3 py-2 text-2xl">{icon(leftIcon ?? "cube")}</div>
          <span className="text-xs font-semibold text-slate-600">{leftLabel}</span>
        </div>
        <div className="flex flex-col items-center gap-1">
          <div className="rounded-xl border-2 border-slate-300 bg-slate-50 px-3 py-2 text-2xl">{icon(rightIcon ?? "cube")}</div>
          <span className="text-xs font-semibold text-slate-600">{rightLabel}</span>
        </div>
      </div>
      <div className="h-1 w-32 bg-slate-400 rounded" />
      <div className="h-8 w-1.5 bg-slate-400 rounded" />
    </div>
  );
}

function StaticEquals({ left, right }: { left: number | string; right: number | string }) {
  return (
    <div className="flex items-center gap-3 text-xl font-black text-slate-800 text-center">
      <span>{left}</span>
      <span>=</span>
      <span className="text-emerald-600">{right}</span>
    </div>
  );
}

function StaticEquation({
  left,
  op,
  right,
  result,
}: {
  left: number | string;
  op: string;
  right: number | string;
  result: number | string;
}) {
  const opSymbol = op === "x" ? "×" : op === "/" ? "÷" : op;
  return (
    <div className="flex items-center gap-3 text-2xl font-black text-slate-800">
      <span>{left}</span>
      <span>{opSymbol}</span>
      <span>{right}</span>
      <span>=</span>
      <span className="text-emerald-600">{result}</span>
    </div>
  );
}

/** Renders one static "Learn It" picture by view key — the picture half of the textbook's walkthroughs. */
export function LearnVisual({ view, data }: LearnVisualSpec) {
  const d = data as Record<string, any>;
  switch (view) {
    case "placeValueBlocks":
      return <PlaceValueBlocksStatic hundreds={d.hundreds ?? 0} tens={d.tens ?? 0} ones={d.ones ?? 0} />;
    case "arrayGrid":
      return <ArrayGrid rows={d.rows} cols={d.cols} itemIcon={d.itemIcon} />;
    case "equalGroups":
      return <EqualGroupsVisual groups={d.groups} perGroup={d.perGroup} itemIcon={d.itemIcon} />;
    case "numberLine":
      return <StaticNumberLine min={d.min} max={d.max} step={d.step} value={d.value} />;
    case "numberBond":
      return <StaticNumberBond whole={d.whole} part1={d.part1} part2={d.part2} />;
    case "barModelMultiplication":
      return <BarModelMultiplication groups={d.groups} perGroup={d.perGroup} unit={d.unit} />;
    case "barModelDivision":
      return <BarModelDivision total={d.total} groups={d.groups} perGroup={d.perGroup} mode={d.mode} />;
    case "barModelPartWhole":
      return <BarModelPartWhole whole={d.whole} known={d.known} part1={d.part1} part2={d.part2} hiddenLabel={d.hiddenLabel ?? ""} />;
    case "barModelCompare":
      return <BarModelCompare larger={d.larger} smaller={d.smaller} />;
    case "rulerMeasure":
      return <StaticRuler object={d.object} icon={d.icon} actualLength={d.actualLength} maxLength={d.maxLength} unitLabel={d.unitLabel} />;
    case "sortedNumbers":
      return <StaticSortedNumbers values={d.values} />;
    case "compareNumbers":
      return <StaticCompareNumbers a={d.a} b={d.b} symbol={d.symbol ?? "<"} />;
    case "equals":
      return <StaticEquals left={d.left} right={d.right} />;
    case "scaleBalance":
      return (
        <StaticScaleBalance leftLabel={d.leftLabel} leftIcon={d.leftIcon} rightLabel={d.rightLabel} rightIcon={d.rightIcon} heavier={d.heavier ?? "equal"} />
      );
    case "equation":
      return <StaticEquation left={d.left} op={d.op} right={d.right} result={d.result} />;
    default:
      return null;
  }
}
