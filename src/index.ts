import { syncTrainByNumber } from "./db_access_functions";

//getStationNameAutocompletion("domo").then();

syncTrainByNumber("2419").then(() => console.log("all ok"));
