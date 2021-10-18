"use strict";
exports.__esModule = true;
var db_access_functions_1 = require("./db_access_functions");
//getStationNameAutocompletion("domo").then();
(0, db_access_functions_1.syncTrainByNumber)("2419").then(function () { return console.log("all ok"); });
