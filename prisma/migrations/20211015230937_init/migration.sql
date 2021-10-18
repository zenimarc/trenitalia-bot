-- CreateTable
CREATE TABLE "TrainNumber" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "classification" TEXT NOT NULL,
    "departureLocationId" INTEGER NOT NULL,
    "arrivalLocationId" INTEGER NOT NULL,
    CONSTRAINT "TrainNumber_departureLocationId_fkey" FOREIGN KEY ("departureLocationId") REFERENCES "Station" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "TrainNumber_arrivalLocationId_fkey" FOREIGN KEY ("arrivalLocationId") REFERENCES "Station" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Station" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT
);

-- CreateTable
CREATE TABLE "Journey" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "trainNumberId" INTEGER NOT NULL,
    "date" DATETIME NOT NULL,
    CONSTRAINT "Journey_trainNumberId_fkey" FOREIGN KEY ("trainNumberId") REFERENCES "TrainNumber" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "Journey_trainNumberId_date_key" ON "Journey"("trainNumberId", "date");
