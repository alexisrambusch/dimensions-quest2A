-- CreateEnum
CREATE TYPE "PreschoolDomain" AS ENUM ('LITERACY', 'PHONICS', 'PHONOLOGICAL_AWARENESS', 'READING', 'WRITING', 'MATH', 'SCIENCE', 'SOCIAL_STUDIES', 'SEL');

-- CreateEnum
CREATE TYPE "PreschoolMasteryLevel" AS ENUM ('NOT_STARTED', 'INTRODUCED', 'PRACTICING', 'DEVELOPING', 'PROFICIENT', 'MASTERED');

-- DropForeignKey
ALTER TABLE "PreschoolActivity" DROP CONSTRAINT "PreschoolActivity_dayId_fkey";

-- DropForeignKey
ALTER TABLE "PreschoolDay" DROP CONSTRAINT "PreschoolDay_weekId_fkey";

-- DropForeignKey
ALTER TABLE "StudentActivityProgress" DROP CONSTRAINT "StudentActivityProgress_activityId_fkey";

-- DropForeignKey
ALTER TABLE "StudentActivityProgress" DROP CONSTRAINT "StudentActivityProgress_studentId_fkey";

-- DropIndex
DROP INDEX "PreschoolActivity_dayId_order_key";

-- AlterTable
ALTER TABLE "PreschoolActivity" DROP COLUMN "dayId",
DROP COLUMN "domain",
DROP COLUMN "optional",
DROP COLUMN "order",
DROP COLUMN "type",
ADD COLUMN     "code" TEXT NOT NULL,
ADD COLUMN     "difficulty" INTEGER NOT NULL DEFAULT 1,
ADD COLUMN     "engine" TEXT NOT NULL,
ADD COLUMN     "isCheck" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "masteryWeight" INTEGER NOT NULL DEFAULT 1,
ADD COLUMN     "skillId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Student" ADD COLUMN     "isPreschool" BOOLEAN NOT NULL DEFAULT false;

-- DropTable
DROP TABLE "PreschoolDay";

-- DropTable
DROP TABLE "PreschoolWeek";

-- DropTable
DROP TABLE "StudentActivityProgress";

-- DropEnum
DROP TYPE "CurriculumDomain";

-- DropEnum
DROP TYPE "PreschoolActivityType";

-- CreateTable
CREATE TABLE "PreschoolSkill" (
    "id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "domain" "PreschoolDomain" NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "prerequisiteCodes" TEXT NOT NULL,

    CONSTRAINT "PreschoolSkill_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "StudentPreschoolAttempt" (
    "id" TEXT NOT NULL,
    "studentId" TEXT NOT NULL,
    "activityId" TEXT NOT NULL,
    "correct" BOOLEAN,
    "responseJson" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "StudentPreschoolAttempt_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "StudentPreschoolMastery" (
    "id" TEXT NOT NULL,
    "studentId" TEXT NOT NULL,
    "skillId" TEXT NOT NULL,
    "level" "PreschoolMasteryLevel" NOT NULL DEFAULT 'NOT_STARTED',
    "score" INTEGER NOT NULL DEFAULT 0,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "StudentPreschoolMastery_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "PreschoolSkill_code_key" ON "PreschoolSkill"("code");

-- CreateIndex
CREATE UNIQUE INDEX "StudentPreschoolMastery_studentId_skillId_key" ON "StudentPreschoolMastery"("studentId", "skillId");

-- CreateIndex
CREATE UNIQUE INDEX "PreschoolActivity_code_key" ON "PreschoolActivity"("code");

-- AddForeignKey
ALTER TABLE "PreschoolActivity" ADD CONSTRAINT "PreschoolActivity_skillId_fkey" FOREIGN KEY ("skillId") REFERENCES "PreschoolSkill"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StudentPreschoolAttempt" ADD CONSTRAINT "StudentPreschoolAttempt_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "Student"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StudentPreschoolAttempt" ADD CONSTRAINT "StudentPreschoolAttempt_activityId_fkey" FOREIGN KEY ("activityId") REFERENCES "PreschoolActivity"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StudentPreschoolMastery" ADD CONSTRAINT "StudentPreschoolMastery_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "Student"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StudentPreschoolMastery" ADD CONSTRAINT "StudentPreschoolMastery_skillId_fkey" FOREIGN KEY ("skillId") REFERENCES "PreschoolSkill"("id") ON DELETE CASCADE ON UPDATE CASCADE;

