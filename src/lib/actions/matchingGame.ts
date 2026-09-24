"use server";

import { nanoid } from "nanoid";
import { prisma } from "@/lib/prisma";
import { seededRng, shuffle } from "@/lib/math-engine/random";
import { multFactKey } from "@/lib/math-engine/facts";
import { updateFactMastery, awardXp } from "@/lib/mastery/engine";
import { checkAndAwardAchievements } from "@/lib/gamification/engine";

export interface MatchingPair {
  pairId: string;
  a: number;
  factor: number;
  product: number;
}

export interface MatchingGameBoard {
  factor: number;
  pairs: MatchingPair[];
  /** Equation cards and answer cards, each independently shuffled for the board layout. */
  equationOrder: string[]; // pairIds
  answerOrder: string[]; // pairIds
}

const PAIR_COUNT = 5;

/** A fresh "Fact Blast" board: N equations and their matching products, all face-up — the challenge is matching, not recall in isolation. */
export async function startMatchingGame(factor: number): Promise<MatchingGameBoard> {
  const rng = seededRng(nanoid(10));
  const candidates = shuffle(rng, [1, 2, 3, 4, 5, 6, 7, 8, 9]).slice(0, PAIR_COUNT);
  const pairs: MatchingPair[] = candidates.map((a) => ({
    pairId: nanoid(6),
    a,
    factor,
    product: a * factor,
  }));
  return {
    factor,
    pairs,
    equationOrder: shuffle(rng, pairs.map((p) => p.pairId)),
    answerOrder: shuffle(rng, pairs.map((p) => p.pairId)),
  };
}

export interface MatchingGameResult {
  xpAwarded: number;
  coinsAwarded: number;
  leveledUp: boolean;
  newLevel: number;
  newBadges: Array<{ code: string; title: string; icon: string }>;
}

/** Record fact-fluency evidence for a completed board and award XP — every pair eventually gets matched, so this only ever reinforces, never penalizes. */
export async function completeMatchingGame(
  studentId: string,
  pairs: Array<{ a: number; factor: number; mistakes: number }>,
): Promise<MatchingGameResult> {
  let xpAwarded = 0;
  for (const p of pairs) {
    const independent = p.mistakes === 0;
    await updateFactMastery(prisma, studentId, multFactKey(p.factor, p.a), {
      correct: true,
      responseTimeMs: 0,
      hintLevelUsed: 0,
      independent,
    });
    xpAwarded += independent ? 4 : 2;
  }
  const xpResult = await awardXp(prisma, studentId, xpAwarded, "Fact Blast game");
  const badgeResult = await checkAndAwardAchievements(prisma, studentId);
  return {
    xpAwarded,
    coinsAwarded: xpResult.coinsAwarded + badgeResult.coinsAwarded,
    leveledUp: xpResult.leveledUp || badgeResult.leveledUp,
    newLevel: badgeResult.newLevel,
    newBadges: badgeResult.newBadges,
  };
}
