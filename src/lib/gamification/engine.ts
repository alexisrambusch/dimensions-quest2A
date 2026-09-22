import type { PrismaClient } from "@/generated/prisma/client";
import { awardXp } from "../mastery/engine";

const BADGE_XP_BONUS = 25;

async function grant(prisma: PrismaClient, studentId: string, code: string): Promise<boolean> {
  const achievement = await prisma.achievement.findUnique({ where: { code } });
  if (!achievement) return false;
  const already = await prisma.studentAchievement.findUnique({
    where: { studentId_achievementId: { studentId, achievementId: achievement.id } },
  });
  if (already) return false;
  await prisma.studentAchievement.create({ data: { studentId, achievementId: achievement.id } });
  await awardXp(prisma, studentId, BADGE_XP_BONUS, `Badge: ${achievement.title}`);
  return true;
}

/** Re-evaluate all achievement conditions for a student and grant any newly earned ones. */
export async function checkAndAwardAchievements(
  prisma: PrismaClient,
  studentId: string,
): Promise<Array<{ code: string; title: string; icon: string }>> {
  const newlyEarned: Array<{ code: string; title: string; icon: string }> = [];

  async function tryGrant(code: string) {
    if (await grant(prisma, studentId, code)) {
      const a = await prisma.achievement.findUnique({ where: { code } });
      if (a) newlyEarned.push({ code: a.code, title: a.title, icon: a.icon });
    }
  }

  const completedLessons = await prisma.lessonProgress.count({ where: { studentId, completed: true } });
  if (completedLessons >= 1) await tryGrant("first_steps");

  const chapters = await prisma.chapter.findMany({ include: { lessons: true } });
  for (const chapter of chapters) {
    const lessonIds = chapter.lessons.map((l) => l.id);
    if (lessonIds.length === 0) continue;
    const doneCount = await prisma.lessonProgress.count({
      where: { studentId, completed: true, lessonId: { in: lessonIds } },
    });
    if (doneCount === lessonIds.length) {
      const idx = ["ch1", "ch2", "ch3", "ch4", "ch5", "ch6", "ch7"].indexOf(chapter.code);
      if (idx >= 0) await tryGrant(`${chapter.code}_complete`);
    }
  }

  for (const [code, skillCode] of [
    ["fact_master_2", "ch7.mult2.facts"],
    ["fact_master_5", "ch7.mult5.facts"],
    ["fact_master_10", "ch7.mult10.facts"],
  ] as const) {
    const skill = await prisma.skill.findUnique({ where: { code: skillCode } });
    if (!skill) continue;
    const mastery = await prisma.skillMastery.findUnique({
      where: { studentId_skillId: { studentId, skillId: skill.id } },
    });
    if (mastery?.state === "MASTERED") await tryGrant(code);
  }

  const student = await prisma.student.findUnique({ where: { id: studentId } });
  if (student) {
    if (student.streakDays >= 3) await tryGrant("streak_3");
    if (student.streakDays >= 7) await tryGrant("streak_7");
  }

  const independentCorrect = await prisma.attempt.count({
    where: { studentId, correct: true, hintLevelUsed: 0, independent: true },
  });
  if (independentCorrect >= 5) await tryGrant("careful_thinker");

  return newlyEarned;
}

/** Update the daily streak counter — called once per session start. */
export async function touchDailyStreak(prisma: PrismaClient, studentId: string): Promise<void> {
  const student = await prisma.student.findUnique({ where: { id: studentId } });
  if (!student) return;
  const now = new Date();
  const last = student.lastActiveAt;
  let streakDays = student.streakDays;

  if (!last) {
    streakDays = 1;
  } else {
    const dayMs = 24 * 60 * 60 * 1000;
    const daysSince = Math.floor((startOfDay(now) - startOfDay(last)) / dayMs);
    if (daysSince === 0) {
      // same day, no change
    } else if (daysSince === 1) {
      streakDays += 1;
    } else {
      streakDays = 1;
    }
  }

  await prisma.student.update({ where: { id: studentId }, data: { streakDays, lastActiveAt: now } });
}

function startOfDay(d: Date): number {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime();
}
