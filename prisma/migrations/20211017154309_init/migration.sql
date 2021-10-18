/*
  Warnings:

  - Added the required column `delay` to the `Journey` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Journey" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "trainNumberId" INTEGER NOT NULL,
    "date" DATETIME NOT NULL,
    "delay" INTEGER NOT NULL,
    CONSTRAINT "Journey_trainNumberId_fkey" FOREIGN KEY ("trainNumberId") REFERENCES "TrainNumber" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Journey" ("date", "id", "trainNumberId") SELECT "date", "id", "trainNumberId" FROM "Journey";
DROP TABLE "Journey";
ALTER TABLE "new_Journey" RENAME TO "Journey";
CREATE UNIQUE INDEX "Journey_trainNumberId_date_key" ON "Journey"("trainNumberId", "date");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
