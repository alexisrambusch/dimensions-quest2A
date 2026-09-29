"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import clsx from "clsx";
import { Wrench, X } from "lucide-react";
import { HundredChartTool } from "./tools/HundredChartTool";
import { PlaceValueCardsTool } from "./tools/PlaceValueCardsTool";
import { BaseTenBlocksTool } from "./tools/BaseTenBlocksTool";
import { TenFrameTool } from "./tools/TenFrameTool";
import { NumberLineTool } from "./tools/NumberLineTool";
import { RulerTool } from "./tools/RulerTool";
import { GridPaperTool } from "./tools/GridPaperTool";
import { MultiplicationChartTool } from "./tools/MultiplicationChartTool";

const TOOLS = [
  { key: "hundred", label: "Hundred Chart", icon: "🔢", Component: HundredChartTool },
  { key: "placeValue", label: "Place Value Cards", icon: "🗂️", Component: PlaceValueCardsTool },
  { key: "blocks", label: "Base-Ten Blocks", icon: "🧱", Component: BaseTenBlocksTool },
  { key: "tenFrame", label: "Ten-Frames", icon: "🟦", Component: TenFrameTool },
  { key: "numberLine", label: "Number Line", icon: "📏", Component: NumberLineTool },
  { key: "ruler", label: "Ruler", icon: "📐", Component: RulerTool },
  { key: "grid", label: "Grid Paper", icon: "🧮", Component: GridPaperTool },
  { key: "multiplication", label: "Times Tables", icon: "✖️", Component: MultiplicationChartTool },
] as const;

// The toolbox is only useful while a student is actually answering questions.
const SHOWN_PREFIXES = ["/lesson/", "/assessment/", "/practice/"];

export function Toolbox() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [activeKey, setActiveKey] = useState<(typeof TOOLS)[number]["key"]>(TOOLS[0].key);

  if (!SHOWN_PREFIXES.some((p) => pathname.startsWith(p))) return null;

  const active = TOOLS.find((t) => t.key === activeKey) ?? TOOLS[0];
  const Active = active.Component;

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label="Open math toolbox"
        className="fixed bottom-4 left-4 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-b from-orange-400 to-amber-500 text-white shadow-lg shadow-amber-300/50 active:scale-90 transition-transform touch-manipulation"
      >
        <Wrench size={24} strokeWidth={2.25} />
      </button>

      {open && (
        <div className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center bg-black/40 p-0 sm:p-4">
          <div className="flex flex-col w-full sm:max-w-lg h-[88vh] sm:h-[80vh] bg-white rounded-t-3xl sm:rounded-3xl shadow-xl overflow-hidden animate-bounce-in">
            <div className="flex items-center justify-between px-4 pt-4 pb-2 shrink-0">
              <h2 className="text-lg font-black text-slate-800">Toolbox</h2>
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Close toolbox"
                className="h-9 w-9 flex items-center justify-center rounded-full bg-violet-50 text-violet-500 active:scale-90 transition-transform touch-manipulation"
              >
                <X size={18} strokeWidth={2.5} />
              </button>
            </div>

            <div className="flex gap-1.5 overflow-x-auto px-4 pb-3 shrink-0">
              {TOOLS.map((t) => (
                <button
                  key={t.key}
                  type="button"
                  onClick={() => setActiveKey(t.key)}
                  className={clsx(
                    "flex flex-col items-center gap-0.5 shrink-0 rounded-xl px-3 py-2 text-[10px] font-bold touch-manipulation transition-colors",
                    t.key === activeKey ? "bg-violet-100 text-violet-700" : "bg-slate-50 text-slate-500 hover:bg-slate-100",
                  )}
                >
                  <span className="text-xl leading-none">{t.icon}</span>
                  <span className="whitespace-nowrap">{t.label}</span>
                </button>
              ))}
            </div>

            <div className="flex-1 overflow-y-auto px-4 pb-6 pt-2 border-t border-slate-100">
              <Active />
            </div>
          </div>
        </div>
      )}
    </>
  );
}
