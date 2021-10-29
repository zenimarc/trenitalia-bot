/*
  Warnings:

  - The primary key for the `TrainNumber` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - Added the required column `name` to the `TrainNumber` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Journey" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "trainNumberId" TEXT NOT NULL,
    "trainNumberClassification" TEXT NOT NULL,
    "date" DATETIME NOT NULL,
    "delay" INTEGER NOT NULL,
    CONSTRAINT "Journey_trainNumberId_fkey" FOREIGN KEY ("trainNumberId") REFERENCES "TrainNumber" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Journey" ("date", "delay", "id", "trainNumberClassification", "trainNumberId") SELECT "date", "delay", "id", "trainNumberClassification", "trainNumberId" FROM "Journey";
DROP TABLE "Journey";
ALTER TABLE "new_Journey" RENAME TO "Journey";
CREATE UNIQUE INDEX "Journey_trainNumberId_date_trainNumberClassification_key" ON "Journey"("trainNumberId", "date", "trainNumberClassification");
CREATE TABLE "new_TrainNumber" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "classification" TEXT NOT NULL,
    "departureLocationId" INTEGER NOT NULL,
    "arrivalLocationId" INTEGER NOT NULL,
    CONSTRAINT "TrainNumber_departureLocationId_fkey" FOREIGN KEY ("departureLocationId") REFERENCES "Station" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "TrainNumber_arrivalLocationId_fkey" FOREIGN KEY ("arrivalLocationId") REFERENCES "Station" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_TrainNumber" ("arrivalLocationId", "classification", "departureLocationId", "id") SELECT "arrivalLocationId", "classification", "departureLocationId", "id" FROM "TrainNumber";
DROP TABLE "TrainNumber";
ALTER TABLE "new_TrainNumber" RENAME TO "TrainNumber";
CREATE UNIQUE INDEX "TrainNumber_id_classification_key" ON "TrainNumber"("id", "classification");
CREATE TABLE "new_UserTrackTracking" (
    "userId" TEXT NOT NULL,
    "trainNumberClassification" TEXT NOT NULL,
    "trainNumberId" TEXT NOT NULL,

    PRIMARY KEY ("userId", "trainNumberId"),
    CONSTRAINT "UserTrackTracking_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "UserTrackTracking_trainNumberId_fkey" FOREIGN KEY ("trainNumberId") REFERENCES "TrainNumber" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_UserTrackTracking" ("trainNumberClassification", "trainNumberId", "userId") SELECT "trainNumberClassification", "trainNumberId", "userId" FROM "UserTrackTracking";
DROP TABLE "UserTrackTracking";
ALTER TABLE "new_UserTrackTracking" RENAME TO "UserTrackTracking";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
