/*
  Warnings:

  - Added the required column `email` to the `ReportModel` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_ReportModel" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "email" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "number" TEXT NOT NULL,
    "field" TEXT NOT NULL,
    "bush" TEXT NOT NULL,
    "dataFile" TEXT
);
INSERT INTO "new_ReportModel" ("bush", "dataFile", "field", "id", "number", "type") SELECT "bush", "dataFile", "field", "id", "number", "type" FROM "ReportModel";
DROP TABLE "ReportModel";
ALTER TABLE "new_ReportModel" RENAME TO "ReportModel";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
