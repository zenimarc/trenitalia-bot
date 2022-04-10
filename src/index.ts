import {
  syncTrainByNumber,
  addUser,
  addUserTracking,
  getUserTracking,
  getJourneysTrainByNumber,
  getTrainsByNumber,
  addCanceledTrain,
} from "./db_access_functions";

import { startDeamon } from "./deamon";

import express from "express";
import cors from "cors";
import helmet from "helmet";
import {
  getSearchIDByDepartureAndArrivalStations,
  getSolutionsBySearchID,
  getStationNameAutocompletion,
} from "./api";
import { extractTrainDataFromSolution } from "./utils/utils";
import { ResponseAPI } from "./types";
import { getSyncedTrainsByNumber, Train } from "./db_access_functions/train";

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
    const trainNumber = req.query.trainNumber as string;
    const startLocationId = Number(req.query.startLocationId);
    if (isNaN(startLocationId)) {
      return res
        .status(400)
        .send({ error: "startLocationId must be an integer" });
    }
    const startDateString = req.query.startDate;
    const endDateString = req.query.endDate;

    const train = await Train.findFirst({
      where: {
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
          include: { stations: true },
        },
        departureLocation: true,
        arrivalLocation: true,
      },
    });
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
  const { startLocationID, endLocationID } = req.query;
  if (!(Number(startLocationID) && Number(endLocationID))) {
    console.log(startLocationID, endLocationID);
    res.json({
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

  res.json({
    data: solutionsData.filter((elem) => Boolean(elem)),
    messages:
      solutionsData.length !== totalSolutions
        ? "trovate " + solutionsData.length + " soluzioni su " + totalSolutions
        : "",
  } as ResponseAPI);
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

cron.schedule("45 21,22 * * *", () => {
  console.log("running a daily task");
  startDeamon();
});

//startDeamon();
