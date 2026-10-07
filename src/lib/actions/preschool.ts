"use server";

import { prisma } from "@/lib/prisma";
import { generateInstance, validateResponse } from "@/lib/math-engine/registry";
import type { RenderedPrompt } from "@/lib/math-engine/types";
import { awardXp } from "@/lib/mastery/engine";
import { checkAndAwardAchievements } from "@/lib/gamification/engine";
import type {
  ExperimentContent,
  JournalContent,
  MorningRoutineContent,
  MovementBreakContent,
  ParentActivityContent,
  QuestionContent,
  ReadAloudContent,
  SelScenarioContent,
  TraceContent,
} from "@/lib/preschool/types";

const QUESTION_XP = 5;
const ACTIVITY_XP = 3;
const DAY_COMPLETE_XP = 20;

export interface PreschoolDaySummary {
  id: string;
  dayNumber: number;
  title: string;
  activityCount: number;
  completedCount: number;
  requiredCount: number;
  requiredCompletedCount: number;
  complete: boolean;
  unlocked: boolean;
}

export interface PreschoolWeekSummary {
  id: string;
  number: number;
  theme: string;
  days: PreschoolDaySummary[];
}

/** All weeks with per-day completion and lock status for this student — the preschool equivalent of getMissionMap. */
export async function listPreschoolWeeks(studentId: string): Promise<PreschoolWeekSummary[]> {
  const weeks = await prisma.preschoolWeek.findMany({
    orderBy: { number: "asc" },
    include: {
      days: {
        orderBy: { dayNumber: "asc" },
        include: {
          activities: {
            include: { progress: { where: { studentId } } },
          },
        },
      },
    },
  });

  const result: PreschoolWeekSummary[] = [];
  let previousDayComplete = true; // Week 1 Day 1 is always unlocked

  for (const week of weeks) {
    const days: PreschoolDaySummary[] = [];
    for (const day of week.days) {
      const required = day.activities.filter((a) => !a.optional);
      const requiredCompleted = required.filter((a) => a.progress.length > 0);
      const completed = day.activities.filter((a) => a.progress.length > 0);
      const complete = required.length > 0 && requiredCompleted.length === required.length;
      days.push({
        id: day.id,
        dayNumber: day.dayNumber,
        title: day.title,
        activityCount: day.activities.length,
        completedCount: completed.length,
        requiredCount: required.length,
        requiredCompletedCount: requiredCompleted.length,
        complete,
        unlocked: previousDayComplete,
      });
      previousDayComplete = complete;
    }
    result.push({ id: week.id, number: week.number, theme: week.theme, days });
  }

  return result;
}

export type PreschoolActivityForClient =
  | { id: string; order: number; domain: string; type: "QUESTION"; title: string; instructions: string; optional: boolean; completed: boolean; questionPrompt: RenderedPrompt }
  | { id: string; order: number; domain: string; type: "SEL_SCENARIO"; title: string; instructions: string; optional: boolean; completed: boolean; content: SelScenarioContent }
  | { id: string; order: number; domain: string; type: "TRACE"; title: string; instructions: string; optional: boolean; completed: boolean; content: TraceContent }
  | { id: string; order: number; domain: string; type: "EXPERIMENT"; title: string; instructions: string; optional: boolean; completed: boolean; content: ExperimentContent }
  | { id: string; order: number; domain: string; type: "READ_ALOUD"; title: string; instructions: string; optional: boolean; completed: boolean; content: ReadAloudContent }
  | { id: string; order: number; domain: string; type: "JOURNAL"; title: string; instructions: string; optional: boolean; completed: boolean; content: JournalContent }
  | { id: string; order: number; domain: string; type: "PARENT_ACTIVITY"; title: string; instructions: string; optional: boolean; completed: boolean; content: ParentActivityContent }
  | { id: string; order: number; domain: string; type: "MOVEMENT_BREAK"; title: string; instructions: string; optional: boolean; completed: boolean; content: MovementBreakContent }
  | { id: string; order: number; domain: string; type: "MORNING_ROUTINE"; title: string; instructions: string; optional: boolean; completed: boolean; content: MorningRoutineContent };

export interface PreschoolDayForClient {
  id: string;
  dayNumber: number;
  title: string;
  weekNumber: number;
  weekTheme: string;
  activities: PreschoolActivityForClient[];
}

/** Builds the rendered prompt for a QUESTION activity, merging in anything the generator needs from the student's own profile (currently just their name). The activity id doubles as the seed, so re-visiting a day shows the same instance rather than a new random one each time. */
async function renderQuestionActivity(activityId: string, content: QuestionContent, studentId: string): Promise<RenderedPrompt> {
  const params = { ...content.params };
  if (content.generatorId === "prek.name.recognize") {
    const student = await prisma.student.findUniqueOrThrow({ where: { id: studentId }, select: { name: true } });
    params.studentName = student.name;
  }
  const instance = generateInstance(content.generatorId, activityId, content.difficulty, params);
  return instance.prompt;
}

/** A day's full activity list, ready to render — questions pre-generated, everything else parsed from its stored JSON. */
export async function getPreschoolDay(dayId: string, studentId: string): Promise<PreschoolDayForClient> {
  const day = await prisma.preschoolDay.findUniqueOrThrow({
    where: { id: dayId },
    include: {
      week: true,
      activities: { orderBy: { order: "asc" }, include: { progress: { where: { studentId } } } },
    },
  });

  const activities: PreschoolActivityForClient[] = await Promise.all(
    day.activities.map(async (a) => {
      const base = {
        id: a.id,
        order: a.order,
        domain: a.domain,
        title: a.title,
        instructions: a.instructions,
        optional: a.optional,
        completed: a.progress.length > 0,
      };
      if (a.type === "QUESTION") {
        const content = JSON.parse(a.contentJson) as QuestionContent;
        return { ...base, type: "QUESTION", questionPrompt: await renderQuestionActivity(a.id, content, studentId) };
      }
      return { ...base, type: a.type, content: JSON.parse(a.contentJson) } as PreschoolActivityForClient;
    }),
  );

  return { id: day.id, dayNumber: day.dayNumber, title: day.title, weekNumber: day.week.number, weekTheme: day.week.theme, activities };
}

export interface PreschoolActivityResult {
  correct?: boolean;
  explanation?: string;
  xpAwarded: number;
  coinsAwarded: number;
  leveledUp: boolean;
  newLevel: number;
  newBadges: Array<{ code: string; title: string; icon: string }>;
  dayComplete: boolean;
}

/** Marks an activity done (idempotent — revisiting an already-completed activity awards no extra XP) and, for QUESTION activities, grades the response. */
export async function completePreschoolActivity(studentId: string, activityId: string, response?: unknown): Promise<PreschoolActivityResult> {
  const activity = await prisma.preschoolActivity.findUniqueOrThrow({
    where: { id: activityId },
    include: { day: { include: { activities: true } } },
  });

  const already = await prisma.studentActivityProgress.findUnique({
    where: { studentId_activityId: { studentId, activityId } },
  });

  let correct: boolean | undefined;
  let explanation: string | undefined;

  if (activity.type === "QUESTION") {
    const content = JSON.parse(activity.contentJson) as QuestionContent;
    const params = { ...content.params };
    if (content.generatorId === "prek.name.recognize") {
      const student = await prisma.student.findUniqueOrThrow({ where: { id: studentId }, select: { name: true } });
      params.studentName = student.name;
    }
    const instance = generateInstance(content.generatorId, activityId, content.difficulty, params);
    const result = validateResponse(content.generatorId, response, instance.answer, instance.meta);
    correct = result.correct;
    explanation = instance.answer.explanation;
  }

  const required = activity.day.activities.filter((a) => !a.optional);
  let dayWasCompleteBefore = false;
  if (!already) {
    const beforeRows = await prisma.studentActivityProgress.findMany({
      where: { studentId, activityId: { in: required.map((a) => a.id) } },
    });
    dayWasCompleteBefore = required.length > 0 && beforeRows.length === required.length;

    await prisma.studentActivityProgress.create({
      data: { studentId, activityId, responseJson: response !== undefined ? JSON.stringify(response) : null },
    });
  }

  let xpAwarded = 0;
  let coinsAwarded = 0;
  let leveledUp = false;
  let newLevel = 0;
  let newBadges: Array<{ code: string; title: string; icon: string }> = [];

  if (!already) {
    xpAwarded = activity.type === "QUESTION" ? QUESTION_XP : ACTIVITY_XP;
    const xpResult = await awardXp(prisma, studentId, xpAwarded, `Preschool: ${activity.title}`);
    coinsAwarded += xpResult.coinsAwarded;
    leveledUp = xpResult.leveledUp;
    newLevel = xpResult.newLevel;

    const afterRows = await prisma.studentActivityProgress.findMany({
      where: { studentId, activityId: { in: required.map((a) => a.id) } },
    });
    const dayNowComplete = required.length > 0 && afterRows.length === required.length;
    if (dayNowComplete && !dayWasCompleteBefore) {
      const dayXpResult = await awardXp(prisma, studentId, DAY_COMPLETE_XP, `Preschool day complete: ${activity.day.title}`);
      xpAwarded += DAY_COMPLETE_XP;
      coinsAwarded += dayXpResult.coinsAwarded;
      leveledUp = leveledUp || dayXpResult.leveledUp;
      newLevel = dayXpResult.leveledUp ? dayXpResult.newLevel : newLevel;
    }

    const badgeResult = await checkAndAwardAchievements(prisma, studentId);
    coinsAwarded += badgeResult.coinsAwarded;
    leveledUp = leveledUp || badgeResult.leveledUp;
    newLevel = badgeResult.leveledUp ? badgeResult.newLevel : newLevel;
    newBadges = badgeResult.newBadges;
  }

  const finalProgressRows = await prisma.studentActivityProgress.findMany({
    where: { studentId, activityId: { in: required.map((a) => a.id) } },
  });
  const dayComplete = required.length > 0 && finalProgressRows.length === required.length;

  return { correct, explanation, xpAwarded, coinsAwarded, leveledUp, newLevel, newBadges, dayComplete };
}
