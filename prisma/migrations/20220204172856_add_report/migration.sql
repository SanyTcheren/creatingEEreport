-- CreateTable
CREATE TABLE "OilWellModel" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "well" TEXT NOT NULL,
    "detail" TEXT NOT NULL,
    "start" TEXT NOT NULL,
    "end" TEXT NOT NULL,
    "reportModelId" INTEGER,
    CONSTRAINT "OilWellModel_reportModelId_fkey" FOREIGN KEY ("reportModelId") REFERENCES "ReportModel" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "ReportModel" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "type" TEXT NOT NULL,
    "number" TEXT NOT NULL,
    "field" TEXT NOT NULL,
    "bush" TEXT NOT NULL,
    "dataFile" TEXT
);
