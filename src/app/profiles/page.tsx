import { listStudents, listGrades, selectStudentAction, createStudentAction, deleteStudentAction } from "@/lib/actions/students";
import { icon } from "@/components/manipulatives/icons";
import { DeleteStudentButton } from "@/components/DeleteStudentButton";
import { CARD, PRIMARY_BUTTON } from "@/components/ui";

const AVATAR_OPTIONS = ["fox", "dog", "star", "crown"];

// This page reads from the database but has no cookies()/headers() call, so
// Next.js has no automatic signal to treat it as dynamic — without this it
// gets statically prerendered at *build* time, querying whatever (or no)
// database is reachable then rather than the real one at request time.
export const dynamic = "force-dynamic";

export default async function ProfilesPage() {
  const students = await listStudents();
  const grades = await listGrades();

  return (
    <main className="flex-1 flex flex-col items-center justify-center gap-10 p-6">
      <div className="text-center">
        <h1 className="text-4xl font-black text-blue-800">Dimensions Quest</h1>
        <p className="text-slate-500 mt-2">Who's exploring today?</p>
      </div>

      <div className="flex flex-wrap gap-6 justify-center max-w-2xl">
        {students.map((s) => (
          <form key={s.id} action={selectStudentAction.bind(null, s.id)}>
            <button type="submit" className={`${CARD} flex flex-col items-center gap-2 w-36 hover:-translate-y-1 transition-transform`}>
              <span className="text-5xl">{icon(s.avatarKey)}</span>
              <span className="font-bold text-slate-800">{s.name}</span>
              <span className="text-xs text-blue-500 font-semibold">{s.totalXp} XP</span>
            </button>
          </form>
        ))}
      </div>

      <details className={`${CARD} w-full max-w-sm`}>
        <summary className="cursor-pointer font-semibold text-blue-700">+ New explorer</summary>
        <form action={createStudentAction} className="mt-4 flex flex-col gap-4">
          <input
            name="name"
            required
            placeholder="Explorer's name"
            className="rounded-xl border-2 border-slate-300 focus:border-blue-500 outline-none px-4 py-3 text-lg"
          />
          <div className="flex gap-3 justify-center">
            {AVATAR_OPTIONS.map((a, i) => (
              <label key={a} className="cursor-pointer">
                <input type="radio" name="avatarKey" value={a} defaultChecked={i === 0} className="peer sr-only" />
                <span className="text-3xl block rounded-xl border-2 border-transparent peer-checked:border-blue-500 p-1">
                  {icon(a)}
                </span>
              </label>
            ))}
          </div>
          <label className="flex items-center justify-center gap-2 cursor-pointer rounded-xl border-2 border-slate-200 px-3 py-2">
            <input type="checkbox" name="isPreschool" className="h-5 w-5 accent-blue-600" />
            <span className="text-sm font-semibold text-slate-600">This is a preschooler (ages 3-5) — Preschool Play track</span>
          </label>
          {grades.length > 1 && (
            <div className="flex flex-col gap-2">
              <span className="text-sm font-semibold text-slate-600 text-center">Which curriculum?</span>
              <div className="flex flex-wrap gap-2 justify-center">
                {grades.map((g, i) => (
                  <label key={g.id} className="cursor-pointer">
                    <input type="radio" name="gradeId" value={g.id} defaultChecked={i === 0} className="peer sr-only" />
                    <span className="block rounded-xl border-2 border-slate-300 peer-checked:border-blue-500 peer-checked:bg-blue-50 px-3 py-2 text-sm font-semibold text-slate-700">
                      {g.sequence}
                    </span>
                  </label>
                ))}
              </div>
            </div>
          )}
          <button type="submit" className={PRIMARY_BUTTON}>
            Start the adventure
          </button>
        </form>
      </details>

      {students.length > 0 && (
        <details className={`${CARD} w-full max-w-sm`}>
          <summary className="cursor-pointer font-semibold text-slate-500">Manage profiles</summary>
          <div className="mt-4 flex flex-col gap-3">
            {students.map((s) => (
              <div key={s.id} className="flex items-center justify-between gap-3 rounded-xl border border-slate-200 px-4 py-2">
                <span className="flex items-center gap-2 text-slate-700">
                  <span className="text-xl">{icon(s.avatarKey)}</span>
                  <span className="font-semibold">{s.name}</span>
                </span>
                <DeleteStudentButton studentId={s.id} studentName={s.name} action={deleteStudentAction} />
              </div>
            ))}
          </div>
        </details>
      )}
    </main>
  );
}
