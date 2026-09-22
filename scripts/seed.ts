import "dotenv/config";
import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import { grade2a } from "../src/lib/curriculum/grade2a";
import { ACHIEVEMENTS } from "../src/lib/gamification/achievements";

const adapter = new PrismaBetterSqlite3({ url: process.env.DATABASE_URL ?? "file:./dev.db" });
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log(`Seeding curriculum: ${grade2a.sequence}`);

  const grade = await prisma.grade.upsert({
    where: { id: "grade-2a" },
    update: { name: grade2a.name, sequence: grade2a.sequence, order: 1 },
    create: { id: "grade-2a", name: grade2a.name, sequence: grade2a.sequence, order: 1 },
  });

  // Pass 1: create chapters/lessons/concepts/skills/questions without prerequisite edges,
  // since a skill's prerequisites may reference a skill defined in a later chapter file's
  // scan order (e.g. ch3 depends on ch1) that must already exist as a row.
  const skillCodeToId = new Map<string, string>();

  for (const [chapterIndex, chapter] of grade2a.chapters.entries()) {
    const chapterRow = await prisma.chapter.upsert({
      where: { code: chapter.code },
      update: {
        gradeId: grade.id,
        order: chapterIndex + 1,
        title: chapter.title,
        description: chapter.description,
        worldName: chapter.worldName,
        worldTheme: chapter.worldTheme,
      },
      create: {
        code: chapter.code,
        gradeId: grade.id,
        order: chapterIndex + 1,
        title: chapter.title,
        description: chapter.description,
        worldName: chapter.worldName,
        worldTheme: chapter.worldTheme,
      },
    });

    for (const [lessonIndex, lesson] of chapter.lessons.entries()) {
      const lessonRow = await prisma.lesson.upsert({
        where: { code: lesson.code },
        update: {
          chapterId: chapterRow.id,
          order: lessonIndex + 1,
          title: lesson.title,
          type: lesson.type,
          objective: lesson.objective,
          missionBriefing: lesson.missionBriefing,
        },
        create: {
          code: lesson.code,
          chapterId: chapterRow.id,
          order: lessonIndex + 1,
          title: lesson.title,
          type: lesson.type,
          objective: lesson.objective,
          missionBriefing: lesson.missionBriefing,
        },
      });

      for (const [conceptIndex, concept] of lesson.concepts.entries()) {
        // Concepts have no natural unique code in the spec; key on lesson+order.
        const existingConcept = await prisma.concept.findFirst({
          where: { lessonId: lessonRow.id, order: conceptIndex + 1 },
        });
        const conceptRow = existingConcept
          ? await prisma.concept.update({
              where: { id: existingConcept.id },
              data: { title: concept.title, bigIdea: concept.bigIdea },
            })
          : await prisma.concept.create({
              data: { lessonId: lessonRow.id, order: conceptIndex + 1, title: concept.title, bigIdea: concept.bigIdea },
            });

        for (const skill of concept.skills) {
          const skillRow = await prisma.skill.upsert({
            where: { code: skill.code },
            update: {
              conceptId: conceptRow.id,
              title: skill.title,
              description: skill.description,
              stage: skill.stage,
            },
            create: {
              code: skill.code,
              conceptId: conceptRow.id,
              title: skill.title,
              description: skill.description,
              stage: skill.stage,
            },
          });
          skillCodeToId.set(skill.code, skillRow.id);

          for (const q of skill.questions) {
            const questionRow = await prisma.question.upsert({
              where: { code: q.code },
              update: {
                kind: q.kind,
                stage: q.stage,
                generatorId: q.generatorId,
                paramsJson: JSON.stringify(q.params),
                difficulty: q.difficulty,
                skills: { set: [{ id: skillRow.id }] },
              },
              create: {
                code: q.code,
                kind: q.kind,
                stage: q.stage,
                generatorId: q.generatorId,
                paramsJson: JSON.stringify(q.params),
                difficulty: q.difficulty,
                skills: { connect: [{ id: skillRow.id }] },
              },
            });
            void questionRow;
          }
        }
      }
    }
    console.log(`  Chapter ${chapter.code}: ${chapter.lessons.length} lessons seeded.`);
  }

  // Pass 2: wire up prerequisite edges now that every skill exists.
  let edgeCount = 0;
  for (const chapter of grade2a.chapters) {
    for (const lesson of chapter.lessons) {
      for (const concept of lesson.concepts) {
        for (const skill of concept.skills) {
          const skillId = skillCodeToId.get(skill.code);
          if (!skillId) continue;
          for (const prereqCode of skill.prerequisites) {
            const prereqId = skillCodeToId.get(prereqCode);
            if (!prereqId) {
              console.warn(`  WARNING: prerequisite "${prereqCode}" for "${skill.code}" not found; skipping.`);
              continue;
            }
            await prisma.skillPrerequisite.upsert({
              where: { skillId_prerequisiteId: { skillId, prerequisiteId: prereqId } },
              update: {},
              create: { skillId, prerequisiteId: prereqId },
            });
            edgeCount++;
          }
        }
      }
    }
  }
  console.log(`  Wired ${edgeCount} prerequisite edges.`);

  // Achievements
  for (const a of ACHIEVEMENTS) {
    const skillId = a.skillCode ? skillCodeToId.get(a.skillCode) : undefined;
    await prisma.achievement.upsert({
      where: { code: a.code },
      update: { title: a.title, description: a.description, icon: a.icon, skillId: skillId ?? null },
      create: { code: a.code, title: a.title, description: a.description, icon: a.icon, skillId: skillId ?? null },
    });
  }
  console.log(`  Seeded ${ACHIEVEMENTS.length} achievements.`);

  // Default household: one parent profile (this developer's account) and one student profile
  // so the app is immediately usable without a signup flow.
  const parent = await prisma.parent.upsert({
    where: { email: "alexisrambusch@gmail.com" },
    update: {},
    create: { email: "alexisrambusch@gmail.com", name: "Parent" },
  });

  const existingStudent = await prisma.student.findFirst({ where: { parentId: parent.id } });
  if (!existingStudent) {
    await prisma.student.create({
      data: {
        parentId: parent.id,
        name: "Explorer",
        avatarKey: "fox",
        currentGradeId: grade.id,
      },
    });
    console.log("  Created default student profile 'Explorer'.");
  }

  console.log("Seed complete.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
