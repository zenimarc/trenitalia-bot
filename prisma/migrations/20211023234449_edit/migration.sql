/*
  Warnings:

  - A unique constraint covering the columns `[trainNumberId,date,trainNumberClassification]` on the table `Journey` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "Journey_trainNumberId_date_key";

-- CreateIndex
CREATE UNIQUE INDEX "Journey_trainNumberId_date_trainNumberClassification_key" ON "Journey"("trainNumberId", "date", "trainNumberClassification");
