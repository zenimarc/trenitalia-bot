/*
  Warnings:

  - You are about to drop the column `delay` on the `JourneyStation` table. All the data in the column will be lost.
  - Added the required column `arrivalDelay` to the `JourneyStation` table without a default value. This is not possible if the table is not empty.
  - Added the required column `departureDelay` to the `JourneyStation` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_JourneyStation" (
    "journeyId" INTEGER NOT NULL,
    "stationId" INTEGER NOT NULL,
    "departureDelay" INTEGER NOT NULL,
    "arrivalDelay" INTEGER NOT NULL,
    "plannedPlatform" TEXT NOT NULL,
    "actualPlatform" TEXT NOT NULL,
    "departureTime" DATETIME NOT NULL,
    "arrivalTime" DATETIME,

    PRIMARY KEY ("journeyId", "stationId"),
    CONSTRAINT "JourneyStation_journeyId_fkey" FOREIGN KEY ("journeyId") REFERENCES "Journey" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "JourneyStation_stationId_fkey" FOREIGN KEY ("stationId") REFERENCES "Station" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_JourneyStation" ("actualPlatform", "arrivalTime", "departureTime", "journeyId", "plannedPlatform", "stationId") SELECT "actualPlatform", "arrivalTime", "departureTime", "journeyId", "plannedPlatform", "stationId" FROM "JourneyStation";
DROP TABLE "JourneyStation";
ALTER TABLE "new_JourneyStation" RENAME TO "JourneyStation";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
