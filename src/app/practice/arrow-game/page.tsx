import { redirect } from "next/navigation";
import { getActiveStudent } from "@/lib/actions/students";
import { PracticeHeader } from "@/components/practice/PracticeHeader";
import { ArrowGameClient } from "@/components/practice/ArrowGameClient";

export const dynamic = "force-dynamic";

export default async function ArrowGamePage() {
  const student = await getActiveStudent();
  if (!student) redirect("/profiles");

  return (
    <main className="flex-1 p-6 max-w-2xl mx-auto w-full flex flex-col gap-6">
      <PracticeHeader title="Arrow Game" subtitle="Follow the arrows around the hundred chart." />
      <ArrowGameClient studentId={student.id} />
    </main>
  );
}
