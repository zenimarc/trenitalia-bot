/*
  Warnings:

  - You are about to drop the `UserTrackTraing` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "UserTrackTraing";
PRAGMA foreign_keys=on;

-- CreateTable
CREATE TABLE "UserTrackTracking" (
    "userId" TEXT NOT NULL,
    "trainNumberId" TEXT NOT NULL,

    PRIMARY KEY ("userId", "trainNumberId"),
    CONSTRAINT "UserTrackTracking_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "UserTrackTracking_trainNumberId_fkey" FOREIGN KEY ("trainNumberId") REFERENCES "TrainNumber" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
