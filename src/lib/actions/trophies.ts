"use server";

import { prisma } from "@/lib/prisma";
import { ACHIEVEMENTS } from "@/lib/gamification/achievements";

export interface TrophyEntry {
  code: string;
  title: string;
  description: string;
  icon: string;
  earned: boolean;
  earnedAt: string | null;
}

/** The full badge roster with this student's earned status merged in, in a stable display order. */
export async function getTrophyCase(studentId: string): Promise<TrophyEntry[]> {
  const earned = await prisma.studentAchievement.findMany({
    where: { studentId },
    include: { achievement: true },
  });
  const earnedAtByCode = new Map(earned.map((e) => [e.achievement.code, e.earnedAt]));

  return ACHIEVEMENTS.map((a) => ({
    code: a.code,
    title: a.title,
    description: a.description,
    icon: a.icon,
    earned: earnedAtByCode.has(a.code),
    earnedAt: earnedAtByCode.get(a.code)?.toISOString() ?? null,
  }));
}
