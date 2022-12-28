import {
  syncTrainByNumber,
  addUser,
  addUserTracking,
  getUserTracking,
  getJourneysTrainByNumber,
  getTrainsByNumber,
  addCanceledTrain,
} from "./db_access_functions";
import { DayOfAWeekString } from "./utils/utils";

import { startDeamon } from "./deamon";
import express, { Request, Response } from "express";
import cors from "cors";
import helmet from "helmet";
import {
  getSearchIDByDepartureAndArrivalStations,
  getSolutionsBySearchID,
  getStationNameAutocompletion,
} from "./api";
import {
  dateDaysNamesToNumber,
  extractTrainDataFromSolution,
} from "./utils/utils";
import { ResponseAPI } from "./types";
import { getSyncedTrainsByNumber, Train } from "./db_access_functions/train";
import { time } from "console";
import { Journey } from "../prisma/generated/prisma-client-js";
import {
  ViaggiaTrenoAPIUrl,
  ViaggiaTrenoDettaglioTrattaPath,
  ViaggiaTrenoElencoStazioniPath,
  ViaggiaTrenoElencoTrattePath,
  ViaggiaTrenoMeteoPath,
  ViaggiaTrenoRSSNowPath,
} from "./constants";
import axios from "axios";
import {
  updateCurrentInfomobilita,
  getInfomobilita,
  startVTDeamon,
  infoMobilitaDeamonJob,
} from "./viaggiatrenoDeamon";

var cron = require("node-cron");

const app = express();
app.use(helmet());
app.use(express.json());
app.use(cors());

const port = process.env.port || 8080;

app.get("/", (req, res) => {
  res.send("hello world");
});

app.get("/api/trainNumber/:id", async (req, res) => {
  const id = req.params.id;

  return res.send(await getJourneysTrainByNumber(id));
});

// to get trains by trainNumber and startLocationId
app.get("/api/train", async (req, res) => {
  try {
    const trainId = req.query.trainId as string;
    const trainNumber = req.query.trainNumber as string;
    const startLocationId = Number(req.query.startLocationId);
    if (!trainId && isNaN(startLocationId)) {
      return res
        .status(400)
        .send({ error: "startLocationId must be an integer" });
    }
    let startDateString = req.query.startDate;
    // if no startDate provided I create one to 100 days before today
    if (!startDateString) {
      const _180DaysBeforeToday = new Date(
        new Date().getTime() - 180 * 24 * 60 * 60 * 1000
      );
      startDateString = _180DaysBeforeToday.toISOString();
    }
    const endDateString = req.query.endDate;
    const weekDays = req.query.weekDays
      ? JSON.parse(String(req.query.weekDays))
      : undefined;
    const weekDaysCodes = weekDays
      ? new Set(
          weekDays.map((day: DayOfAWeekString) => dateDaysNamesToNumber(day))
        )
      : new Set();

    const isInWeekDays = (journey: Journey) => {
      return weekDaysCodes.has(journey.date.getDay());
    };

    const train = await Train.findFirst({
      where: trainId
        ? { id: trainId }
        : {
            name: trainNumber,
            departureLocationId: startLocationId,
          },
      include: {
        journeys: {
          where: {
            AND: [
              {
                date: {
                  gte: startDateString
                    ? new Date(startDateString as string)
                    : undefined,
                },
              },
              {
                date: {
                  lte: endDateString
                    ? new Date(endDateString as string)
                    : undefined,
                },
              },
            ],
          },
          include: {
            stations: {
              include: { station: true },
              orderBy: { arrivalTime: "asc" },
            },
          },
        },
        departureLocation: true,
        arrivalLocation: true,
      },
    });
    if (train !== null && weekDays && weekDays.length !== 0) {
      return res.send({
        ...train,
        journeys: [...train.journeys.filter(isInWeekDays)],
      });
    }
    return res.send(train);
  } catch (e) {
    console.log(e);
    return res.sendStatus(400);
  }
});

app.get("/api/synced-train/:trainName", async (req, res) => {
  const trainName = req.params.trainName;
  const trains = await getSyncedTrainsByNumber(trainName);
  return res.json(trains);
});

app.get("/api/user-tracking/:username", async (req, res) => {
  const username = req.params.username;
  res.send(await getUserTracking(username));
});

app.post("/api/add-user-tracking", async (req, res) => {
  const { trainName, classification, startLocationID } = req.body;
  console.log(trainName, classification, startLocationID);
  try {
    const addedTrack = await addUserTracking(
      "admin",
      trainName as string,
      (classification as string).toLocaleLowerCase(),
      Number(startLocationID)
    );
    return res.send({ data: addedTrack, messages: "ok" });
  } catch (e) {
    return res
      .status(400)
      .send({ data: {}, messages: (e as Error).toString() });
  }
});

app.post("/api/add-user-tracking-onlynum", async (req, res) => {
  console.log(req.body);
  const { trainName } = req.body;
  try {
    const data = await getTrainsByNumber(trainName);
    console.log(data.length, data);
    if (data.length > 1) {
      // need to select which train with same number
      return res.send({
        data,
        messages: "multiple trains with same number, select one",
      });
    }
    const output = await addUserTracking(
      "admin",
      data[0].transportMeanName,
      data[0].transportDenomination.toLocaleLowerCase(),
      Number(data[0].startLocation.locationId)
    );

    res.send({ data: output, messages: "ok" });
  } catch (e) {
    res.send({ data: {}, messages: (e as Error).toString() });
  }
});

app.get("/api/autocomplete-by-train-number", async (req, res) => {
  const { trainName } = req.query;
  console.log(trainName);
  try {
    const data = await getTrainsByNumber(trainName as string);
    if (data.length > 1) {
      // need to select which train with same number
      console.log(data);
      return res.json({
        data,
        messages: "multiple trains with same number, select one",
      });
    } else {
      return res.json({
        data,
        messages: "ok",
      });
    }
  } catch (e) {
    res.send({ data: {}, messages: (e as Error).toString() });
  }
});

app.get("/api/autocomplete-station/:stationName", async (req, res) => {
  const stationName = req.params.stationName;
  res.send(await getStationNameAutocompletion(stationName));
});

app.get("/api/getTrainsFromStartAndEndLocations", async (req, res) => {
  try {
    const { startLocationID, endLocationID } = req.query;
    if (!(Number(startLocationID) && Number(endLocationID))) {
      console.log(startLocationID, endLocationID);
      return res.json({
        data: [],
        messages: "start and end locations must be integers",
      } as ResponseAPI);
    }

    const { searchId, totalSolutions } =
      await getSearchIDByDepartureAndArrivalStations(
        Number(startLocationID),
        Number(endLocationID)
      );
    //console.log(searchId, totalSolutions);
    const solutions = await getSolutionsBySearchID(searchId, totalSolutions);
    const solutionsData = solutions.map((sol) =>
      extractTrainDataFromSolution(sol)
    );

    return res.json({
      data: solutionsData.filter((elem) => Boolean(elem)),
      messages:
        solutionsData.length !== totalSolutions
          ? "trovate " +
            solutionsData.length +
            " soluzioni su " +
            totalSolutions
          : "",
    } as ResponseAPI);
  } catch (e) {
    return res.sendStatus(500);
  }
});

// VIAGGIATRENO PROXY PART
app.get("/api/viaggiatreno/elencoStazioni", async (req, res) => {
  try {
    const resp = await axios.get(
      ViaggiaTrenoAPIUrl + ViaggiaTrenoElencoStazioniPath
    );
    return res.send(resp.data);
  } catch (e) {
    console.log(e);
    return res.sendStatus(500);
  }
});

app.get("/api/viaggiatreno/elencoTratte", async (req, res) => {
  try {
    const resp = await axios.get(
      ViaggiaTrenoAPIUrl + ViaggiaTrenoElencoTrattePath + new Date().getTime()
    );
    return res.send(resp.data);
  } catch (e) {
    console.log(e);
    return res.sendStatus(500);
  }
});

app.get("/api/viaggiatreno/datiMeteo", async (req, res) => {
  try {
    const resp = await axios.get(ViaggiaTrenoAPIUrl + ViaggiaTrenoMeteoPath);
    return res.send(resp.data);
  } catch (e) {
    console.log(e);
    return res.sendStatus(500);
  }
});

app.get(
  "/api/viaggiatreno/infomobilita",
  async (req: Request, res: Response) => {
    try {
      const dateString = req.query.date;
      let dateObj: Date;
      if (!dateString) {
        dateObj = new Date();
        await infoMobilitaDeamonJob();
      } else {
        dateObj = new Date(dateString as string);
      }
      const data = await getInfomobilita(dateObj);
      if (data === null) {
        return res.sendStatus(404);
      }
      return res.send(data);
      //const resp = await axios.get(ViaggiaTrenoAPIUrl + ViaggiaTrenoRSSNowPath);
    } catch (e) {
      console.log(e);
      return res.sendStatus(500);
    }
  }
);

app.get("/api/viaggiatreno/dettaglioTratta", async (req, res) => {
  try {
    const { tratta1, tratta2 } = req.query;
    const resp = await axios.get(
      ViaggiaTrenoAPIUrl +
        ViaggiaTrenoDettaglioTrattaPath +
        `${tratta1}/${tratta2}/ES*,IC,EXP,EC,EN/null`
    );
    return res.send(resp.data);
  } catch (e) {
    console.log(e);
    return res.sendStatus(500);
  }
});

app.listen(port, () => {
  console.log(`server started at http://localhost:${port}`);
});

//getStationNameAutocompletion("domo").then();

//addUser("admin").then((data) => console.log(data));
/*
const main = async () => {
  for (const num of [
    "2411",
    "2413",
    "10215",
    "2415",
    "10217",
    "35",
    "2419",
    "51",
    "10223",
    "37",
    "10227",
    "2427",
    "10231",
    "2431",
    "57",
    "10235",
    "39",
    "2435",
    "10239",
    "2439",
    "10243",
    "59",
    "2405",
    "41",
    "10212",
    "50",
    "2414",
    "10216",
    "32",
    "2416",
    "2418",
    "52",
    "10224",
    "34",
    "2426",
    "10228",
    "2430",
    "10232",
    "36",
    "2434",
    "10236",
    "56",
    "2436",
    "44",
    "2438",
    "10240",
    "2442",
  ]) {
    await getTrainsByNumber(num).then((data) => {
      addUserTracking(
        "admin",
        data[0].transportMeanName,
        data[0].transportDenomination.toLocaleLowerCase()
      ).then(() => console.log("all ok"));
    });
  }
};
main();
*/
//getTrainsByNumber("35").then((data) => console.log(data));
//addUserTracking("admin", "2419", "Regionale").then((data) => console.log(data));
//getUserTracking("admin").then((data) => console.log(data));

//getJourneysTrainByNumber("2419").then((data) =>console.log(JSON.stringify(data)));

//getTrainsByNumber("35");
/*
const addByNum = async (trainName: string) => {
  try {
    const data = await getTrainsByNumber(trainName);
    console.log("aggiungo", trainName);
    for (const train of data) {
      const output = await addUserTracking(
        "admin",
        train.transportMeanName,
        train.transportDenomination.toLocaleLowerCase(),
        Number(train.startLocation.locationId)
      );
      console.log("tutto ok per", trainName);
    }
  } catch (e) {
    console.log(e);
    console.log("errore per", trainName);
  }
};
(async () => {
  function sleep(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
  for (let i = 0; i < 20000; i++) {
    await addByNum(String(i));
    await sleep(1000);
  }
})();
*/

cron.schedule("45 12,21,22 * * *", () => {
  console.log("running a daily task");
  startDeamon();
});

(async () => {
  //wrapping and calling it
  startVTDeamon();
})();

//startDeamon();
