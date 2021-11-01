-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Journey" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "trainNumberId" TEXT NOT NULL,
    "date" DATETIME NOT NULL,
    "delay" INTEGER NOT NULL,
    "isCanceled" BOOLEAN NOT NULL DEFAULT false,
    CONSTRAINT "Journey_trainNumberId_fkey" FOREIGN KEY ("trainNumberId") REFERENCES "TrainNumber" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Journey" ("date", "delay", "id", "trainNumberId") SELECT "date", "delay", "id", "trainNumberId" FROM "Journey";
DROP TABLE "Journey";
ALTER TABLE "new_Journey" RENAME TO "Journey";
CREATE UNIQUE INDEX "Journey_trainNumberId_date_key" ON "Journey"("trainNumberId", "date");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
