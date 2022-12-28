/*
  Warnings:

  - You are about to drop the column `dettagliotratte` on the `ViaggiaTrenoResponses` table. All the data in the column will be lost.
  - You are about to drop the column `elencoStazioni` on the `ViaggiaTrenoResponses` table. All the data in the column will be lost.
  - You are about to drop the column `elencoTratte` on the `ViaggiaTrenoResponses` table. All the data in the column will be lost.
  - You are about to drop the column `meteo` on the `ViaggiaTrenoResponses` table. All the data in the column will be lost.

*/
-- CreateTable
CREATE TABLE "ViaggiaTrenoResp" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "date" DATETIME NOT NULL,
    "elencoTratte" TEXT NOT NULL,
    "elencoStazioni" TEXT NOT NULL,
    "meteo" TEXT NOT NULL,
    "dettagliotratte" TEXT NOT NULL
);

-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_ViaggiaTrenoResponses" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "date" DATETIME NOT NULL,
    "infomobilita" TEXT NOT NULL
);
INSERT INTO "new_ViaggiaTrenoResponses" ("date", "id", "infomobilita") SELECT "date", "id", "infomobilita" FROM "ViaggiaTrenoResponses";
DROP TABLE "ViaggiaTrenoResponses";
ALTER TABLE "new_ViaggiaTrenoResponses" RENAME TO "ViaggiaTrenoResponses";
CREATE UNIQUE INDEX "ViaggiaTrenoResponses_date_key" ON "ViaggiaTrenoResponses"("date");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;

-- CreateIndex
CREATE UNIQUE INDEX "ViaggiaTrenoResp_date_key" ON "ViaggiaTrenoResp"("date");
