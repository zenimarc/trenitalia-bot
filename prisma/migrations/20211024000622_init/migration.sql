/*
  Warnings:

  - You are about to drop the column `trainNumberClassification` on the `UserTrackTracking` table. All the data in the column will be lost.
  - You are about to drop the column `trainNumberClassification` on the `Journey` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "Journey_trainNumberId_date_trainNumberClassification_key";

-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_UserTrackTracking" (
    "userId" TEXT NOT NULL,
    "trainNumberId" TEXT NOT NULL,

    PRIMARY KEY ("userId", "trainNumberId"),
    CONSTRAINT "UserTrackTracking_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "UserTrackTracking_trainNumberId_fkey" FOREIGN KEY ("trainNumberId") REFERENCES "TrainNumber" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_UserTrackTracking" ("trainNumberId", "userId") SELECT "trainNumberId", "userId" FROM "UserTrackTracking";
DROP TABLE "UserTrackTracking";
ALTER TABLE "new_UserTrackTracking" RENAME TO "UserTrackTracking";
CREATE TABLE "new_Journey" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "trainNumberId" TEXT NOT NULL,
    "date" DATETIME NOT NULL,
    "delay" INTEGER NOT NULL,
    CONSTRAINT "Journey_trainNumberId_fkey" FOREIGN KEY ("trainNumberId") REFERENCES "TrainNumber" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Journey" ("date", "delay", "id", "trainNumberId") SELECT "date", "delay", "id", "trainNumberId" FROM "Journey";
DROP TABLE "Journey";
ALTER TABLE "new_Journey" RENAME TO "Journey";
CREATE UNIQUE INDEX "Journey_trainNumberId_date_key" ON "Journey"("trainNumberId", "date");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
