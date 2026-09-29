import Link from "next/link";

/** Shared header for practice activity pages: title + a link back to the activity hub. */
export function PracticeHeader({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <header className="flex items-center justify-between">
      <div>
        <h1 className="text-2xl font-black text-violet-800">{title}</h1>
        <p className="text-sm text-slate-500">{subtitle}</p>
      </div>
      <Link href="/practice" className="text-sm font-semibold text-slate-500 hover:text-violet-700">
        All activities
      </Link>
    </header>
  );
}
