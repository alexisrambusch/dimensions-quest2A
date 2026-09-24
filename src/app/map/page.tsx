import Link from "next/link";
import { redirect } from "next/navigation";
import { getActiveStudent, switchProfileAction } from "@/lib/actions/students";
import { getMissionMap } from "@/lib/actions/curriculum";
import { getChapterAssessments } from "@/lib/actions/assessment";
import { icon } from "@/components/manipulatives/icons";
import { CARD } from "@/components/ui";
import { levelForXp } from "@/lib/gamification/level";

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

const LESSON_STATUS_STYLE: Record<string, string> = {
  LOCKED: "bg-slate-100 text-slate-400 border-slate-200 cursor-not-allowed",
  AVAILABLE: "bg-white text-blue-700 border-blue-300 hover:border-blue-500",
  IN_PROGRESS: "bg-amber-50 text-amber-700 border-amber-400",
  COMPLETE: "bg-emerald-50 text-emerald-700 border-emerald-400",
};

const LESSON_STATUS_ICON: Record<string, string> = {
  LOCKED: "🔒",
  AVAILABLE: "▶️",
  IN_PROGRESS: "🟡",
  COMPLETE: "✅",
};

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

      <div className="flex flex-col gap-5">
        {chapters.map((chapter) => (
          <section
            key={chapter.code}
            className={`${CARD} ${chapter.status === "LOCKED" ? "opacity-50" : ""} flex flex-col gap-3`}
          >
            <div className="flex items-center gap-3">
              <span className="text-3xl">{WORLD_ICONS[chapter.worldTheme] ?? "🔷"}</span>
              <div>
                <h2 className="text-lg font-black text-slate-800">{chapter.worldName}</h2>
                <p className="text-xs text-slate-500">{chapter.title}</p>
              </div>
              {chapter.status === "COMPLETE" && <span className="ml-auto text-emerald-500 font-bold text-sm">Complete! 🎉</span>}
            </div>
            <div className="flex flex-wrap gap-2">
              {chapter.lessons.map((lesson) => {
                const clickable = lesson.status !== "LOCKED";
                const content = (
                  <span
                    className={`inline-flex items-center gap-1.5 rounded-xl border-2 px-3 py-2 text-sm font-semibold ${LESSON_STATUS_STYLE[lesson.status]}`}
                  >
                    <span>{LESSON_STATUS_ICON[lesson.status]}</span>
                    {lesson.title}
                  </span>
                );
                return clickable ? (
                  <Link key={lesson.code} href={`/lesson/${lesson.code}`}>
                    {content}
                  </Link>
                ) : (
                  <span key={lesson.code}>{content}</span>
                );
              })}
            </div>
            {chapter.status !== "LOCKED" && (assessmentsMap.get(chapter.code)?.length ?? 0) > 0 && (
              <div className="flex flex-wrap gap-2 pt-1 border-t border-slate-100">
                {assessmentsMap.get(chapter.code)!.map((a) => (
                  <Link
                    key={a.code}
                    href={`/assessment/${a.code}`}
                    className="inline-flex items-center gap-1.5 rounded-xl border-2 border-amber-300 bg-amber-50 text-amber-800 px-3 py-2 text-sm font-semibold hover:border-amber-500"
                  >
                    📝 {a.title}
                    {a.bestScore && (
                      <span className="text-xs font-bold text-amber-600">
                        (best {a.bestScore.correct}/{a.bestScore.total})
                      </span>
                    )}
                  </Link>
                ))}
              </div>
            )}
          </section>
        ))}
      </div>
    </main>
  );
}
