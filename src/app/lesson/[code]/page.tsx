import { redirect } from "next/navigation";
import { getActiveStudent } from "@/lib/actions/students";
import { getLessonRuntime } from "@/lib/actions/lesson";
import { LessonRunner } from "@/components/lesson/LessonRunner";

export const dynamic = "force-dynamic";

export default async function LessonPage({ params }: { params: Promise<{ code: string }> }) {
  const { code } = await params;
  const student = await getActiveStudent();
  if (!student) redirect("/profiles");

  const runtime = await getLessonRuntime(code, student.id);

  return (
    <main className="flex-1 p-6 flex items-center justify-center">
      <LessonRunner runtime={runtime} studentId={student.id} studentName={student.name} />
    </main>
  );
}
