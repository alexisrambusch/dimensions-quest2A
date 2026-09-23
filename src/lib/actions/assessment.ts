"use server";

import { nanoid } from "nanoid";
import { prisma } from "@/lib/prisma";
import { generateInstance, validateResponse } from "@/lib/math-engine/registry";
import type { RenderedPrompt } from "@/lib/math-engine/types";
import { updateSkillMastery, updateFactMastery, awardXp } from "@/lib/mastery/engine";
import { checkAndAwardAchievements } from "@/lib/gamification/engine";

export interface AssessmentSummary {
  code: string;
  title: string;
  description: string;
  style: "TEST_A" | "TEST_B";
  questionCount: number;
  bestScore: { correct: number; total: number } | null;
}

/** All assessments for a chapter, with the student's best past score if any. */
export async function getChapterAssessments(chapterCode: string, studentId: string): Promise<AssessmentSummary[]> {
  const assessments = await prisma.assessment.findMany({
    where: { chapter: { code: chapterCode } },
    orderBy: { style: "asc" },
    include: {
      attempts: {
        where: { studentId, completedAt: { not: null } },
        orderBy: { completedAt: "desc" },
      },
    },
  });

  return assessments.map((a) => {
    const questionCodes: string[] = JSON.parse(a.questionsJson);
    const scores = a.attempts.map((att) => JSON.parse(att.scoreJson) as { correct: number; total: number });
    const best = scores.reduce<{ correct: number; total: number } | null>((acc, s) => {
      if (!acc || s.correct / s.total > acc.correct / acc.total) return s;
      return acc;
    }, null);
    return {
      code: a.code,
      title: a.title,
      description: a.description,
      style: a.style,
      questionCount: questionCodes.length,
      bestScore: best,
    };
  });
}

export interface AssessmentQuestionForClient {
  index: number;
  questionCode: string;
  generatorId: string;
  seed: string;
  difficulty: number;
  paramsJson: string;
  prompt: RenderedPrompt;
}

export interface AssessmentRuntime {
  attemptId: string;
  title: string;
  description: string;
  style: "TEST_A" | "TEST_B";
  questions: AssessmentQuestionForClient[];
}

/** Generate the full fixed question set for one sitting and open an attempt. */
export async function startAssessment(assessmentCode: string, studentId: string): Promise<AssessmentRuntime> {
  const assessment = await prisma.assessment.findUniqueOrThrow({ where: { code: assessmentCode } });
  const questionCodes: string[] = JSON.parse(assessment.questionsJson);
  const questionRows = await prisma.question.findMany({ where: { code: { in: questionCodes } } });
  const byCode = new Map(questionRows.map((q) => [q.code, q]));

  const questions: AssessmentQuestionForClient[] = questionCodes.map((code, index) => {
    const q = byCode.get(code);
    if (!q) throw new Error(`Assessment "${assessmentCode}" references missing question "${code}"`);
    const seed = nanoid(10);
    const params = JSON.parse(q.paramsJson);
    const instance = generateInstance(q.generatorId, seed, q.difficulty, params);
    return {
      index,
      questionCode: q.code,
      generatorId: q.generatorId,
      seed,
      difficulty: q.difficulty,
      paramsJson: q.paramsJson,
      prompt: instance.prompt,
    };
  });

  const attempt = await prisma.assessmentAttempt.create({
    data: { studentId, assessmentId: assessment.id, scoreJson: "{}" },
  });

  return {
    attemptId: attempt.id,
    title: assessment.title,
    description: assessment.description,
    style: assessment.style,
    questions,
  };
}

export interface AssessmentResult {
  correct: number;
  total: number;
  perQuestion: Array<{ questionCode: string; correct: boolean; explanation: string }>;
  xpAwarded: number;
  newBadges: Array<{ code: string; title: string; icon: string }>;
}

/** Grade every response at once (a real test: no hints, no mid-test feedback) and record results. */
export async function submitAssessment(
  studentId: string,
  attemptId: string,
  answers: Array<{
    questionCode: string;
    generatorId: string;
    seed: string;
    difficulty: number;
    paramsJson: string;
    response: unknown;
  }>,
): Promise<AssessmentResult> {
  const questionRows = await prisma.question.findMany({
    where: { code: { in: answers.map((a) => a.questionCode) } },
    include: { skills: true },
  });
  const byCode = new Map(questionRows.map((q) => [q.code, q]));

  const perQuestion: AssessmentResult["perQuestion"] = [];
  let correctCount = 0;

  for (const a of answers) {
    const params = JSON.parse(a.paramsJson);
    const instance = generateInstance(a.generatorId, a.seed, a.difficulty, params);
    const result = validateResponse(a.generatorId, a.response, instance.answer, instance.meta);
    if (result.correct) correctCount++;
    perQuestion.push({ questionCode: a.questionCode, correct: result.correct, explanation: instance.answer.explanation });

    const question = byCode.get(a.questionCode);
    if (question) {
      for (const skill of question.skills) {
        await updateSkillMastery(prisma, studentId, skill.id, {
          correct: result.correct,
          hintLevelUsed: 0,
          independent: true,
        });
      }
    }
    for (const factKey of instance.answer.facts ?? []) {
      await updateFactMastery(prisma, studentId, factKey, {
        correct: result.correct,
        responseTimeMs: 0,
        hintLevelUsed: 0,
        independent: true,
      });
    }
  }

  const total = answers.length;
  const scoreJson = JSON.stringify({ correct: correctCount, total });
  await prisma.assessmentAttempt.update({
    where: { id: attemptId },
    data: { scoreJson, completedAt: new Date() },
  });

  const xpAwarded = correctCount * 8 + (correctCount === total ? 20 : 0);
  await awardXp(prisma, studentId, xpAwarded, `Assessment: ${correctCount}/${total}`);
  const newBadges = await checkAndAwardAchievements(prisma, studentId);

  return { correct: correctCount, total, perQuestion, xpAwarded, newBadges };
}
