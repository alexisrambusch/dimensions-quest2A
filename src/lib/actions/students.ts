"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";

const ACTIVE_STUDENT_COOKIE = "active_student_id";
const HOUSEHOLD_PARENT_EMAIL = "alexisrambusch@gmail.com";

export async function listStudents() {
  const parent = await prisma.parent.findUnique({ where: { email: HOUSEHOLD_PARENT_EMAIL } });
  if (!parent) return [];
  return prisma.student.findMany({ where: { parentId: parent.id }, orderBy: { createdAt: "asc" } });
}

/** Every grade/curriculum offered, for the "which grade is this for?" picker on profile creation. */
export async function listGrades() {
  return prisma.grade.findMany({ orderBy: { order: "asc" } });
}

export async function createStudent(name: string, avatarKey: string, gradeId?: string) {
  const parent = await prisma.parent.upsert({
    where: { email: HOUSEHOLD_PARENT_EMAIL },
    update: {},
    create: { email: HOUSEHOLD_PARENT_EMAIL, name: "Parent" },
  });
  const grade = gradeId
    ? await prisma.grade.findUnique({ where: { id: gradeId } })
    : await prisma.grade.findFirst({ orderBy: { order: "asc" } });
  const student = await prisma.student.create({
    data: { parentId: parent.id, name: name.trim() || "Learner", avatarKey, currentGradeId: grade?.id },
  });
  return student;
}

export async function setActiveStudent(studentId: string) {
  const store = await cookies();
  store.set(ACTIVE_STUDENT_COOKIE, studentId, { httpOnly: true, sameSite: "lax", path: "/", maxAge: 60 * 60 * 24 * 365 });
}

export async function getActiveStudentId(): Promise<string | null> {
  const store = await cookies();
  return store.get(ACTIVE_STUDENT_COOKIE)?.value ?? null;
}

export async function getActiveStudent() {
  const id = await getActiveStudentId();
  if (!id) return null;
  return prisma.student.findUnique({ where: { id } });
}

export async function clearActiveStudent() {
  const store = await cookies();
  store.delete(ACTIVE_STUDENT_COOKIE);
}

/** Permanently deletes a student profile and all of their progress (lessons, attempts, mastery, achievements, shop collection — cascades via the schema). */
export async function deleteStudent(studentId: string) {
  const activeId = await getActiveStudentId();
  await prisma.student.delete({ where: { id: studentId } });
  if (activeId === studentId) {
    await clearActiveStudent();
  }
}

export async function selectStudentAction(studentId: string) {
  await setActiveStudent(studentId);
  redirect("/map");
}

export async function createStudentAction(formData: FormData) {
  const name = String(formData.get("name") ?? "").trim();
  const avatarKey = String(formData.get("avatarKey") ?? "fox");
  const gradeId = String(formData.get("gradeId") ?? "") || undefined;
  if (!name) return;
  const student = await createStudent(name, avatarKey, gradeId);
  await setActiveStudent(student.id);
  redirect("/map");
}

export async function switchProfileAction() {
  await clearActiveStudent();
  redirect("/profiles");
}

export async function deleteStudentAction(formData: FormData) {
  const studentId = String(formData.get("studentId") ?? "");
  if (!studentId) return;
  await deleteStudent(studentId);
  redirect("/profiles");
}
