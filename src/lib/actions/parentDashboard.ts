"use server";

import { prisma } from "@/lib/prisma";

export interface ParentDashboardData {
  student: { name: string; avatarKey: string; totalXp: number; streakDays: number };
  overall: {
    chaptersCompleted: number;
    chaptersTotal: number;
    lessonsCompleted: number;
    lessonsTotal: number;
    skillsMastered: number;
    skillsDeveloping: number;
    skillsNeedsReview: number;
    skillsTotal: number;
  };
  conceptMastery: Array<{ chapterCode: string; chapterTitle: string; worldName: string; percent: number; skillCount: number }>;
  factFluency: {
    weakFacts: Array<{ label: string; confidence: number; attempts: number }>;
    strongCount: number;
    trackedCount: number;
  };
  behavior: {
    overallAccuracy: number;
    avgHintLevel: number;
    independenceRate: number;
    attemptsLast7Days: number;
    activeMisconceptions: Array<{ pattern: string; skillCode: string; description: string }>;
  };
  insights: string[];
}

const MASTERY_WEIGHT: Record<string, number> = {
  NOT_INTRODUCED: 0,
  INTRODUCED: 0.15,
  DEVELOPING: 0.35,
  PRACTICING: 0.55,
  PROFICIENT: 0.8,
  MASTERED: 1,
  NEEDS_REVIEW: 0.4,
};

function factLabel(operation: string, a: number, b: number): string {
  return operation === "x" ? `${a} × ${b}` : `${a} ÷ ${b}`;
}

export async function getParentDashboard(studentId: string): Promise<ParentDashboardData> {
  const student = await prisma.student.findUniqueOrThrow({ where: { id: studentId } });

  const chapters = await prisma.chapter.findMany({
    orderBy: { order: "asc" },
    include: { lessons: { include: { concepts: { include: { skills: true } } } } },
  });
  const lessonProgress = await prisma.lessonProgress.findMany({ where: { studentId } });
  const completedLessonIds = new Set(lessonProgress.filter((p) => p.completed).map((p) => p.lessonId));

  const allSkills = chapters.flatMap((c) => c.lessons.flatMap((l) => l.concepts.flatMap((co) => co.skills)));
  const skillMasteries = await prisma.skillMastery.findMany({ where: { studentId } });
  const masteryBySkill = new Map(skillMasteries.map((m) => [m.skillId, m]));

  let skillsMastered = 0;
  let skillsDeveloping = 0;
  let skillsNeedsReview = 0;
  for (const s of allSkills) {
    const state = masteryBySkill.get(s.id)?.state ?? "NOT_INTRODUCED";
    if (state === "MASTERED" || state === "PROFICIENT") skillsMastered++;
    else if (state === "NEEDS_REVIEW") skillsNeedsReview++;
    else if (state === "DEVELOPING" || state === "PRACTICING" || state === "INTRODUCED") skillsDeveloping++;
  }

  let chaptersCompleted = 0;
  let lessonsCompleted = 0;
  let lessonsTotal = 0;
  const conceptMastery: ParentDashboardData["conceptMastery"] = [];

  for (const chapter of chapters) {
    lessonsTotal += chapter.lessons.length;
    const chapterLessonsDone = chapter.lessons.filter((l) => completedLessonIds.has(l.id)).length;
    lessonsCompleted += chapterLessonsDone;
    if (chapter.lessons.length > 0 && chapterLessonsDone === chapter.lessons.length) chaptersCompleted++;

    const chapterSkills = chapter.lessons.flatMap((l) => l.concepts.flatMap((co) => co.skills));
    const sum = chapterSkills.reduce((acc, s) => acc + MASTERY_WEIGHT[masteryBySkill.get(s.id)?.state ?? "NOT_INTRODUCED"], 0);
    const percent = chapterSkills.length > 0 ? Math.round((sum / chapterSkills.length) * 100) : 0;
    conceptMastery.push({
      chapterCode: chapter.code,
      chapterTitle: chapter.title,
      worldName: chapter.worldName,
      percent,
      skillCount: chapterSkills.length,
    });
  }

  const factMasteries = await prisma.factMastery.findMany({ where: { studentId } });
  const weakFacts = factMasteries
    .filter((f) => f.attempts >= 3 && f.confidence < 0.75)
    .sort((a, b) => a.confidence - b.confidence)
    .slice(0, 8)
    .map((f) => ({ label: factLabel(f.operation, f.operandA, f.operandB), confidence: Math.round(f.confidence * 100), attempts: f.attempts }));
  const strongCount = factMasteries.filter((f) => f.confidence >= 0.75 && f.attempts >= 3).length;

  const allAttempts = await prisma.attempt.findMany({ where: { studentId } });
  const overallAccuracy = allAttempts.length > 0 ? Math.round((allAttempts.filter((a) => a.correct).length / allAttempts.length) * 100) : 0;
  const avgHintLevel = allAttempts.length > 0 ? Number((allAttempts.reduce((acc, a) => acc + a.hintLevelUsed, 0) / allAttempts.length).toFixed(1)) : 0;
  const independentAttempts = allAttempts.filter((a) => a.independent).length;
  const independenceRate = allAttempts.length > 0 ? Math.round((independentAttempts / allAttempts.length) * 100) : 0;
  const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
  const attemptsLast7Days = allAttempts.filter((a) => a.createdAt >= sevenDaysAgo).length;

  const misconceptions = await prisma.misconception.findMany({ where: { studentId, status: "ACTIVE" }, orderBy: { detectedAt: "desc" } });
  const activeMisconceptions = misconceptions.slice(0, 5).map((m) => ({
    pattern: m.pattern,
    skillCode: m.skillCode,
    description:
      m.pattern === "MULT_AS_ADDITION"
        ? "Sometimes adds the two numbers instead of multiplying them."
        : m.pattern === "DIVISION_OPERAND_CONFUSION"
          ? "Sometimes divides by a number from a similar, recently-practiced fact instead of the one in this problem."
          : m.pattern,
  }));

  const insights = await buildInsights(studentId, masteryBySkill, factMasteries, chapters, student.streakDays);

  return {
    student: { name: student.name, avatarKey: student.avatarKey, totalXp: student.totalXp, streakDays: student.streakDays },
    overall: {
      chaptersCompleted,
      chaptersTotal: chapters.length,
      lessonsCompleted,
      lessonsTotal,
      skillsMastered,
      skillsDeveloping,
      skillsNeedsReview,
      skillsTotal: allSkills.length,
    },
    conceptMastery,
    factFluency: { weakFacts, strongCount, trackedCount: factMasteries.length },
    behavior: { overallAccuracy, avgHintLevel, independenceRate, attemptsLast7Days, activeMisconceptions },
    insights,
  };
}

async function buildInsights(
  studentId: string,
  masteryBySkill: Map<string, { state: string; avgHintLevel: number }>,
  factMasteries: Array<{ operation: string; operandA: number; operandB: number; confidence: number; attempts: number }>,
  chapters: Array<{ code: string; lessons: Array<{ concepts: Array<{ skills: Array<{ id: string; code: string }> }> }> }>,
  streakDays: number,
): Promise<string[]> {
  const insights: string[] = [];

  // "Understands the concept but hasn't automated the facts yet" — the spec's headline distinction.
  for (const [factorLabel, skillCode, factor] of [
    ["×5", "ch7.mult5.facts", 5],
    ["×2", "ch7.mult2.facts", 2],
    ["×10", "ch7.mult10.facts", 10],
  ] as const) {
    const skill = findSkillByCode(chapters, skillCode);
    const mastery = skill ? masteryBySkill.get(skill.id) : undefined;
    if (!mastery || (mastery.state !== "PROFICIENT" && mastery.state !== "MASTERED")) continue;
    const relatedFacts = factMasteries.filter((f) => f.operation === "x" && (f.operandA === factor || f.operandB === factor));
    if (relatedFacts.length === 0) continue;
    const avgConfidence = relatedFacts.reduce((a, f) => a + f.confidence, 0) / relatedFacts.length;
    if (avgConfidence < 0.75) {
      insights.push(
        `Your child understands multiplication as equal groups but is still developing automatic recall of the ${factorLabel} facts.`,
      );
    }
  }

  // "Needed visual support for a specific hard case" — subtraction across zeros.
  const acrossZeroSkill = findSkillByCode(chapters, "ch3.sub.acrosszero");
  if (acrossZeroSkill) {
    const m = masteryBySkill.get(acrossZeroSkill.id);
    if (m && m.avgHintLevel >= 1.5 && (m.state === "PRACTICING" || m.state === "PROFICIENT" || m.state === "MASTERED")) {
      insights.push(
        "Your child solved most subtraction problems correctly but needed visual support when regrouping across a zero.",
      );
    }
  }

  if (streakDays >= 3) {
    insights.push(`${streakDays}-day practice streak — consistency is really paying off.`);
  }

  const needsReviewSkills = [...masteryBySkill.values()].filter((m) => m.state === "NEEDS_REVIEW");
  if (needsReviewSkills.length > 0) {
    insights.push(
      `${needsReviewSkills.length} skill${needsReviewSkills.length === 1 ? "" : "s"} that used to be solid could use a quick review — they'll resurface automatically in upcoming practice.`,
    );
  }

  if (insights.length === 0) {
    insights.push("Keep going! More practice data will unlock personalized insights here.");
  }

  return insights;
}

function findSkillByCode(
  chapters: Array<{ lessons: Array<{ concepts: Array<{ skills: Array<{ id: string; code: string }> }> }> }>,
  code: string,
) {
  for (const c of chapters) for (const l of c.lessons) for (const co of l.concepts) for (const s of co.skills) if (s.code === code) return s;
  return null;
}
