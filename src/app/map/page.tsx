import Link from "next/link";
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
};

const WORLD_BACKDROP: Record<string, string> = {
  castle: "bg-gradient-to-b from-indigo-50 to-white",
  valley: "bg-gradient-to-b from-lime-50 to-white",
  mountain: "bg-gradient-to-b from-slate-100 to-white",
  island: "bg-gradient-to-b from-cyan-50 to-white",
  factory: "bg-gradient-to-b from-orange-50 to-white",
  forest: "bg-gradient-to-b from-emerald-50 to-white",
  realm: "bg-gradient-to-b from-violet-50 to-white",
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
          <span className="text-4xl">{icon(student.avatarKey)}</span>
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
              className={`${CARD} ${WORLD_BACKDROP[chapter.worldTheme] ?? ""} ${chapter.status === "LOCKED" ? "opacity-50" : ""} flex flex-col gap-4 overflow-hidden`}
            >
              <div className="flex items-center gap-3">
                <span className="text-3xl">{WORLD_ICONS[chapter.worldTheme] ?? "🔷"}</span>
                <div>
                  <h2 className="text-lg font-black text-slate-800">{chapter.worldName}</h2>
                  <p className="text-xs text-slate-500">{chapter.title}</p>
                </div>
                {chapter.status === "COMPLETE" && <span className="ml-auto text-emerald-500 font-bold text-sm">Complete! 🎉</span>}
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
