import { redirect } from "next/navigation";
import { getActiveStudent } from "@/lib/actions/students";
import { PracticeHeader } from "@/components/practice/PracticeHeader";
import { FactStaircaseClient } from "@/components/practice/FactStaircaseClient";

export const dynamic = "force-dynamic";

export default async function FactStaircasePage() {
  const student = await getActiveStudent();
  if (!student) redirect("/profiles");

  return (
    <main className="flex-1 p-6 max-w-2xl mx-auto w-full flex flex-col gap-6">
      <PracticeHeader title="Fact Staircase" subtitle="Every addition and subtraction fact, in order." />
      <FactStaircaseClient />
    </main>
  );
}
