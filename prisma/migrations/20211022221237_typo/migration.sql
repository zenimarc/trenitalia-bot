/*
  Warnings:

  - You are about to drop the `UserTrackTrain` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "UserTrackTrain";
PRAGMA foreign_keys=on;

-- CreateTable
CREATE TABLE "UserTrackTraing" (
    "userId" TEXT NOT NULL,
    "trainNumberId" TEXT NOT NULL,

    PRIMARY KEY ("userId", "trainNumberId"),
    CONSTRAINT "UserTrackTraing_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "UserTrackTraing_trainNumberId_fkey" FOREIGN KEY ("trainNumberId") REFERENCES "TrainNumber" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
