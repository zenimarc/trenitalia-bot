import {
  syncTrainByNumber,
  addUser,
  addUserTracking,
  getUserTracking,
  getJourneysTrainByNumber,
} from "./db_access_functions";

import express from "express";
import cors from "cors";
import helmet from "helmet";

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

//getStationNameAutocompletion("domo").then();

//syncTrainByNumber("35").then(() => console.log("all ok"));

//addUser("admin").then((data) => console.log(data));

//addUserTracking("admin", "2419").then((data) => console.log(data));

//getUserTracking("admin").then((data) => console.log(data));

//getJourneysTrainByNumber("2419").then((data) => console.log(JSON.stringify(data)));
