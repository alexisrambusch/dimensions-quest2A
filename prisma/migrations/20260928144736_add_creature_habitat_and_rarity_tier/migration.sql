/*
  Warnings:

  - Added the required column `habitat` to the `Creature` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "CreatureHabitat" AS ENUM ('FOREST', 'GRASSLAND', 'OCEAN', 'ARCTIC', 'DESERT', 'RAINFOREST', 'MOUNTAIN', 'WETLAND');

-- AlterEnum
ALTER TYPE "CreatureRarity" ADD VALUE 'UNCOMMON';

-- AlterTable
-- Temporary default so the NOT NULL backfill succeeds against existing rows;
-- the app's seed script immediately upserts every row with its real habitat.
ALTER TABLE "Creature" ADD COLUMN     "habitat" "CreatureHabitat" NOT NULL DEFAULT 'FOREST',
ADD COLUMN     "imagePath" TEXT;
ALTER TABLE "Creature" ALTER COLUMN "habitat" DROP DEFAULT;
