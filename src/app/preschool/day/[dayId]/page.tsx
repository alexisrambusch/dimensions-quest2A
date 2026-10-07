import { redirect } from "next/navigation";
import Link from "next/link";
import { getActiveStudent } from "@/lib/actions/students";
import { getPreschoolDay } from "@/lib/actions/preschool";
import { DayRunner } from "@/components/preschool/DayRunner";

export const dynamic = "force-dynamic";

export default async function PreschoolDayPage({ params }: { params: Promise<{ dayId: string }> }) {
  const { dayId } = await params;
  const student = await getActiveStudent();
  if (!student) redirect("/profiles");

  const day = await getPreschoolDay(dayId, student.id);

  return (
    <main className="flex-1 p-6 max-w-2xl mx-auto w-full flex flex-col gap-4">
      <Link href="/preschool" className="text-sm font-semibold text-slate-500 hover:text-blue-700 self-start">
        ← Back to the Week
      </Link>
      <DayRunner day={day} studentId={student.id} studentName={student.name} />
    </main>
  );
}
