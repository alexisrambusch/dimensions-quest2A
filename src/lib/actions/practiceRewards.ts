"use server";

import { prisma } from "@/lib/prisma";
import { awardXp } from "@/lib/mastery/engine";
import { checkAndAwardAchievements } from "@/lib/gamification/engine";

export interface PracticeRewardResult {
  xpAwarded: number;
  coinsAwarded: number;
  leveledUp: boolean;
  newLevel: number;
  newBadges: Array<{ code: string; title: string; icon: string }>;
}

/** Awards XP (and any newly-earned badges/coins) for progress in a standalone Practice & Games activity. */
export async function awardPracticeReward(studentId: string, amount: number, reason: string): Promise<PracticeRewardResult> {
  const xpResult = await awardXp(prisma, studentId, amount, reason);
  const badgeResult = await checkAndAwardAchievements(prisma, studentId);
  return {
    xpAwarded: amount,
    coinsAwarded: xpResult.coinsAwarded + badgeResult.coinsAwarded,
    leveledUp: xpResult.leveledUp || badgeResult.leveledUp,
    newLevel: badgeResult.newLevel,
    newBadges: badgeResult.newBadges,
  };
}
