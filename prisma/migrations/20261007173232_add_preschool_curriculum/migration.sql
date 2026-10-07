-- CreateEnum
CREATE TYPE "CurriculumDomain" AS ENUM ('MORNING', 'LITERACY', 'MATH', 'SCIENCE', 'SOCIAL_STUDIES', 'WRITING', 'GAME', 'READ_ALOUD', 'CREATIVE', 'MOVEMENT', 'EXTENSION');

-- CreateEnum
CREATE TYPE "PreschoolActivityType" AS ENUM ('QUESTION', 'SEL_SCENARIO', 'TRACE', 'EXPERIMENT', 'READ_ALOUD', 'JOURNAL', 'PARENT_ACTIVITY', 'MOVEMENT_BREAK', 'MORNING_ROUTINE');

-- CreateTable
CREATE TABLE "PreschoolWeek" (
    "id" TEXT NOT NULL,
    "number" INTEGER NOT NULL,
    "theme" TEXT NOT NULL,

    CONSTRAINT "PreschoolWeek_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PreschoolDay" (
    "id" TEXT NOT NULL,
    "weekId" TEXT NOT NULL,
    "dayNumber" INTEGER NOT NULL,
    "title" TEXT NOT NULL,

    CONSTRAINT "PreschoolDay_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PreschoolActivity" (
    "id" TEXT NOT NULL,
    "dayId" TEXT NOT NULL,
    "order" INTEGER NOT NULL,
    "domain" "CurriculumDomain" NOT NULL,
    "type" "PreschoolActivityType" NOT NULL,
    "title" TEXT NOT NULL,
    "instructions" TEXT NOT NULL,
    "contentJson" TEXT NOT NULL,
    "optional" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "PreschoolActivity_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "StudentActivityProgress" (
    "id" TEXT NOT NULL,
    "studentId" TEXT NOT NULL,
    "activityId" TEXT NOT NULL,
    "responseJson" TEXT,
    "completedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "StudentActivityProgress_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "PreschoolWeek_number_key" ON "PreschoolWeek"("number");

-- CreateIndex
CREATE UNIQUE INDEX "PreschoolDay_weekId_dayNumber_key" ON "PreschoolDay"("weekId", "dayNumber");

-- CreateIndex
CREATE UNIQUE INDEX "PreschoolActivity_dayId_order_key" ON "PreschoolActivity"("dayId", "order");

-- CreateIndex
CREATE UNIQUE INDEX "StudentActivityProgress_studentId_activityId_key" ON "StudentActivityProgress"("studentId", "activityId");

-- AddForeignKey
ALTER TABLE "PreschoolDay" ADD CONSTRAINT "PreschoolDay_weekId_fkey" FOREIGN KEY ("weekId") REFERENCES "PreschoolWeek"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PreschoolActivity" ADD CONSTRAINT "PreschoolActivity_dayId_fkey" FOREIGN KEY ("dayId") REFERENCES "PreschoolDay"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StudentActivityProgress" ADD CONSTRAINT "StudentActivityProgress_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "Student"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StudentActivityProgress" ADD CONSTRAINT "StudentActivityProgress_activityId_fkey" FOREIGN KEY ("activityId") REFERENCES "PreschoolActivity"("id") ON DELETE CASCADE ON UPDATE CASCADE;
