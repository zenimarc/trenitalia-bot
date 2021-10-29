/*
  Warnings:

  - A unique constraint covering the columns `[name,classification]` on the table `TrainNumber` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "TrainNumber_id_classification_key";

-- CreateIndex
CREATE UNIQUE INDEX "TrainNumber_name_classification_key" ON "TrainNumber"("name", "classification");
