const COLORS = ["#60a5fa", "#fbbf24", "#fb7185", "#34d399", "#22d3ee", "#4ade80"];

/** A short-lived scatter of falling confetti dots for big celebration moments (level-up, a legendary pull). Purely decorative — mount it once per celebration and let it play out. */
export function ConfettiBurst({ count = 18 }: { count?: number }) {
  const pieces = Array.from({ length: count }, (_, i) => ({
    left: `${(i * 97) % 100}%`,
    delay: `${(i % 6) * 0.08}s`,
    color: COLORS[i % COLORS.length],
    size: 6 + (i % 3) * 2,
  }));

  return (
    <div className="pointer-events-none absolute inset-x-0 -top-4 h-0 overflow-visible" aria-hidden="true">
      {pieces.map((p, i) => (
        <span
          key={i}
          className="absolute top-0 rounded-sm animate-[confetti-fall_1.1s_ease-in_forwards]"
          style={{ left: p.left, animationDelay: p.delay, backgroundColor: p.color, width: p.size, height: p.size }}
        />
      ))}
    </div>
  );
}
