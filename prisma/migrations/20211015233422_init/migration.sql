-- CreateTable
CREATE TABLE "JourneyStation" (
    "journeyId" INTEGER NOT NULL,
    "stationId" INTEGER NOT NULL,
    "delay" INTEGER NOT NULL,
    "plannedPlatform" INTEGER NOT NULL,
    "actualPlatform" INTEGER NOT NULL,
    "departureTime" DATETIME NOT NULL,
    "arrivalTime" DATETIME NOT NULL,

    PRIMARY KEY ("journeyId", "stationId"),
    CONSTRAINT "JourneyStation_journeyId_fkey" FOREIGN KEY ("journeyId") REFERENCES "Journey" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "JourneyStation_stationId_fkey" FOREIGN KEY ("stationId") REFERENCES "Station" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
