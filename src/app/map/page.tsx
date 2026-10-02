import Link from "next/link";
import clsx from "clsx";
import { redirect } from "next/navigation";
import { getActiveStudent, switchProfileAction } from "@/lib/actions/students";
import { getMissionMap } from "@/lib/actions/curriculum";
import { getChapterAssessments } from "@/lib/actions/assessment";
import { icon } from "@/components/manipulatives/icons";
import { CARD } from "@/components/ui";
import { levelForXp } from "@/lib/gamification/level";
import { LevelPath, type PathNode } from "@/components/LevelPath";

export const dynamic = "force-dynamic";

const WORLD_ICONS: Record<string, string> = {
  castle: "🏰",
  valley: "🌾",
  mountain: "⛰️",
  island: "🏝️",
  factory: "⚖️",
  forest: "🌲",
  realm: "🔷",
  meadow: "🌼",
  treehouse: "🌳",
  garden: "🌻",
  pond: "🐸",
  carnival: "🎠",
};

const WORLD_BACKDROP: Record<string, string> = {
  castle: "bg-gradient-to-br from-indigo-100 via-indigo-50 to-white",
  valley: "bg-gradient-to-br from-lime-100 via-lime-50 to-white",
  mountain: "bg-gradient-to-br from-slate-200 via-slate-50 to-white",
  island: "bg-gradient-to-br from-cyan-100 via-cyan-50 to-white",
  factory: "bg-gradient-to-br from-orange-100 via-orange-50 to-white",
  forest: "bg-gradient-to-br from-emerald-100 via-emerald-50 to-white",
  realm: "bg-gradient-to-br from-blue-100 via-blue-50 to-white",
  meadow: "bg-gradient-to-br from-yellow-100 via-yellow-50 to-white",
  treehouse: "bg-gradient-to-br from-green-100 via-green-50 to-white",
  garden: "bg-gradient-to-br from-amber-100 via-amber-50 to-white",
  pond: "bg-gradient-to-br from-sky-100 via-sky-50 to-white",
  carnival: "bg-gradient-to-br from-pink-100 via-pink-50 to-white",
};

const WORLD_RING: Record<string, string> = {
  castle: "ring-indigo-200",
  valley: "ring-lime-200",
  mountain: "ring-slate-300",
  island: "ring-cyan-200",
  factory: "ring-orange-200",
  forest: "ring-emerald-200",
  realm: "ring-blue-200",
  meadow: "ring-yellow-200",
  treehouse: "ring-green-200",
  garden: "ring-amber-200",
  pond: "ring-sky-200",
  carnival: "ring-pink-200",
};

/** A short glyph per lesson chip, standing in for "what kind of level is this" at a glance. */
function lessonIcon(order: number): string {
  const glyphs = ["🌟", "🎯", "🧩", "🔭", "🧭", "🎨", "🔬", "🎲", "🧠", "🚀", "🏆", "✨"];
  return glyphs[(order - 1) % glyphs.length];
}

export default async function MissionMapPage() {
  const student = await getActiveStudent();
  if (!student) redirect("/profiles");

  const chapters = await getMissionMap(student.id);
  const assessmentsByChapter = await Promise.all(
    chapters.map(async (c) => ({ code: c.code, assessments: await getChapterAssessments(c.code, student.id) })),
  );
  const assessmentsMap = new Map(assessmentsByChapter.map((a) => [a.code, a.assessments]));

  return (
    <main className="flex-1 p-6 max-w-4xl mx-auto w-full flex flex-col gap-6">
      <header className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="animate-float-y flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-blue-200 to-cyan-100 text-4xl shadow-sm ring-2 ring-white">
            {icon(student.avatarKey)}
          </span>
          <div>
            <h1 className="text-2xl font-black text-blue-800">{student.name}&apos;s Quest Map</h1>
            <p className="text-sm text-blue-500 font-semibold">
              Level {levelForXp(student.totalXp)} · {student.totalXp} XP · {student.coins} 🪙 · {student.streakDays} day streak
            </p>
          </div>
        </div>
        <div className="flex gap-3">
          <Link href="/practice" className="text-sm font-semibold text-slate-500 hover:text-blue-700 self-center">
            Practice &amp; Games
          </Link>
          <Link href="/trophies" className="text-sm font-semibold text-slate-500 hover:text-blue-700 self-center">
            Trophy Case
          </Link>
          <Link href="/shop" className="text-sm font-semibold text-slate-500 hover:text-blue-700 self-center">
            Shop
          </Link>
          <Link href="/parent" className="text-sm font-semibold text-slate-500 hover:text-blue-700 self-center">
            Parent Dashboard
          </Link>
          <form action={switchProfileAction}>
            <button type="submit" className="text-sm font-semibold text-slate-500 hover:text-blue-700">
              Switch profile
            </button>
          </form>
        </div>
      </header>

      <div className="flex flex-col gap-8">
        {chapters.map((chapter) => {
          const assessments = assessmentsMap.get(chapter.code) ?? [];
          const nodes: PathNode[] = [
            ...chapter.lessons.map((lesson) => ({
              key: lesson.code,
              href: `/lesson/${lesson.code}`,
              title: lesson.title,
              icon: lessonIcon(lesson.order),
              variant: "lesson" as const,
              status: lesson.status,
            })),
            ...assessments.map((a) => ({
              key: a.code,
              href: `/assessment/${a.code}`,
              title: a.title,
              icon: "📝",
              variant: "assessment" as const,
              status: chapter.status === "LOCKED" ? ("LOCKED" as const) : a.passed ? ("COMPLETE" as const) : ("AVAILABLE" as const),
              badge: a.bestScore ? `best ${a.bestScore.correct}/${a.bestScore.total}` : undefined,
            })),
          ];
          const needsPerfectTest =
            chapter.status === "IN_PROGRESS" && chapter.lessons.every((l) => l.status === "COMPLETE") && !assessments.some((a) => a.passed);

          return (
            <section
              key={chapter.code}
              className={clsx(
                CARD,
                WORLD_BACKDROP[chapter.worldTheme],
                "ring-1",
                WORLD_RING[chapter.worldTheme] ?? "ring-slate-100",
                chapter.status === "LOCKED" && "opacity-50",
                "flex flex-col gap-4 overflow-hidden",
              )}
            >
              <div className="flex items-center gap-3">
                <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/70 text-3xl shadow-sm">
                  {WORLD_ICONS[chapter.worldTheme] ?? "🔷"}
                </span>
                <div>
                  <h2 className="text-lg font-black text-slate-800">{chapter.worldName}</h2>
                  <p className="text-xs text-slate-500">{chapter.title}</p>
                </div>
                {chapter.status === "COMPLETE" && (
                  <span className="animate-wiggle ml-auto text-emerald-500 font-bold text-sm">Complete! 🎉</span>
                )}
              </div>

              <LevelPath nodes={nodes} />

              {needsPerfectTest && (
                <p className="text-xs text-amber-600 font-semibold text-center pt-1 border-t border-slate-200">
                  Score 100% on a test above to unlock the next world.
                </p>
              )}
            </section>
          );
        })}
      </div>
    </main>
  );
}
