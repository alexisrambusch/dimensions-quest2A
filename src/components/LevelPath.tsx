import Link from "next/link";
import clsx from "clsx";

export interface PathNode {
  key: string;
  href?: string;
  title: string;
  subtitle?: string;
  icon: string;
  variant: "lesson" | "assessment";
  status: "LOCKED" | "AVAILABLE" | "IN_PROGRESS" | "COMPLETE";
  badge?: string;
}

const NODE_WIDTH = 340;
const ROW_HEIGHT = 96;
const SWING = 108; // how far each node swings left/right of center, in px

const NODE_STYLE: Record<PathNode["status"], string> = {
  LOCKED: "bg-slate-200 border-slate-300 text-slate-400",
  AVAILABLE: "bg-white border-blue-400 text-blue-600 shadow-md",
  IN_PROGRESS: "bg-amber-100 border-amber-400 text-amber-700 shadow-md",
  COMPLETE: "bg-emerald-100 border-emerald-500 text-emerald-700",
};

const ASSESSMENT_STYLE: Record<PathNode["status"], string> = {
  LOCKED: "bg-slate-200 border-slate-300 text-slate-400",
  AVAILABLE: "bg-amber-50 border-amber-400 text-amber-700 shadow-md",
  IN_PROGRESS: "bg-amber-50 border-amber-400 text-amber-700 shadow-md",
  COMPLETE: "bg-emerald-50 border-emerald-500 text-emerald-700",
};

/** A winding, level-by-level path (one node per lesson/test) instead of a flat list — the map should feel like a game world to walk through. */
export function LevelPath({ nodes }: { nodes: PathNode[] }) {
  if (nodes.length === 0) return null;

  const positions = nodes.map((_, i) => ({
    x: NODE_WIDTH / 2 + SWING * Math.sin(i * 1.05),
    y: i * ROW_HEIGHT + ROW_HEIGHT / 2,
  }));
  const height = positions[positions.length - 1].y + ROW_HEIGHT / 2;

  let d = `M ${positions[0].x} ${positions[0].y}`;
  for (let i = 1; i < positions.length; i++) {
    const prev = positions[i - 1];
    const cur = positions[i];
    const midY = (prev.y + cur.y) / 2;
    d += ` C ${prev.x} ${midY}, ${cur.x} ${midY}, ${cur.x} ${cur.y}`;
  }

  return (
    <div className="relative mx-auto" style={{ width: NODE_WIDTH, height }}>
      <svg className="absolute inset-0" width={NODE_WIDTH} height={height} viewBox={`0 0 ${NODE_WIDTH} ${height}`}>
        <path d={d} fill="none" stroke="#e2e8f0" strokeWidth={6} strokeLinecap="round" strokeDasharray="2 14" />
      </svg>
      {nodes.map((node, i) => {
        const pos = positions[i];
        const clickable = node.status !== "LOCKED";
        const isAssessment = node.variant === "assessment";
        const style = isAssessment ? ASSESSMENT_STYLE[node.status] : NODE_STYLE[node.status];
        const size = isAssessment ? 76 : 64;
        const statusGlyph =
          node.status === "LOCKED" ? "🔒" : node.status === "COMPLETE" ? "✅" : node.status === "IN_PROGRESS" ? null : null;

        const circle = (
          <div
            className={clsx(
              "relative flex items-center justify-center rounded-full border-4 text-2xl font-black transition-transform touch-manipulation",
              style,
              clickable && "active:scale-95 hover:scale-105",
              isAssessment && "rounded-2xl rotate-45",
            )}
            style={{ width: size, height: size }}
          >
            <span className={clsx(isAssessment && "-rotate-45")}>{node.status === "LOCKED" ? "🔒" : node.icon}</span>
            {statusGlyph === "✅" && (
              <span className={clsx("absolute -top-1.5 -right-1.5 text-base", isAssessment && "-rotate-45")}>✅</span>
            )}
            {node.status === "IN_PROGRESS" && (
              <span className="absolute -top-1 -right-1 h-3.5 w-3.5 rounded-full bg-amber-400 border-2 border-white animate-pulse" />
            )}
            {node.status === "AVAILABLE" && (
              <span
                className={clsx(
                  "absolute inset-0 rounded-full border-2 animate-ping opacity-40",
                  isAssessment ? "border-amber-400" : "border-blue-400",
                )}
              />
            )}
          </div>
        );

        return (
          <div
            key={node.key}
            className="absolute flex flex-col items-center gap-1"
            style={{ left: pos.x, top: pos.y, transform: "translate(-50%, -50%)", width: 128 }}
          >
            {node.href && clickable ? (
              <Link href={node.href} aria-label={node.title} className="flex flex-col items-center gap-1">
                {circle}
              </Link>
            ) : (
              circle
            )}
            <p
              className={clsx(
                "text-center text-[11px] font-bold leading-tight px-1",
                node.status === "LOCKED" ? "text-slate-400" : "text-slate-700",
              )}
            >
              {node.title}
            </p>
            {node.badge && <p className="text-[10px] font-bold text-emerald-600">{node.badge}</p>}
          </div>
        );
      })}
    </div>
  );
}
