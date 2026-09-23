/*
  Warnings:

  - Added the required column `code` to the `Assessment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `description` to the `Assessment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `questionsJson` to the `Assessment` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Assessment" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "code" TEXT NOT NULL,
    "chapterId" TEXT NOT NULL,
    "style" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "questionsJson" TEXT NOT NULL,
    CONSTRAINT "Assessment_chapterId_fkey" FOREIGN KEY ("chapterId") REFERENCES "Chapter" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Assessment" ("chapterId", "id", "style", "title") SELECT "chapterId", "id", "style", "title" FROM "Assessment";
DROP TABLE "Assessment";
ALTER TABLE "new_Assessment" RENAME TO "Assessment";
CREATE UNIQUE INDEX "Assessment_code_key" ON "Assessment"("code");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
