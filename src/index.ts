import {
  syncTrainByNumber,
  addUser,
  addUserTracking,
  getUserTracking,
  getJourneysTrainByNumber,
  getTrainsByNumber,
} from "./db_access_functions";

import { startDeamon } from "./deamon";

import express from "express";
import cors from "cors";
import helmet from "helmet";

var cron = require("node-cron");

/*
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

  res.send(await getJourneysTrainByNumber(id));
});

app.get("/api/user-tracking/:username", async (req, res) => {
  const username = req.params.username;
  res.send(await getUserTracking(username));
});

app.listen(port, () => {
  console.log(`server started at http://localhost:${port}`);
});
*/

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

//getJourneysTrainByNumber("2419").then((data) => console.log(JSON.stringify(data)));

//getTrainsByNumber("35");

/*cron.schedule("01 21,22,23 * * *", () => {
  console.log("running a daily task");
  startDeamon();
});
*/

startDeamon();
