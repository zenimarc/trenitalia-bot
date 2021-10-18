-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_JourneyStation" (
    "journeyId" INTEGER NOT NULL,
    "stationId" INTEGER NOT NULL,
    "delay" INTEGER NOT NULL,
    "plannedPlatform" TEXT NOT NULL,
    "actualPlatform" TEXT NOT NULL,
    "departureTime" DATETIME NOT NULL,
    "arrivalTime" DATETIME,

    PRIMARY KEY ("journeyId", "stationId"),
    CONSTRAINT "JourneyStation_journeyId_fkey" FOREIGN KEY ("journeyId") REFERENCES "Journey" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "JourneyStation_stationId_fkey" FOREIGN KEY ("stationId") REFERENCES "Station" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_JourneyStation" ("actualPlatform", "arrivalTime", "delay", "departureTime", "journeyId", "plannedPlatform", "stationId") SELECT "actualPlatform", "arrivalTime", "delay", "departureTime", "journeyId", "plannedPlatform", "stationId" FROM "JourneyStation";
DROP TABLE "JourneyStation";
ALTER TABLE "new_JourneyStation" RENAME TO "JourneyStation";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
