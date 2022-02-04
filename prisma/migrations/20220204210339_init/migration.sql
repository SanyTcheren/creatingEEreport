-- CreateTable
CREATE TABLE "UserModel" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "name" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "OilWellModel" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "test" TEXT NOT NULL,
    "reportId" INTEGER NOT NULL,
    CONSTRAINT "OilWellModel_reportId_fkey" FOREIGN KEY ("reportId") REFERENCES "ReportModel" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "ReportModel" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "email" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "number" TEXT NOT NULL,
    "field" TEXT NOT NULL,
    "bush" TEXT NOT NULL,
    "dataFile" TEXT
);

-- CreateIndex
CREATE UNIQUE INDEX "UserModel_email_key" ON "UserModel"("email");

-- CreateIndex
CREATE UNIQUE INDEX "ReportModel_email_key" ON "ReportModel"("email");
