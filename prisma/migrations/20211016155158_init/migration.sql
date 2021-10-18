-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_JourneyStation" (
    "journeyId" INTEGER NOT NULL,
    "stationId" INTEGER NOT NULL,
    "departureDelay" INTEGER,
    "arrivalDelay" INTEGER,
    "plannedPlatform" TEXT NOT NULL,
    "actualPlatform" TEXT NOT NULL,
    "departureTime" DATETIME,
    "arrivalTime" DATETIME,

    PRIMARY KEY ("journeyId", "stationId"),
    CONSTRAINT "JourneyStation_journeyId_fkey" FOREIGN KEY ("journeyId") REFERENCES "Journey" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "JourneyStation_stationId_fkey" FOREIGN KEY ("stationId") REFERENCES "Station" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_JourneyStation" ("actualPlatform", "arrivalDelay", "arrivalTime", "departureDelay", "departureTime", "journeyId", "plannedPlatform", "stationId") SELECT "actualPlatform", "arrivalDelay", "arrivalTime", "departureDelay", "departureTime", "journeyId", "plannedPlatform", "stationId" FROM "JourneyStation";
DROP TABLE "JourneyStation";
ALTER TABLE "new_JourneyStation" RENAME TO "JourneyStation";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
