import type { PrismaClient } from "@/generated/prisma/client";
import { week1 } from "./weeks/week1";
import type { WeekDef } from "./weekTypes";

const WEEKS: WeekDef[] = [week1];

/** Upserts the daily preschool curriculum (weeks/days/activities) — the same pattern as seedDatabase's chapter/lesson upserts, just a simpler tree. */
export async function seedPreschool(prisma: PrismaClient, say: (line: string) => void): Promise<void> {
  for (const week of WEEKS) {
    const weekRow = await prisma.preschoolWeek.upsert({
      where: { number: week.number },
      update: { theme: week.theme },
      create: { number: week.number, theme: week.theme },
    });

    for (const day of week.days) {
      const dayRow = await prisma.preschoolDay.upsert({
        where: { weekId_dayNumber: { weekId: weekRow.id, dayNumber: day.dayNumber } },
        update: { title: day.title },
        create: { weekId: weekRow.id, dayNumber: day.dayNumber, title: day.title },
      });

      for (const [order, activity] of day.activities.entries()) {
        await prisma.preschoolActivity.upsert({
          where: { dayId_order: { dayId: dayRow.id, order } },
          update: {
            domain: activity.domain,
            type: activity.type,
            title: activity.title,
            instructions: activity.instructions,
            contentJson: JSON.stringify(activity.content),
            optional: !!activity.optional,
          },
          create: {
            dayId: dayRow.id,
            order,
            domain: activity.domain,
            type: activity.type,
            title: activity.title,
            instructions: activity.instructions,
            contentJson: JSON.stringify(activity.content),
            optional: !!activity.optional,
          },
        });
      }
    }

    say(`  Preschool Week ${week.number} (${week.theme}): ${week.days.length} days seeded.`);
  }
}
