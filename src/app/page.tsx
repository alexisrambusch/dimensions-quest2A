import { redirect } from "next/navigation";
import { getActiveStudentId } from "@/lib/actions/students";

export const dynamic = "force-dynamic";

export default async function Home() {
  const studentId = await getActiveStudentId();
  redirect(studentId ? "/map" : "/profiles");
}
