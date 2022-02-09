-- CreateTable
CREATE TABLE "UserModel" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "UserModel_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "OilWellModel" (
    "id" SERIAL NOT NULL,
    "well" TEXT NOT NULL,
    "detail" TEXT NOT NULL,
    "start" TEXT NOT NULL,
    "end" TEXT NOT NULL,
    "reportId" INTEGER NOT NULL,

    CONSTRAINT "OilWellModel_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ReportModel" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "number" TEXT NOT NULL,
    "field" TEXT NOT NULL,
    "bush" TEXT NOT NULL,
    "dataFile" TEXT,

    CONSTRAINT "ReportModel_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "UserModel_email_key" ON "UserModel"("email");

-- CreateIndex
CREATE UNIQUE INDEX "ReportModel_email_key" ON "ReportModel"("email");

-- AddForeignKey
ALTER TABLE "OilWellModel" ADD CONSTRAINT "OilWellModel_reportId_fkey" FOREIGN KEY ("reportId") REFERENCES "ReportModel"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
