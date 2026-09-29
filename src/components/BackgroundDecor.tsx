import { Star, Sparkles, Heart, Cloud, Sun } from "lucide-react";

const SHAPES = [
  { Icon: Star, top: "8%", left: "6%", size: 28, color: "text-blue-300", delay: "0s" },
  { Icon: Cloud, top: "16%", left: "88%", size: 40, color: "text-sky-200", delay: "0.6s" },
  { Icon: Sparkles, top: "38%", left: "4%", size: 24, color: "text-amber-300", delay: "1.2s" },
  { Icon: Heart, top: "62%", left: "92%", size: 26, color: "text-teal-300", delay: "0.3s" },
  { Icon: Sun, top: "82%", left: "10%", size: 32, color: "text-orange-300", delay: "0.9s" },
  { Icon: Star, top: "90%", left: "80%", size: 22, color: "text-cyan-300", delay: "1.5s" },
] as const;

/** A subtle, fixed decorative layer behind every page — soft color blobs, a faint dot
 * texture, and a handful of scattered kid-friendly shapes, all low-opacity and
 * pointer-events-none so it never competes with the actual content. */
export function BackgroundDecor() {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none" aria-hidden="true">
      <div className="absolute -top-24 -left-24 h-80 w-80 rounded-full bg-blue-300 opacity-25 blur-3xl animate-float-y" />
      <div className="absolute top-1/3 -right-24 h-96 w-96 rounded-full bg-amber-200 opacity-30 blur-3xl animate-float-y" style={{ animationDelay: "1s" }} />
      <div className="absolute -bottom-24 left-1/4 h-72 w-72 rounded-full bg-cyan-200 opacity-25 blur-3xl animate-float-y" style={{ animationDelay: "2s" }} />

      <div className="absolute inset-0 bg-dot-texture text-blue-900 opacity-[0.04]" />

      {SHAPES.map(({ Icon, top, left, size, color, delay }, i) => (
        <Icon
          key={i}
          className={`absolute animate-float-y opacity-20 ${color}`}
          style={{ top, left, animationDelay: delay }}
          width={size}
          height={size}
          strokeWidth={1.5}
        />
      ))}
    </div>
  );
}
