import Link from "next/link";
import { redirect } from "next/navigation";
import { getActiveStudent } from "@/lib/actions/students";
import { getTrophyCase } from "@/lib/actions/trophies";
import { icon } from "@/components/manipulatives/icons";
import { CARD } from "@/components/ui";

export const dynamic = "force-dynamic";

export default async function TrophyCasePage() {
  const student = await getActiveStudent();
  if (!student) redirect("/profiles");

  const trophies = await getTrophyCase(student.id);
  const earnedCount = trophies.filter((t) => t.earned).length;

  return (
    <main className="flex-1 p-6 max-w-3xl mx-auto w-full flex flex-col gap-6">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-blue-800">Trophy Case</h1>
          <p className="text-sm text-slate-500">
            {earnedCount} of {trophies.length} badges earned
          </p>
        </div>
        <Link href="/map" className="text-sm font-semibold text-slate-500 hover:text-blue-700">
          ← Back to quest map
        </Link>
      </header>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        {trophies.map((t) => (
          <div
            key={t.code}
            className={`${CARD} flex flex-col items-center gap-2 text-center ${t.earned ? "" : "opacity-40 grayscale"}`}
          >
            <span className="text-4xl">{icon(t.icon)}</span>
            <p className="font-bold text-slate-800 text-sm">{t.title}</p>
            <p className="text-xs text-slate-500">{t.earned ? t.description : "Keep exploring to unlock this one!"}</p>
          </div>
        ))}
      </div>
    </main>
  );
}
