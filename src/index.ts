import fetch from "node-fetch";
import fs from "fs";
import {
  ResponseAutocompletionStation,
  ResponseTrainLine,
  ResponseTrainNumber,
} from "types";
import { getStationNameAutocompletion, getTrainInfo } from "api";

/*try {
  getTrainInfo("2436").then((data) => {
    console.log(data);
    console.log("\n\n il delay è:", getDelay(data as ResponseTrainLine));
  });
} catch (error) {
  // probabile manutenzione programmata o altro
  console.log("Probabile manutenzione programmata o altro");
}*/

getStationNameAutocompletion("domo").then();
