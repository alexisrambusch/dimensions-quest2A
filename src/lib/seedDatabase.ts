import type { PrismaClient } from "@/generated/prisma/client";
import { grade2a } from "./curriculum/grade2a";
import { ACHIEVEMENTS } from "./gamification/achievements";
import { ASSESSMENTS } from "./curriculum/assessments";

const HOUSEHOLD_PARENT_EMAIL = "alexisrambusch@gmail.com";

/**
 * Populates the curriculum (chapters/lessons/concepts/skills/questions),
 * prerequisite graph, achievements, assessments, and a default household.
 * Fully upsert-based, so it's safe to run more than once against the same
 * database — used both by the local `db:seed` CLI script and the one-time
 * `/api/seed` setup route for deployments where a local shell isn't handy.
 */
export async function seedDatabase(prisma: PrismaClient): Promise<string[]> {
  const log: string[] = [];
  const say = (line: string) => {
    log.push(line);
    console.log(line);
  };

  say(`Seeding curriculum: ${grade2a.sequence}`);

  const grade = await prisma.grade.upsert({
    where: { id: "grade-2a" },
    update: { name: grade2a.name, sequence: grade2a.sequence, order: 1 },
    create: { id: "grade-2a", name: grade2a.name, sequence: grade2a.sequence, order: 1 },
  });

  // Pass 1: create chapters/lessons/concepts/skills/questions without prerequisite edges,
  // since a skill's prerequisites may reference a skill defined in a later chapter file's
  // scan order (e.g. ch3 depends on ch1) that must already exist as a row.
  const skillCodeToId = new Map<string, string>();
  const questionCodeToId = new Map<string, string>();
  const chapterCodeToId = new Map<string, string>();

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
          workedExampleJson: lesson.workedExample ? JSON.stringify(lesson.workedExample) : null,
        },
        create: {
          code: lesson.code,
          chapterId: chapterRow.id,
          order: lessonIndex + 1,
          title: lesson.title,
          type: lesson.type,
          objective: lesson.objective,
          missionBriefing: lesson.missionBriefing,
          workedExampleJson: lesson.workedExample ? JSON.stringify(lesson.workedExample) : null,
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
            questionCodeToId.set(q.code, questionRow.id);
          }
        }
      }
    }
    chapterCodeToId.set(chapter.code, chapterRow.id);
    say(`  Chapter ${chapter.code}: ${chapter.lessons.length} lessons seeded.`);
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
              say(`  WARNING: prerequisite "${prereqCode}" for "${skill.code}" not found; skipping.`);
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
  say(`  Wired ${edgeCount} prerequisite edges.`);

  // Achievements
  for (const a of ACHIEVEMENTS) {
    const skillId = a.skillCode ? skillCodeToId.get(a.skillCode) : undefined;
    await prisma.achievement.upsert({
      where: { code: a.code },
      update: { title: a.title, description: a.description, icon: a.icon, skillId: skillId ?? null },
      create: { code: a.code, title: a.title, description: a.description, icon: a.icon, skillId: skillId ?? null },
    });
  }
  say(`  Seeded ${ACHIEVEMENTS.length} achievements.`);

  // Assessments (Test A / Test B) — curated subsets of already-seeded questions.
  let assessmentCount = 0;
  for (const a of ASSESSMENTS) {
    const chapterId = chapterCodeToId.get(a.chapterCode);
    if (!chapterId) {
      say(`  WARNING: chapter "${a.chapterCode}" not found for assessment "${a.code}"; skipping.`);
      continue;
    }
    const missing = a.questionCodes.filter((qc) => !questionCodeToId.has(qc));
    if (missing.length > 0) {
      say(`  WARNING: assessment "${a.code}" references unknown question codes: ${missing.join(", ")}`);
    }
    await prisma.assessment.upsert({
      where: { code: a.code },
      update: {
        chapterId,
        style: a.style,
        title: a.title,
        description: a.description,
        questionsJson: JSON.stringify(a.questionCodes),
      },
      create: {
        code: a.code,
        chapterId,
        style: a.style,
        title: a.title,
        description: a.description,
        questionsJson: JSON.stringify(a.questionCodes),
      },
    });
    assessmentCount++;
  }
  say(`  Seeded ${assessmentCount} assessments.`);

  // Default household: one parent profile and one student profile so the
  // app is immediately usable without a signup flow.
  const parent = await prisma.parent.upsert({
    where: { email: HOUSEHOLD_PARENT_EMAIL },
    update: {},
    create: { email: HOUSEHOLD_PARENT_EMAIL, name: "Parent" },
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
    say("  Created default student profile 'Explorer'.");
  }

  say("Seed complete.");
  return log;
}
