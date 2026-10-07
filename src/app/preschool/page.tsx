import Link from "next/link";
import clsx from "clsx";
import { redirect } from "next/navigation";
import { getActiveStudent } from "@/lib/actions/students";
import { listPreschoolWeeks } from "@/lib/actions/preschool";
import { CARD } from "@/components/ui";

export const dynamic = "force-dynamic";

export default async function PreschoolPage() {
  const student = await getActiveStudent();
  if (!student) redirect("/profiles");

  const weeks = await listPreschoolWeeks(student.id);

  return (
    <main className="flex-1 p-6 max-w-2xl mx-auto w-full flex flex-col gap-6">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-blue-800">Preschool Program</h1>
          <p className="text-sm text-slate-500">A short lesson every day across reading, math, science, and more.</p>
        </div>
        <Link href="/map" className="text-sm font-semibold text-slate-500 hover:text-blue-700">
          Back to map
        </Link>
      </header>

      {weeks.map((week) => (
        <div key={week.id} className={`${CARD} flex flex-col gap-4`}>
          <div>
            <p className="text-xs font-bold uppercase tracking-wide text-blue-400">Week {week.number}</p>
            <h2 className="text-lg font-black text-slate-800">{week.theme}</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-5 gap-2">
            {week.days.map((day) => {
              const content = (
                <div
                  className={clsx(
                    "rounded-xl border-2 p-3 flex flex-col items-center gap-1 text-center transition-transform touch-manipulation",
                    day.complete && "border-emerald-400 bg-emerald-50",
                    !day.complete && day.unlocked && "border-blue-300 bg-blue-50 hover:-translate-y-0.5",
                    !day.unlocked && "border-slate-200 bg-slate-50 opacity-50",
                  )}
                >
                  <span className="text-xs font-bold text-slate-500">Day {day.dayNumber}</span>
                  <span className="text-sm font-semibold text-slate-700">{day.title}</span>
                  <span className="text-[11px] text-slate-400">
                    {day.complete ? "✓ Done" : day.unlocked ? `${day.completedCount}/${day.activityCount}` : "Locked"}
                  </span>
                </div>
              );
              return day.unlocked ? (
                <Link key={day.id} href={`/preschool/day/${day.id}`} className="active:scale-95 transition-transform">
                  {content}
                </Link>
              ) : (
                <div key={day.id}>{content}</div>
              );
            })}
          </div>
        </div>
      ))}
    </main>
  );
}
