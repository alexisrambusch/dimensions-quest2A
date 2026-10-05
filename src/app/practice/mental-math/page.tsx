import { redirect } from "next/navigation";
import { getActiveStudent } from "@/lib/actions/students";
import { PracticeHeader } from "@/components/practice/PracticeHeader";
import { MentalMathClient } from "@/components/practice/MentalMathClient";

export const dynamic = "force-dynamic";

export default async function MentalMathPage() {
  const student = await getActiveStudent();
  if (!student) redirect("/profiles");

  return (
    <main className="flex-1 p-6 max-w-2xl mx-auto w-full flex flex-col gap-6">
      <PracticeHeader title="Mental Math Drills" subtitle="Quick-fire facts, one at a time." />
      <MentalMathClient studentId={student.id} />
    </main>
  );
}
