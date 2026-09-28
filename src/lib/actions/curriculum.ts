"use server";

import { prisma } from "@/lib/prisma";

export type LessonStatus = "LOCKED" | "AVAILABLE" | "IN_PROGRESS" | "COMPLETE";

export interface MapLesson {
  code: string;
  title: string;
  type: string;
  order: number;
  status: LessonStatus;
}

export interface MapChapter {
  code: string;
  title: string;
  description: string;
  worldName: string;
  worldTheme: string;
  order: number;
  lessons: MapLesson[];
  status: "LOCKED" | "IN_PROGRESS" | "COMPLETE";
}

export async function getMissionMap(studentId: string): Promise<MapChapter[]> {
  const chapters = await prisma.chapter.findMany({
    orderBy: { order: "asc" },
    include: { lessons: { orderBy: { order: "asc" } } },
  });
  const progress = await prisma.lessonProgress.findMany({ where: { studentId } });
  const progressByLesson = new Map(progress.map((p) => [p.lessonId, p]));

  // A chapter only counts as done — and unlocks the next one — once the
  // student has scored 100% on at least one of its two tests, not just
  // finished every lesson.
  const assessments = await prisma.assessment.findMany({
    include: { attempts: { where: { studentId, completedAt: { not: null } } } },
  });
  const chapterHasPerfectScore = new Set<string>();
  for (const a of assessments) {
    const passed = a.attempts.some((att) => {
      const s = JSON.parse(att.scoreJson) as { correct?: number; total?: number };
      return !!s.total && s.correct === s.total;
    });
    if (passed) chapterHasPerfectScore.add(a.chapterId);
  }

  const result: MapChapter[] = [];
  let previousChapterComplete = true;

  for (const chapter of chapters) {
    const lessons: MapLesson[] = [];
    let previousLessonComplete = true;

    for (const lesson of chapter.lessons) {
      const p = progressByLesson.get(lesson.id);
      let status: LessonStatus;
      if (p?.completed) {
        status = "COMPLETE";
      } else if (!previousChapterComplete || !previousLessonComplete) {
        status = "LOCKED";
      } else if (p) {
        status = "IN_PROGRESS";
      } else {
        status = "AVAILABLE";
      }
      lessons.push({ code: lesson.code, title: lesson.title, type: lesson.type, order: lesson.order, status });
      previousLessonComplete = status === "COMPLETE";
    }

    const allLessonsComplete = lessons.length > 0 && lessons.every((l) => l.status === "COMPLETE");
    const chapterComplete = allLessonsComplete && chapterHasPerfectScore.has(chapter.id);
    result.push({
      code: chapter.code,
      title: chapter.title,
      description: chapter.description,
      worldName: chapter.worldName,
      worldTheme: chapter.worldTheme,
      order: chapter.order,
      lessons,
      status: chapterComplete ? "COMPLETE" : previousChapterComplete ? "IN_PROGRESS" : "LOCKED",
    });
    previousChapterComplete = chapterComplete;
  }

  return result;
}
