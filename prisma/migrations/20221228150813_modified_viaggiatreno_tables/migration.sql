/*
  Warnings:

  - You are about to drop the `ViaggiaTrenoResponses` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "ViaggiaTrenoResponses";
PRAGMA foreign_keys=on;

-- CreateTable
CREATE TABLE "VTInfomobilita" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "date" DATETIME NOT NULL,
    "infomobilita" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "VTInfomobilita_date_key" ON "VTInfomobilita"("date");
