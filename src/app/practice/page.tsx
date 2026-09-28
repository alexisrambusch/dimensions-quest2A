import Link from "next/link";
import { redirect } from "next/navigation";
import { getActiveStudent } from "@/lib/actions/students";
import { CARD } from "@/components/ui";

export const dynamic = "force-dynamic";

const ACTIVITIES = [
  {
    href: "/practice/part-part-whole",
    icon: "⭕",
    title: "Part-Part-Whole",
    description: "Split numbers 1-10 into every possible pair of parts.",
  },
  {
    href: "/practice/mental-math",
    icon: "⚡",
    title: "Mental Math Drills",
    description: "Quick-fire facts: add, subtract, multiply, and divide.",
  },
  {
    href: "/practice/fact-staircase",
    icon: "🪜",
    title: "Fact Staircase",
    description: "Fill in every addition and subtraction fact within 10 or 20.",
  },
  {
    href: "/practice/arrow-game",
    icon: "🧭",
    title: "Arrow Game",
    description: "Follow arrows around a hundred chart to find the mystery number.",
  },
  {
    href: "/practice/roll-and-cover",
    icon: "🎲",
    title: "Roll & Cover",
    description: "Solve facts and cover the matching number to clear the board.",
  },
] as const;

export default async function PracticePage() {
  const student = await getActiveStudent();
  if (!student) redirect("/profiles");

  return (
    <main className="flex-1 p-6 max-w-3xl mx-auto w-full flex flex-col gap-6">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-blue-800">Practice &amp; Games</h1>
          <p className="text-sm text-slate-500">Jump in anytime — no lesson required.</p>
        </div>
        <Link href="/map" className="text-sm font-semibold text-slate-500 hover:text-blue-700">
          Back to map
        </Link>
      </header>

      <div className="grid sm:grid-cols-2 gap-4">
        {ACTIVITIES.map((a) => (
          <Link
            key={a.href}
            href={a.href}
            className={`${CARD} flex items-start gap-4 hover:shadow-xl hover:-translate-y-0.5 transition-transform active:scale-[0.98] touch-manipulation`}
          >
            <span className="text-4xl leading-none">{a.icon}</span>
            <div>
              <h2 className="font-black text-slate-800">{a.title}</h2>
              <p className="text-sm text-slate-500">{a.description}</p>
            </div>
          </Link>
        ))}
      </div>
    </main>
  );
}
