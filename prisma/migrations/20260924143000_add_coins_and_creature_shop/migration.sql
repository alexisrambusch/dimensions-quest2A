-- CreateEnum
CREATE TYPE "CreatureRarity" AS ENUM ('COMMON', 'RARE', 'LEGENDARY');

-- AlterTable
ALTER TABLE "Student" ADD COLUMN     "coins" INTEGER NOT NULL DEFAULT 0;

-- CreateTable
CREATE TABLE "Creature" (
    "id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "icon" TEXT NOT NULL,
    "rarity" "CreatureRarity" NOT NULL,

    CONSTRAINT "Creature_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "StudentCreature" (
    "id" TEXT NOT NULL,
    "studentId" TEXT NOT NULL,
    "creatureId" TEXT NOT NULL,
    "count" INTEGER NOT NULL DEFAULT 1,
    "firstObtainedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "StudentCreature_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Creature_code_key" ON "Creature"("code");

-- CreateIndex
CREATE UNIQUE INDEX "StudentCreature_studentId_creatureId_key" ON "StudentCreature"("studentId", "creatureId");

-- AddForeignKey
ALTER TABLE "StudentCreature" ADD CONSTRAINT "StudentCreature_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "Student"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StudentCreature" ADD CONSTRAINT "StudentCreature_creatureId_fkey" FOREIGN KEY ("creatureId") REFERENCES "Creature"("id") ON DELETE CASCADE ON UPDATE CASCADE;
