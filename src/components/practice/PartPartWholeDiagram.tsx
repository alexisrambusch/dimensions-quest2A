"use client";

const W = 132;
const H = 112;
const WHOLE_POS = { x: W / 2, y: 22 };
const LEFT_POS = { x: 28, y: 88 };
const RIGHT_POS = { x: W - 28, y: 88 };

interface Props {
  whole: number;
  partA: number;
  /** The blank side the student fills in. */
  value: string;
  onChange: (v: string) => void;
  status: "unchecked" | "correct" | "wrong";
}

/** The classic Singapore Math circle model: a Whole circle connected to two Part circles below it. */
export function PartPartWholeDiagram({ whole, partA, value, onChange, status }: Props) {
  const ringClass =
    status === "correct"
      ? "bg-emerald-100 border-emerald-500 text-emerald-800"
      : status === "wrong"
        ? "bg-rose-100 border-rose-500 text-rose-800"
        : "bg-white border-slate-300 text-slate-700";

  return (
    <div className="relative mx-auto" style={{ width: W, height: H }}>
      <svg className="absolute inset-0" width={W} height={H}>
        <line x1={WHOLE_POS.x} y1={WHOLE_POS.y + 20} x2={LEFT_POS.x} y2={LEFT_POS.y - 18} stroke="#cbd5e1" strokeWidth={3} />
        <line x1={WHOLE_POS.x} y1={WHOLE_POS.y + 20} x2={RIGHT_POS.x} y2={RIGHT_POS.y - 18} stroke="#cbd5e1" strokeWidth={3} />
      </svg>
      <div
        className="absolute rounded-full bg-blue-100 border-2 border-blue-400 flex items-center justify-center font-black text-blue-800 text-lg"
        style={{ left: WHOLE_POS.x - 22, top: WHOLE_POS.y - 22, width: 44, height: 44 }}
      >
        {whole}
      </div>
      <div
        className="absolute rounded-full bg-white border-2 border-slate-300 flex items-center justify-center font-black text-slate-700"
        style={{ left: LEFT_POS.x - 19, top: LEFT_POS.y - 19, width: 38, height: 38 }}
      >
        {partA}
      </div>
      <input
        type="number"
        inputMode="numeric"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        aria-label="Missing part"
        className={`absolute rounded-full border-2 text-center font-black outline-none focus:border-blue-500 ${ringClass}`}
        style={{ left: RIGHT_POS.x - 19, top: RIGHT_POS.y - 19, width: 38, height: 38 }}
      />
    </div>
  );
}
