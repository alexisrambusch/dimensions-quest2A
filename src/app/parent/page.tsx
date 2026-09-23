import Link from "next/link";
import { redirect } from "next/navigation";
import { getActiveStudent } from "@/lib/actions/students";
import { getParentDashboard } from "@/lib/actions/parentDashboard";
import { getParentPinStatus, isParentUnlocked, lockParentDashboard } from "@/lib/actions/parentAuth";
import { ParentPinGate } from "@/components/ParentPinGate";
import { icon } from "@/components/manipulatives/icons";
import { CARD } from "@/components/ui";

function ProgressBar({ percent }: { percent: number }) {
  const color = percent >= 80 ? "bg-emerald-500" : percent >= 50 ? "bg-amber-500" : "bg-rose-400";
  return (
    <div className="h-3 w-full rounded-full bg-slate-100 overflow-hidden">
      <div className={`h-full ${color} rounded-full transition-all`} style={{ width: `${percent}%` }} />
    </div>
  );
}

export default async function ParentDashboardPage() {
  const student = await getActiveStudent();
  if (!student) redirect("/profiles");

  const unlocked = await isParentUnlocked();
  if (!unlocked) {
    const { hasPin } = await getParentPinStatus();
    return (
      <main className="flex-1 p-6 flex items-center justify-center">
        <ParentPinGate hasPin={hasPin} />
      </main>
    );
  }

  const data = await getParentDashboard(student.id);

  return (
    <main className="flex-1 p-6 max-w-3xl mx-auto w-full flex flex-col gap-6">
      <header className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-4xl">{icon(data.student.avatarKey)}</span>
          <div>
            <h1 className="text-2xl font-black text-violet-800">{data.student.name}&apos;s Progress</h1>
            <p className="text-sm text-slate-500">Parent Dashboard</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <Link href="/map" className="text-sm font-semibold text-violet-600 hover:underline">
            ← Back to quest map
          </Link>
          <form action={lockParentDashboard}>
            <button type="submit" className="text-sm font-semibold text-slate-400 hover:text-slate-600">
              🔒 Lock
            </button>
          </form>
        </div>
      </header>

      <section className={`${CARD} grid grid-cols-2 sm:grid-cols-4 gap-4 text-center`}>
        <div>
          <p className="text-2xl font-black text-violet-700">
            {data.overall.chaptersCompleted}/{data.overall.chaptersTotal}
          </p>
          <p className="text-xs text-slate-500">Chapters complete</p>
        </div>
        <div>
          <p className="text-2xl font-black text-violet-700">
            {data.overall.lessonsCompleted}/{data.overall.lessonsTotal}
          </p>
          <p className="text-xs text-slate-500">Lessons complete</p>
        </div>
        <div>
          <p className="text-2xl font-black text-emerald-600">{data.overall.skillsMastered}</p>
          <p className="text-xs text-slate-500">Skills mastered</p>
        </div>
        <div>
          <p className="text-2xl font-black text-amber-600">{data.overall.skillsNeedsReview}</p>
          <p className="text-xs text-slate-500">Need review</p>
        </div>
      </section>

      <section className={`${CARD} flex flex-col gap-3`}>
        <h2 className="font-bold text-slate-800">What&apos;s really going on</h2>
        {data.insights.map((insight, i) => (
          <p key={i} className="text-sm text-slate-600 bg-violet-50 border border-violet-100 rounded-lg px-3 py-2">
            {insight}
          </p>
        ))}
      </section>

      <section className={`${CARD} flex flex-col gap-3`}>
        <h2 className="font-bold text-slate-800">Concept Mastery by Chapter</h2>
        {data.conceptMastery.map((c) => (
          <div key={c.chapterCode} className="flex flex-col gap-1">
            <div className="flex justify-between text-sm">
              <span className="font-semibold text-slate-700">{c.chapterTitle}</span>
              <span className="text-slate-500">{c.percent}%</span>
            </div>
            <ProgressBar percent={c.percent} />
          </div>
        ))}
      </section>

      <section className={`${CARD} flex flex-col gap-3`}>
        <h2 className="font-bold text-slate-800">Fact Fluency</h2>
        <p className="text-sm text-slate-500">
          {data.factFluency.strongCount} facts fluent · {data.factFluency.weakFacts.length} still building speed
        </p>
        {data.factFluency.weakFacts.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {data.factFluency.weakFacts.map((f) => (
              <span key={f.label} className="rounded-lg bg-amber-50 border border-amber-200 px-3 py-1.5 text-sm font-semibold text-amber-700">
                {f.label}
              </span>
            ))}
          </div>
        ) : (
          <p className="text-sm text-slate-400">No fact data yet — this fills in as facts are practiced.</p>
        )}
      </section>

      <section className={`${CARD} grid grid-cols-2 sm:grid-cols-4 gap-4 text-center`}>
        <div>
          <p className="text-xl font-black text-slate-800">{data.behavior.overallAccuracy}%</p>
          <p className="text-xs text-slate-500">Accuracy</p>
        </div>
        <div>
          <p className="text-xl font-black text-slate-800">{data.behavior.independenceRate}%</p>
          <p className="text-xs text-slate-500">Independent</p>
        </div>
        <div>
          <p className="text-xl font-black text-slate-800">{data.behavior.avgHintLevel}</p>
          <p className="text-xs text-slate-500">Avg hint level</p>
        </div>
        <div>
          <p className="text-xl font-black text-slate-800">{data.behavior.attemptsLast7Days}</p>
          <p className="text-xs text-slate-500">Practiced (7d)</p>
        </div>
      </section>

      {data.behavior.activeMisconceptions.length > 0 && (
        <section className={`${CARD} flex flex-col gap-3`}>
          <h2 className="font-bold text-slate-800">Patterns Worth Watching</h2>
          {data.behavior.activeMisconceptions.map((m, i) => (
            <div key={i} className="text-sm bg-rose-50 border border-rose-200 rounded-lg px-3 py-2">
              <p className="font-semibold text-rose-700">{m.skillCode}</p>
              <p className="text-slate-600">{m.description}</p>
            </div>
          ))}
        </section>
      )}
    </main>
  );
}
