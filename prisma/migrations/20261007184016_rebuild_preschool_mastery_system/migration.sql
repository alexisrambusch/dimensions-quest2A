-- This migration is written to be safely re-run from any partial state: a
-- prior deploy attempt can fail partway through (Prisma does not wrap the
-- whole file in one transaction, so earlier statements in that attempt stay
-- committed), so every statement below guards against "already done".

-- CreateEnum
DO $$ BEGIN
    CREATE TYPE "PreschoolDomain" AS ENUM ('LITERACY', 'PHONICS', 'PHONOLOGICAL_AWARENESS', 'READING', 'WRITING', 'MATH', 'SCIENCE', 'SOCIAL_STUDIES', 'SEL');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- CreateEnum
DO $$ BEGIN
    CREATE TYPE "PreschoolMasteryLevel" AS ENUM ('NOT_STARTED', 'INTRODUCED', 'PRACTICING', 'DEVELOPING', 'PROFICIENT', 'MASTERED');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- DropForeignKey
ALTER TABLE "PreschoolActivity" DROP CONSTRAINT IF EXISTS "PreschoolActivity_dayId_fkey";

-- DropForeignKey
ALTER TABLE "PreschoolDay" DROP CONSTRAINT IF EXISTS "PreschoolDay_weekId_fkey";

-- DropForeignKey
ALTER TABLE "StudentActivityProgress" DROP CONSTRAINT IF EXISTS "StudentActivityProgress_activityId_fkey";

-- DropForeignKey
ALTER TABLE "StudentActivityProgress" DROP CONSTRAINT IF EXISTS "StudentActivityProgress_studentId_fkey";

-- DropIndex
DROP INDEX IF EXISTS "PreschoolActivity_dayId_order_key";

-- This whole model is being replaced; old activity rows have no values for the
-- new required columns below (code/engine/skillId), so clear them first.
DELETE FROM "PreschoolActivity";

-- AlterTable
ALTER TABLE "PreschoolActivity" DROP COLUMN IF EXISTS "dayId",
DROP COLUMN IF EXISTS "domain",
DROP COLUMN IF EXISTS "optional",
DROP COLUMN IF EXISTS "order",
DROP COLUMN IF EXISTS "type",
ADD COLUMN IF NOT EXISTS "code" TEXT NOT NULL,
ADD COLUMN IF NOT EXISTS "difficulty" INTEGER NOT NULL DEFAULT 1,
ADD COLUMN IF NOT EXISTS "engine" TEXT NOT NULL,
ADD COLUMN IF NOT EXISTS "isCheck" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN IF NOT EXISTS "masteryWeight" INTEGER NOT NULL DEFAULT 1,
ADD COLUMN IF NOT EXISTS "skillId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Student" ADD COLUMN IF NOT EXISTS "isPreschool" BOOLEAN NOT NULL DEFAULT false;

-- DropTable
DROP TABLE IF EXISTS "PreschoolDay";

-- DropTable
DROP TABLE IF EXISTS "PreschoolWeek";

-- DropTable
DROP TABLE IF EXISTS "StudentActivityProgress";

-- DropEnum
DROP TYPE IF EXISTS "CurriculumDomain";

-- DropEnum
DROP TYPE IF EXISTS "PreschoolActivityType";

-- CreateTable
CREATE TABLE IF NOT EXISTS "PreschoolSkill" (
    "id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "domain" "PreschoolDomain" NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "prerequisiteCodes" TEXT NOT NULL,

    CONSTRAINT "PreschoolSkill_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE IF NOT EXISTS "StudentPreschoolAttempt" (
    "id" TEXT NOT NULL,
    "studentId" TEXT NOT NULL,
    "activityId" TEXT NOT NULL,
    "correct" BOOLEAN,
    "responseJson" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "StudentPreschoolAttempt_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE IF NOT EXISTS "StudentPreschoolMastery" (
    "id" TEXT NOT NULL,
    "studentId" TEXT NOT NULL,
    "skillId" TEXT NOT NULL,
    "level" "PreschoolMasteryLevel" NOT NULL DEFAULT 'NOT_STARTED',
    "score" INTEGER NOT NULL DEFAULT 0,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "StudentPreschoolMastery_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX IF NOT EXISTS "PreschoolSkill_code_key" ON "PreschoolSkill"("code");

-- CreateIndex
CREATE UNIQUE INDEX IF NOT EXISTS "StudentPreschoolMastery_studentId_skillId_key" ON "StudentPreschoolMastery"("studentId", "skillId");

-- CreateIndex
CREATE UNIQUE INDEX IF NOT EXISTS "PreschoolActivity_code_key" ON "PreschoolActivity"("code");

-- AddForeignKey
DO $$ BEGIN
    ALTER TABLE "PreschoolActivity" ADD CONSTRAINT "PreschoolActivity_skillId_fkey" FOREIGN KEY ("skillId") REFERENCES "PreschoolSkill"("id") ON DELETE CASCADE ON UPDATE CASCADE;
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- AddForeignKey
DO $$ BEGIN
    ALTER TABLE "StudentPreschoolAttempt" ADD CONSTRAINT "StudentPreschoolAttempt_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "Student"("id") ON DELETE CASCADE ON UPDATE CASCADE;
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- AddForeignKey
DO $$ BEGIN
    ALTER TABLE "StudentPreschoolAttempt" ADD CONSTRAINT "StudentPreschoolAttempt_activityId_fkey" FOREIGN KEY ("activityId") REFERENCES "PreschoolActivity"("id") ON DELETE CASCADE ON UPDATE CASCADE;
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- AddForeignKey
DO $$ BEGIN
    ALTER TABLE "StudentPreschoolMastery" ADD CONSTRAINT "StudentPreschoolMastery_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "Student"("id") ON DELETE CASCADE ON UPDATE CASCADE;
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- AddForeignKey
DO $$ BEGIN
    ALTER TABLE "StudentPreschoolMastery" ADD CONSTRAINT "StudentPreschoolMastery_skillId_fkey" FOREIGN KEY ("skillId") REFERENCES "PreschoolSkill"("id") ON DELETE CASCADE ON UPDATE CASCADE;
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;
