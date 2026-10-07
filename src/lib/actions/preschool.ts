"use server";

import { prisma } from "@/lib/prisma";
import { awardXp } from "@/lib/mastery/engine";
import { checkAndAwardAchievements } from "@/lib/gamification/engine";
import { levelForScore, PREREQUISITE_READY_LEVELS, CHECK_READY_LEVELS } from "@/lib/preschool/mastery";
import { PreschoolMasteryLevel } from "@/generated/prisma/enums";
import type {
  DragSortContent,
  HuntContent,
  MatchPairsContent,
  StickerCountContent,
  TapAnswerContent,
  TraceContent,
} from "@/lib/preschool/types";

const GAME_XP = 4;
const CHECK_CORRECT_XP = 6;
const CHECK_INCORRECT_XP = 1;
const MASTERY_LEVEL_UP_XP = 15;

export type PreschoolActivityForClient =
  | { id: string; code: string; skillCode: string; skillTitle: string; domain: string; engine: "hunt"; title: string; instructions: string; isCheck: boolean; content: HuntContent }
  | { id: string; code: string; skillCode: string; skillTitle: string; domain: string; engine: "stickerCount"; title: string; instructions: string; isCheck: boolean; content: StickerCountContent }
  | { id: string; code: string; skillCode: string; skillTitle: string; domain: string; engine: "dragSort"; title: string; instructions: string; isCheck: boolean; content: DragSortContent }
  | { id: string; code: string; skillCode: string; skillTitle: string; domain: string; engine: "matchPairs"; title: string; instructions: string; isCheck: boolean; content: MatchPairsContent }
  | { id: string; code: string; skillCode: string; skillTitle: string; domain: string; engine: "trace"; title: string; instructions: string; isCheck: boolean; content: TraceContent }
  | { id: string; code: string; skillCode: string; skillTitle: string; domain: string; engine: "tapAnswer"; title: string; instructions: string; isCheck: boolean; content: TapAnswerContent };

function substituteStudentName<T>(content: T, studentName: string): T {
  return JSON.parse(JSON.stringify(content).replaceAll("__STUDENT_NAME__", studentName));
}

function formatActivity(
  activity: { id: string; code: string; engine: string; title: string; instructions: string; isCheck: boolean; contentJson: string },
  skill: { code: string; title: string; domain: string },
  studentName: string,
): PreschoolActivityForClient {
  const content = substituteStudentName(JSON.parse(activity.contentJson), studentName);
  return {
    id: activity.id,
    code: activity.code,
    skillCode: skill.code,
    skillTitle: skill.title,
    domain: skill.domain,
    engine: activity.engine as PreschoolActivityForClient["engine"],
    title: activity.title,
    instructions: activity.instructions,
    isCheck: activity.isCheck,
    content,
  } as PreschoolActivityForClient;
}

/**
 * Picks the single best next activity for this student, purely from current
 * skill mastery — there is no week/day position. A skill becomes eligible
 * once every prerequisite is at least PRACTICING; within an eligible skill,
 * ungraded teaching games are always served before any graded check, and a
 * check only enters the rotation once the skill itself has reached
 * PRACTICING (mixed in ~30% of the time after that, never exclusively).
 */
export async function getNextPreschoolActivity(studentId: string): Promise<PreschoolActivityForClient | null> {
  const [skills, masteryRows, student] = await Promise.all([
    prisma.preschoolSkill.findMany({ include: { activities: true } }),
    prisma.studentPreschoolMastery.findMany({ where: { studentId } }),
    prisma.student.findUniqueOrThrow({ where: { id: studentId }, select: { name: true } }),
  ]);

  const masteryBySkillId = new Map(masteryRows.map((m) => [m.skillId, m]));
  const levelByCode = new Map(skills.map((s) => [s.code, masteryBySkillId.get(s.id)?.level ?? PreschoolMasteryLevel.NOT_STARTED]));

  function prereqsReady(skill: (typeof skills)[number]): boolean {
    const codes = JSON.parse(skill.prerequisiteCodes) as string[];
    return codes.every((c) => PREREQUISITE_READY_LEVELS.includes(levelByCode.get(c) ?? PreschoolMasteryLevel.NOT_STARTED));
  }

  const candidates = skills.filter((s) => s.activities.length > 0 && prereqsReady(s) && (masteryBySkillId.get(s.id)?.level ?? PreschoolMasteryLevel.NOT_STARTED) !== PreschoolMasteryLevel.MASTERED);
  if (candidates.length === 0) return null;

  candidates.sort((a, b) => (masteryBySkillId.get(a.id)?.score ?? 0) - (masteryBySkillId.get(b.id)?.score ?? 0));
  const reviewPool = candidates.filter((s) => CHECK_READY_LEVELS.includes(masteryBySkillId.get(s.id)?.level ?? PreschoolMasteryLevel.NOT_STARTED));
  const chosenSkill = reviewPool.length > 0 && Math.random() < 0.25 ? reviewPool[Math.floor(Math.random() * reviewPool.length)] : candidates[0];

  const skillLevel = masteryBySkillId.get(chosenSkill.id)?.level ?? PreschoolMasteryLevel.NOT_STARTED;
  const checkReady = CHECK_READY_LEVELS.includes(skillLevel);

  const attempted = new Set(
    (
      await prisma.studentPreschoolAttempt.findMany({
        where: { studentId, activityId: { in: chosenSkill.activities.map((a) => a.id) } },
        select: { activityId: true },
      })
    ).map((a) => a.activityId),
  );

  function pick(pool: (typeof chosenSkill.activities)) {
    const unseen = pool.filter((a) => !attempted.has(a.id));
    const list = unseen.length > 0 ? unseen : pool;
    return list[Math.floor(Math.random() * list.length)];
  }

  const games = [...chosenSkill.activities].filter((a) => !a.isCheck).sort((a, b) => a.difficulty - b.difficulty);
  const checks = chosenSkill.activities.filter((a) => a.isCheck);

  let activity;
  if (!checkReady || games.length === 0) {
    activity = games.find((a) => !attempted.has(a.id)) ?? games[0] ?? checks[0];
  } else {
    activity = Math.random() < 0.3 && checks.length > 0 ? pick(checks) : pick(games.length > 0 ? games : checks);
  }
  if (!activity) return null;

  return formatActivity(activity, chosenSkill, student.name);
}

export interface PreschoolAttemptResult {
  xpAwarded: number;
  coinsAwarded: number;
  leveledUp: boolean;
  newLevel: number;
  newBadges: Array<{ code: string; title: string; icon: string }>;
  skillTitle: string;
  masteryLevel: PreschoolMasteryLevel | null;
  masteryLeveledUp: boolean;
}

/** Records one attempt. `correct` is null for an ungraded teaching game (always counts as a successful rep); for a graded check, only a correct answer counts toward mastery. */
export async function recordPreschoolAttempt(studentId: string, activityId: string, correct: boolean | null, response?: unknown): Promise<PreschoolAttemptResult> {
  const activity = await prisma.preschoolActivity.findUniqueOrThrow({ where: { id: activityId }, include: { skill: true } });

  await prisma.studentPreschoolAttempt.create({
    data: { studentId, activityId, correct, responseJson: response !== undefined ? JSON.stringify(response) : null },
  });

  const xpAwarded = activity.isCheck ? (correct ? CHECK_CORRECT_XP : CHECK_INCORRECT_XP) : GAME_XP;
  const xpResult = await awardXp(prisma, studentId, xpAwarded, `Preschool: ${activity.title}`);
  let coinsAwarded = xpResult.coinsAwarded;
  let leveledUp = xpResult.leveledUp;
  let newLevel = xpResult.newLevel;

  let masteryLevel: PreschoolMasteryLevel | null = null;
  let masteryLeveledUp = false;
  const countsTowardMastery = !activity.isCheck || correct === true;
  if (countsTowardMastery) {
    const existing = await prisma.studentPreschoolMastery.findUnique({ where: { studentId_skillId: { studentId, skillId: activity.skillId } } });
    const prevLevel = existing?.level ?? PreschoolMasteryLevel.NOT_STARTED;
    const newScore = (existing?.score ?? 0) + activity.masteryWeight;
    const computedLevel = levelForScore(newScore);
    await prisma.studentPreschoolMastery.upsert({
      where: { studentId_skillId: { studentId, skillId: activity.skillId } },
      update: { score: newScore, level: computedLevel },
      create: { studentId, skillId: activity.skillId, score: newScore, level: computedLevel },
    });
    masteryLevel = computedLevel;
    masteryLeveledUp = computedLevel !== prevLevel;
    if (masteryLeveledUp) {
      const bonus = await awardXp(prisma, studentId, MASTERY_LEVEL_UP_XP, `Mastery up: ${activity.skill.title} -> ${computedLevel}`);
      coinsAwarded += bonus.coinsAwarded;
      leveledUp = leveledUp || bonus.leveledUp;
      newLevel = bonus.leveledUp ? bonus.newLevel : newLevel;
    }
  }

  const badgeResult = await checkAndAwardAchievements(prisma, studentId);
  coinsAwarded += badgeResult.coinsAwarded;
  leveledUp = leveledUp || badgeResult.leveledUp;
  newLevel = badgeResult.leveledUp ? badgeResult.newLevel : newLevel;

  return { xpAwarded, coinsAwarded, leveledUp, newLevel, newBadges: badgeResult.newBadges, skillTitle: activity.skill.title, masteryLevel, masteryLeveledUp };
}

export interface PreschoolSkillProgress {
  code: string;
  title: string;
  domain: string;
  level: PreschoolMasteryLevel;
}

/** A simple per-skill mastery readout — the seed of a future preschool parent dashboard. */
export async function getPreschoolProgress(studentId: string): Promise<PreschoolSkillProgress[]> {
  const skills = await prisma.preschoolSkill.findMany({
    include: { mastery: { where: { studentId } } },
  });
  return skills.map((s) => ({
    code: s.code,
    title: s.title,
    domain: s.domain,
    level: s.mastery[0]?.level ?? PreschoolMasteryLevel.NOT_STARTED,
  }));
}
