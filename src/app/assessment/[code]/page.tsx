import { redirect } from "next/navigation";
import { getActiveStudent } from "@/lib/actions/students";
import { prisma } from "@/lib/prisma";
import { AssessmentRunner } from "@/components/lesson/AssessmentRunner";

export default async function AssessmentPage({ params }: { params: Promise<{ code: string }> }) {
  const { code } = await params;
  const student = await getActiveStudent();
  if (!student) redirect("/profiles");

  const assessment = await prisma.assessment.findUniqueOrThrow({ where: { code } });
  const questionCount = (JSON.parse(assessment.questionsJson) as string[]).length;

  return (
    <main className="flex-1 p-6 flex items-center justify-center">
      <AssessmentRunner
        assessmentCode={assessment.code}
        studentId={student.id}
        title={assessment.title}
        description={assessment.description}
        style={assessment.style}
        questionCount={questionCount}
      />
    </main>
  );
}
