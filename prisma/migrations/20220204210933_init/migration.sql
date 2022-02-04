/*
  Warnings:

  - You are about to drop the column `test` on the `OilWellModel` table. All the data in the column will be lost.
  - Added the required column `detail` to the `OilWellModel` table without a default value. This is not possible if the table is not empty.
  - Added the required column `end` to the `OilWellModel` table without a default value. This is not possible if the table is not empty.
  - Added the required column `start` to the `OilWellModel` table without a default value. This is not possible if the table is not empty.
  - Added the required column `well` to the `OilWellModel` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_OilWellModel" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "well" TEXT NOT NULL,
    "detail" TEXT NOT NULL,
    "start" TEXT NOT NULL,
    "end" TEXT NOT NULL,
    "reportId" INTEGER NOT NULL,
    CONSTRAINT "OilWellModel_reportId_fkey" FOREIGN KEY ("reportId") REFERENCES "ReportModel" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_OilWellModel" ("id", "reportId") SELECT "id", "reportId" FROM "OilWellModel";
DROP TABLE "OilWellModel";
ALTER TABLE "new_OilWellModel" RENAME TO "OilWellModel";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
