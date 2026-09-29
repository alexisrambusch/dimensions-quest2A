"use client";

const SEGMENT_COLORS = ["bg-blue-400", "bg-amber-400", "bg-sky-400", "bg-emerald-400", "bg-rose-400", "bg-orange-400"];

/** A single labeled bar made of one or more segments, used across all bar-model variants. */
function Bar({ segments }: { segments: Array<{ label: string; flex: number; color?: string }> }) {
  return (
    <div className="flex h-14 w-full max-w-md rounded-xl overflow-hidden border-2 border-slate-300 shadow-sm">
      {segments.map((s, i) => (
        <div
          key={i}
          style={{ flexGrow: s.flex }}
          className={`flex items-center justify-center text-white font-bold text-sm border-r-2 last:border-r-0 border-white/40 ${s.color ?? SEGMENT_COLORS[i % SEGMENT_COLORS.length]}`}
        >
          {s.label}
        </div>
      ))}
    </div>
  );
}

export function BarModelMultiplication({ groups, perGroup, unit }: { groups: number; perGroup: number; unit: string }) {
  const segments = Array.from({ length: Math.min(groups, 10) }, () => ({ label: String(perGroup), flex: 1 }));
  return (
    <div className="flex flex-col items-center gap-2">
      <Bar segments={segments} />
      <p className="text-sm text-slate-500">{groups} groups of {perGroup} {unit} — how many in all?</p>
    </div>
  );
}

export function BarModelDivision({
  total,
  groups,
  perGroup,
  mode,
}: {
  total: number;
  groups?: number;
  perGroup?: number;
  mode: "partitive" | "measurement";
}) {
  const knownGroups = mode === "partitive" ? groups! : Math.max(1, Math.min(10, Math.round(total / (perGroup ?? 1))));
  const segments = Array.from({ length: knownGroups }, () => ({ label: "?", flex: 1 }));
  return (
    <div className="flex flex-col items-center gap-2">
      <div className="text-sm font-semibold text-slate-500">Total: {total}</div>
      <Bar segments={segments} />
      <p className="text-sm text-slate-500">
        {mode === "partitive" ? `Shared equally among ${groups} groups` : `Each group holds ${perGroup}`}
      </p>
    </div>
  );
}

export function BarModelPartWhole({ whole, part1, part2, known, hiddenLabel }: { whole?: number; part1?: number; part2?: number; known?: number; hiddenLabel: string }) {
  if (whole !== undefined && known !== undefined) {
    return (
      <div className="flex flex-col items-center gap-2">
        <Bar segments={[{ label: String(whole), flex: 1 }]} />
        <Bar segments={[{ label: String(known), flex: known }, { label: "?", flex: Math.max(1, whole - known) }]} />
      </div>
    );
  }
  return (
    <div className="flex flex-col items-center gap-2">
      <Bar segments={[{ label: "?", flex: 1 }]} />
      <Bar segments={[{ label: String(part1), flex: part1 ?? 1 }, { label: String(part2), flex: part2 ?? 1 }]} />
      <p className="text-xs text-slate-400">{hiddenLabel}</p>
    </div>
  );
}

export function BarModelCompare({ larger, smaller }: { larger: number; smaller: number }) {
  return (
    <div className="flex flex-col items-center gap-2">
      <Bar segments={[{ label: String(larger), flex: larger }]} />
      <Bar segments={[{ label: String(smaller), flex: smaller }, { label: "?", flex: Math.max(1, larger - smaller) }]} />
    </div>
  );
}
