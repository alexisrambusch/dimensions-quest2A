"use server";

import { nanoid } from "nanoid";
import { prisma } from "@/lib/prisma";
import { generateInstance, validateResponse } from "@/lib/math-engine/registry";
import type { RenderedPrompt } from "@/lib/math-engine/types";
import { updateSkillMastery, updateFactMastery, awardXp } from "@/lib/mastery/engine";
import { detectMisconception, recordMisconceptionSignal, getActiveMisconceptions } from "@/lib/mastery/misconceptions";
import { getHintLadder } from "@/lib/hints/ruleBasedHints";
import { getAiEnhancedHint } from "@/lib/hints/aiTutor";
import { checkAndAwardAchievements, touchDailyStreak } from "@/lib/gamification/engine";
import type { LessonPhase } from "@/generated/prisma/enums";

export async function getLessonRuntime(lessonCode: string, studentId: string) {
  const lesson = await prisma.lesson.findUniqueOrThrow({
    where: { code: lessonCode },
    include: {
      chapter: true,
      concepts: { orderBy: { order: "asc" }, include: { skills: true } },
    },
  });
  const progress = await prisma.lessonProgress.findUnique({
    where: { studentId_lessonId: { studentId, lessonId: lesson.id } },
  });

  const skillIds = lesson.concepts.flatMap((c) => c.skills.map((s) => s.id));
  const masteries = await prisma.skillMastery.findMany({ where: { studentId, skillId: { in: skillIds } } });
  const masteryBySkill = new Map(masteries.map((m) => [m.skillId, m]));

  return {
    lesson: {
      id: lesson.id,
      code: lesson.code,
      title: lesson.title,
      type: lesson.type,
      objective: lesson.objective,
      missionBriefing: lesson.missionBriefing,
      workedExample: lesson.workedExampleJson ? JSON.parse(lesson.workedExampleJson) : null,
      chapterTitle: lesson.chapter.title,
      worldName: lesson.chapter.worldName,
    },
    concepts: lesson.concepts.map((c) => ({
      title: c.title,
      bigIdea: c.bigIdea,
      skills: c.skills.map((s) => ({
        id: s.id,
        code: s.code,
        title: s.title,
        description: s.description,
        stage: s.stage,
        masteryState: masteryBySkill.get(s.id)?.state ?? "NOT_INTRODUCED",
      })),
    })),
    phase: progress?.phase ?? "BRIEFING",
    completed: progress?.completed ?? false,
  };
}

export async function startSession(studentId: string, lessonId: string): Promise<string> {
  await touchDailyStreak(prisma, studentId);
  const session = await prisma.learningSession.create({ data: { studentId, lessonId } });
  return session.id;
}

export async function setLessonPhase(studentId: string, lessonId: string, phase: LessonPhase) {
  await prisma.lessonProgress.upsert({
    where: { studentId_lessonId: { studentId, lessonId } },
    update: { phase, completed: phase === "COMPLETE" },
    create: { studentId, lessonId, phase, completed: phase === "COMPLETE" },
  });
}

export async function endSession(sessionId: string) {
  const attempts = await prisma.attempt.findMany({ where: { sessionId } });
  const xpEarned = attempts.length; // xp itself is tracked via XpEvent; this is just a session summary count
  await prisma.learningSession.update({ where: { id: sessionId }, data: { endedAt: new Date(), xpEarned } });
}

export interface QuestionForClient {
  questionId: string;
  questionCode: string;
  generatorId: string;
  seed: string;
  difficulty: number;
  paramsJson: string;
  prompt: RenderedPrompt;
  skillId: string;
  skillCode: string;
  servedAt: number;
}

/**
 * Pull a skill due for spaced review from outside the current lesson — the
 * app never lets previously-learned material simply disappear. Weaker
 * (NEEDS_REVIEW) skills are favored over merely-due PROFICIENT/MASTERED ones.
 */
async function pickDueReviewSkill(studentId: string, excludeSkillIds: string[]) {
  const due = await prisma.skillMastery.findMany({
    where: {
      studentId,
      skillId: { notIn: excludeSkillIds },
      state: { notIn: ["NOT_INTRODUCED"] },
      nextReviewDueAt: { lte: new Date() },
    },
    include: { skill: { include: { questions: true } } },
    orderBy: { nextReviewDueAt: "asc" },
    take: 10,
  });
  if (due.length === 0) return null;
  const weighted = due.flatMap((m) => Array.from({ length: m.state === "NEEDS_REVIEW" ? 3 : 1 }, () => m.skill));
  return weighted[Math.floor(Math.random() * weighted.length)] ?? due[0].skill;
}

/** Pick the next question for the lesson: mostly the current skill, with a slice of spaced review (spec §16: ~70/20/10 mix of current/recent/older material). */
export async function nextQuestionForLesson(
  studentId: string,
  lessonCode: string,
  excludeQuestionCodes: string[] = [],
): Promise<QuestionForClient> {
  const lesson = await prisma.lesson.findUniqueOrThrow({
    where: { code: lessonCode },
    include: { concepts: { include: { skills: { include: { questions: true } } } } },
  });
  const skills = lesson.concepts.flatMap((c) => c.skills);

  let skill = null as (typeof skills)[number] | null;
  if (Math.random() < 0.3) {
    skill = await pickDueReviewSkill(studentId, skills.map((s) => s.id));
  }

  if (!skill) {
    const masteries = await prisma.skillMastery.findMany({
      where: { studentId, skillId: { in: skills.map((s) => s.id) } },
    });
    const masteryBySkill = new Map(masteries.map((m) => [m.skillId, m]));

    // Weight: skills with fewer attempts or lower accuracy get picked more often.
    const weighted = skills.flatMap((s) => {
      const m = masteryBySkill.get(s.id);
      const weight = !m ? 3 : m.state === "MASTERED" ? 1 : m.state === "NEEDS_REVIEW" ? 4 : 2;
      return Array.from({ length: weight }, () => s);
    });
    skill = weighted[Math.floor(Math.random() * weighted.length)] ?? skills[0];
  }

  const available = skill.questions.filter((q) => !excludeQuestionCodes.includes(q.code));
  const pool = available.length > 0 ? available : skill.questions;
  const question = pool[Math.floor(Math.random() * pool.length)];

  const seed = nanoid(10);
  const params = JSON.parse(question.paramsJson);
  const instance = generateInstance(question.generatorId, seed, question.difficulty, params);

  return {
    questionId: question.id,
    questionCode: question.code,
    generatorId: question.generatorId,
    seed,
    difficulty: question.difficulty,
    paramsJson: question.paramsJson,
    prompt: instance.prompt,
    skillId: skill.id,
    skillCode: skill.code,
    servedAt: Date.now(),
  };
}

export interface HintResult {
  level: number;
  text: string;
  source: "rule" | "ai";
}

export async function requestHint(input: {
  studentId: string;
  studentName: string;
  generatorId: string;
  seed: string;
  difficulty: number;
  paramsJson: string;
  promptText: string;
  level: number;
  studentResponse?: unknown;
  skillCode?: string;
}): Promise<HintResult> {
  const params = JSON.parse(input.paramsJson);
  const instance = generateInstance(input.generatorId, input.seed, input.difficulty, params);
  const ruleBasedText = getHintLadder({ generatorId: input.generatorId, meta: instance.meta, promptText: input.promptText })[
    input.level - 1
  ];

  let misconceptionNote: string | undefined;
  if (input.skillCode) {
    const active = await getActiveMisconceptions(prisma, input.studentId, input.skillCode);
    if (active.length > 0) {
      const evidence = JSON.parse(active[0].evidenceJson);
      misconceptionNote =
        active[0].pattern === "MULT_AS_ADDITION"
          ? "This student sometimes adds the two numbers instead of multiplying — gently distinguish the two operations."
          : active[0].pattern === "DIVISION_OPERAND_CONFUSION"
            ? "This student sometimes divides by the wrong number from a similar fact family — help them re-identify which number is the divisor."
            : undefined;
      void evidence;
    }
  }

  const aiText = await getAiEnhancedHint({
    studentName: input.studentName,
    questionText: input.promptText,
    ruleBasedHint: ruleBasedText,
    level: input.level,
    studentResponse: input.studentResponse,
    recentMisconception: misconceptionNote,
  });

  return { level: input.level, text: aiText ?? ruleBasedText, source: aiText ? "ai" : "rule" };
}

export interface AttemptResult {
  correct: boolean;
  correctValue: unknown;
  explanation: string;
  xpAwarded: number;
  coinsAwarded: number;
  leveledUp: boolean;
  newLevel: number;
  masteryState: string;
  newBadges: Array<{ code: string; title: string; icon: string }>;
  reteachSuggested: boolean;
  misconceptionDescription?: string;
}

export async function submitAttempt(input: {
  studentId: string;
  sessionId?: string;
  questionId: string;
  questionCode: string;
  generatorId: string;
  seed: string;
  difficulty: number;
  paramsJson: string;
  skillId: string;
  response: unknown;
  responseTimeMs: number;
  hintLevelUsed: number;
}): Promise<AttemptResult> {
  const params = JSON.parse(input.paramsJson);
  const instance = generateInstance(input.generatorId, input.seed, input.difficulty, params);
  const result = validateResponse(input.generatorId, input.response, instance.answer, instance.meta);
  const independent = input.hintLevelUsed === 0;

  const questionInstance = await prisma.questionInstance.create({
    data: {
      questionId: input.questionId,
      seed: input.seed,
      promptJson: JSON.stringify(instance.prompt),
      answerJson: JSON.stringify(instance.answer),
    },
  });

  const attempt = await prisma.attempt.create({
    data: {
      studentId: input.studentId,
      questionInstanceId: questionInstance.id,
      sessionId: input.sessionId,
      responseJson: JSON.stringify(input.response),
      correct: result.correct,
      hintLevelUsed: input.hintLevelUsed,
      responseTimeMs: input.responseTimeMs,
      independent,
    },
  });

  if (input.hintLevelUsed > 0) {
    const ladder = getHintLadder({ generatorId: input.generatorId, meta: instance.meta, promptText: instance.prompt.text });
    await prisma.hint.createMany({
      data: Array.from({ length: input.hintLevelUsed }, (_, i) => ({
        attemptId: attempt.id,
        level: i + 1,
        content: ladder[i] ?? "",
        source: "rule",
      })),
    });
  }

  const skill = await prisma.skill.findUniqueOrThrow({ where: { id: input.skillId } });
  const masteryState = await updateSkillMastery(prisma, input.studentId, input.skillId, {
    correct: result.correct,
    hintLevelUsed: input.hintLevelUsed,
    independent,
  });

  for (const factKey of instance.answer.facts ?? []) {
    await updateFactMastery(prisma, input.studentId, factKey, {
      correct: result.correct,
      responseTimeMs: input.responseTimeMs,
      hintLevelUsed: input.hintLevelUsed,
      independent,
    });
  }

  let reteachSuggested = false;
  let misconceptionDescription: string | undefined;
  if (!result.correct) {
    const signal = detectMisconception(instance.meta, input.response);
    if (signal) {
      const { shouldReteach } = await recordMisconceptionSignal(prisma, input.studentId, skill.code, signal);
      reteachSuggested = shouldReteach;
      misconceptionDescription = signal.description;
    }
  }

  const baseXp = result.correct ? 10 : 2;
  const hintPenalty = Math.min(baseXp - 1, input.hintLevelUsed * 2);
  const xpAwarded = result.correct ? Math.max(2, baseXp - hintPenalty) : baseXp;
  const xpResult = await awardXp(prisma, input.studentId, xpAwarded, result.correct ? `Correct: ${input.questionCode}` : `Attempt: ${input.questionCode}`);

  const badgeResult = await checkAndAwardAchievements(prisma, input.studentId);

  return {
    correct: result.correct,
    correctValue: instance.answer.value,
    explanation: instance.answer.explanation,
    xpAwarded,
    coinsAwarded: xpResult.coinsAwarded + badgeResult.coinsAwarded,
    leveledUp: xpResult.leveledUp || badgeResult.leveledUp,
    newLevel: badgeResult.newLevel,
    masteryState,
    newBadges: badgeResult.newBadges,
    reteachSuggested,
    misconceptionDescription,
  };
}
