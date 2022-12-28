-- CreateTable
CREATE TABLE "ViaggiaTrenoResponses" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "date" DATETIME NOT NULL,
    "elencoTratte" TEXT,
    "elencoStazioni" TEXT,
    "meteo" TEXT,
    "dettagliotratte" TEXT,
    "infomobilita" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "ViaggiaTrenoResponses_date_key" ON "ViaggiaTrenoResponses"("date");
