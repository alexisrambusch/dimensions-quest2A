import { redirect } from "next/navigation";
import { getActiveStudent } from "@/lib/actions/students";
import { PracticeHeader } from "@/components/practice/PracticeHeader";
import { RollAndCoverClient } from "@/components/practice/RollAndCoverClient";

export const dynamic = "force-dynamic";

export default async function RollAndCoverPage() {
  const student = await getActiveStudent();
  if (!student) redirect("/profiles");

  return (
    <main className="flex-1 p-6 max-w-2xl mx-auto w-full flex flex-col gap-6">
      <PracticeHeader title="Roll & Cover" subtitle="Solve the fact, then cover it on the board." />
      <RollAndCoverClient />
    </main>
  );
}
