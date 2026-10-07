import Link from "next/link";
import { redirect } from "next/navigation";
import { getActiveStudent, switchProfileAction } from "@/lib/actions/students";
import { PlayRunner } from "@/components/preschool/PlayRunner";
import { icon } from "@/components/manipulatives/icons";
import { levelForXp } from "@/lib/gamification/level";

export const dynamic = "force-dynamic";

export default async function PreschoolPage() {
  const student = await getActiveStudent();
  if (!student) redirect("/profiles");

  return (
    <main className="flex-1 p-6 max-w-2xl mx-auto w-full flex flex-col gap-6">
      <header className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-blue-200 to-cyan-100 text-3xl shadow-sm ring-2 ring-white">
            {icon(student.avatarKey)}
          </span>
          <div>
            <h1 className="text-xl font-black text-blue-800">{student.name}&apos;s Play Time</h1>
            <p className="text-xs text-blue-500 font-semibold">
              Level {levelForXp(student.totalXp)} · {student.totalXp} XP · {student.coins} 🪙
            </p>
          </div>
        </div>
        <form action={switchProfileAction}>
          <button type="submit" className="text-sm font-semibold text-slate-500 hover:text-blue-700">
            Switch profile
          </button>
        </form>
      </header>

      <PlayRunner studentId={student.id} studentName={student.name} />

      <Link href="/parent" className="text-xs text-slate-400 hover:text-blue-600 text-center">
        Parent Dashboard
      </Link>
    </main>
  );
}
