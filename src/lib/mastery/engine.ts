import type { PrismaClient } from "@/generated/prisma/client";
import type { MasteryState } from "@/generated/prisma/enums";

type Tx = Pick<PrismaClient, "skillMastery" | "factMastery" | "student" | "xpEvent" | "misconception">;

const EWMA_ALPHA = 0.3;

function ewma(prev: number, sample: number, hasHistory: boolean): number {
  if (!hasHistory) return sample;
  return prev + EWMA_ALPHA * (sample - prev);
}

/**
 * Determine mastery state from cumulative, not single-attempt, evidence:
 * accuracy trend, independence (unassisted correct answers), and hint reliance.
 * A skill that was Mastered and starts missing again drops to Needs Review
 * rather than silently decaying — the parent/child should see that explicitly.
 */
function deriveState(params: {
  previousState: MasteryState;
  attemptsCount: number;
  rollingAccuracy: number;
  avgHintLevel: number;
  independentCount: number;
  streakCorrect: number;
  justAnsweredCorrect: boolean;
}): MasteryState {
  const { previousState, attemptsCount, rollingAccuracy, avgHintLevel, independentCount, streakCorrect, justAnsweredCorrect } = params;

  if (attemptsCount === 0) return "NOT_INTRODUCED";

  const wasStrong = previousState === "MASTERED" || previousState === "PROFICIENT";
  if (wasStrong && !justAnsweredCorrect && streakCorrect === 0 && rollingAccuracy < 0.6) {
    return "NEEDS_REVIEW";
  }

  if (attemptsCount < 3) return "INTRODUCED";
  if (rollingAccuracy >= 0.9 && avgHintLevel <= 0.5 && independentCount >= 3) return "MASTERED";
  if (rollingAccuracy >= 0.75) return "PROFICIENT";
  if (rollingAccuracy >= 0.5) return "PRACTICING";
  return "DEVELOPING";
}

export async function updateSkillMastery(
  prisma: Tx,
  studentId: string,
  skillId: string,
  outcome: { correct: boolean; hintLevelUsed: number; independent: boolean },
): Promise<MasteryState> {
  const existing = await prisma.skillMastery.findUnique({ where: { studentId_skillId: { studentId, skillId } } });
  const hasHistory = !!existing && existing.attemptsCount > 0;

  const attemptsCount = (existing?.attemptsCount ?? 0) + 1;
  const correctCount = (existing?.correctCount ?? 0) + (outcome.correct ? 1 : 0);
  const independentCount = (existing?.independentCount ?? 0) + (outcome.independent && outcome.correct ? 1 : 0);
  const rollingAccuracy = ewma(existing?.rollingAccuracy ?? 0, outcome.correct ? 1 : 0, hasHistory);
  const avgHintLevel = ewma(existing?.avgHintLevel ?? 0, outcome.hintLevelUsed, hasHistory);
  const streakCorrect = outcome.correct ? (existing?.streakCorrect ?? 0) + 1 : 0;

  const state = deriveState({
    previousState: existing?.state ?? "NOT_INTRODUCED",
    attemptsCount,
    rollingAccuracy,
    avgHintLevel,
    independentCount,
    streakCorrect,
    justAnsweredCorrect: outcome.correct,
  });

  const nextReviewDueAt = computeNextReviewDate(state, streakCorrect);

  await prisma.skillMastery.upsert({
    where: { studentId_skillId: { studentId, skillId } },
    update: {
      state,
      attemptsCount,
      correctCount,
      independentCount,
      rollingAccuracy,
      avgHintLevel,
      streakCorrect,
      lastPracticedAt: new Date(),
      nextReviewDueAt,
    },
    create: {
      studentId,
      skillId,
      state,
      attemptsCount,
      correctCount,
      independentCount,
      rollingAccuracy,
      avgHintLevel,
      streakCorrect,
      lastPracticedAt: new Date(),
      nextReviewDueAt,
    },
  });

  return state;
}

function computeNextReviewDate(state: MasteryState, streakCorrect: number): Date {
  const now = Date.now();
  const dayMs = 24 * 60 * 60 * 1000;
  // Weaker skills come back sooner; mastered skills space out but never disappear.
  const daysByState: Record<MasteryState, number> = {
    NOT_INTRODUCED: 0,
    INTRODUCED: 1,
    DEVELOPING: 1,
    PRACTICING: 2,
    PROFICIENT: 4,
    MASTERED: Math.min(14, 5 + streakCorrect),
    NEEDS_REVIEW: 0,
  };
  return new Date(now + daysByState[state] * dayMs);
}

function factMasteryState(attempts: number, confidence: number): MasteryState {
  if (attempts === 0) return "NOT_INTRODUCED";
  if (attempts < 3) return "INTRODUCED";
  if (confidence >= 0.9) return "MASTERED";
  if (confidence >= 0.75) return "PROFICIENT";
  if (confidence >= 0.5) return "PRACTICING";
  return "DEVELOPING";
}

export async function updateFactMastery(
  prisma: Tx,
  studentId: string,
  factKey: string,
  outcome: { correct: boolean; responseTimeMs: number; hintLevelUsed: number; independent: boolean },
): Promise<void> {
  const [operation, aStr, bStr] = factKey.split(":");
  const operandA = Number(aStr);
  const operandB = Number(bStr);
  const existing = await prisma.factMastery.findUnique({
    where: { studentId_factKey: { studentId, factKey } },
  });

  const attempts = (existing?.attempts ?? 0) + 1;
  const correct = (existing?.correct ?? 0) + (outcome.correct ? 1 : 0);
  const incorrect = (existing?.incorrect ?? 0) + (outcome.correct ? 0 : 1);
  const avgResponseMs = Math.round(
    ((existing?.avgResponseMs ?? outcome.responseTimeMs) * (attempts - 1) + outcome.responseTimeMs) / attempts,
  );
  const avgHintLevel = ewma(existing?.avgHintLevel ?? 0, outcome.hintLevelUsed, attempts > 1);
  // Confidence tracks independent, unassisted correctness specifically — the
  // spec is explicit that speed/assisted correctness is not the same signal.
  const independentAttempts = attempts; // approximation: all attempts count toward the denominator
  const priorIndependentCorrect = (existing?.confidence ?? 0) * (existing ? existing.attempts : 0);
  const independentCorrect = priorIndependentCorrect + (outcome.correct && outcome.independent ? 1 : 0);
  const confidence = independentCorrect / independentAttempts;

  await prisma.factMastery.upsert({
    where: { studentId_factKey: { studentId, factKey } },
    update: {
      attempts,
      correct,
      incorrect,
      avgResponseMs,
      avgHintLevel,
      confidence,
      mastery: factMasteryState(attempts, confidence),
      lastPracticedAt: new Date(),
    },
    create: {
      studentId,
      operation,
      operandA,
      operandB,
      factKey,
      attempts,
      correct,
      incorrect,
      avgResponseMs,
      avgHintLevel,
      confidence,
      mastery: factMasteryState(attempts, confidence),
      lastPracticedAt: new Date(),
    },
  });
}

export async function awardXp(prisma: Tx, studentId: string, amount: number, reason: string): Promise<void> {
  await prisma.xpEvent.create({ data: { studentId, amount, reason } });
  await prisma.student.update({ where: { id: studentId }, data: { totalXp: { increment: amount } } });
}
