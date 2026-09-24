-- AlterEnum
ALTER TYPE "LessonPhase" ADD VALUE 'LEARN';

-- AlterTable
ALTER TABLE "Lesson" ADD COLUMN     "workedExampleJson" TEXT;
