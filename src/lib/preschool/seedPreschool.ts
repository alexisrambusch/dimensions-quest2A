import type { PrismaClient } from "@/generated/prisma/client";
import { ALL_SKILLS } from "./skills";

/** Upserts the preschool skill/activity bank — flat, not calendar-ordered, since the mastery engine (not a week/day position) decides what's served next. */
export async function seedPreschool(prisma: PrismaClient, say: (line: string) => void): Promise<void> {
  let activityCount = 0;

  for (const skill of ALL_SKILLS) {
    const skillRow = await prisma.preschoolSkill.upsert({
      where: { code: skill.code },
      update: {
        domain: skill.domain,
        title: skill.title,
        description: skill.description,
        prerequisiteCodes: JSON.stringify(skill.prerequisites),
      },
      create: {
        code: skill.code,
        domain: skill.domain,
        title: skill.title,
        description: skill.description,
        prerequisiteCodes: JSON.stringify(skill.prerequisites),
      },
    });

    for (const activity of skill.activities) {
      await prisma.preschoolActivity.upsert({
        where: { code: activity.code },
        update: {
          skillId: skillRow.id,
          engine: activity.engine,
          title: activity.title,
          instructions: activity.instructions,
          difficulty: activity.difficulty ?? 1,
          contentJson: JSON.stringify(activity.content),
          isCheck: !!activity.isCheck,
          masteryWeight: activity.masteryWeight ?? 1,
        },
        create: {
          code: activity.code,
          skillId: skillRow.id,
          engine: activity.engine,
          title: activity.title,
          instructions: activity.instructions,
          difficulty: activity.difficulty ?? 1,
          contentJson: JSON.stringify(activity.content),
          isCheck: !!activity.isCheck,
          masteryWeight: activity.masteryWeight ?? 1,
        },
      });
      activityCount++;
    }
  }

  say(`  Preschool skill bank: ${ALL_SKILLS.length} skills, ${activityCount} activities seeded.`);
}
