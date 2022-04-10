"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
var db_access_functions_1 = require("./db_access_functions");
var deamon_1 = require("./deamon");
var express_1 = __importDefault(require("express"));
var cors_1 = __importDefault(require("cors"));
var helmet_1 = __importDefault(require("helmet"));
var api_1 = require("./api");
var utils_1 = require("./utils/utils");
var train_1 = require("./db_access_functions/train");
var cron = require("node-cron");
var app = (0, express_1["default"])();
app.use((0, helmet_1["default"])());
app.use(express_1["default"].json());
app.use((0, cors_1["default"])());
var port = process.env.port || 8080;
app.get("/", function (req, res) {
    res.send("hello world");
});
app.get("/api/trainNumber/:id", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var id, _a, _b;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                id = req.params.id;
                _b = (_a = res).send;
                return [4 /*yield*/, (0, db_access_functions_1.getJourneysTrainByNumber)(id)];
            case 1: return [2 /*return*/, _b.apply(_a, [_c.sent()])];
        }
    });
}); });
// to get trains by trainNumber and startLocationId
app.get("/api/train", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var trainNumber, startLocationId, startDateString, endDateString, train, e_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                trainNumber = req.query.trainNumber;
                startLocationId = Number(req.query.startLocationId);
                if (isNaN(startLocationId)) {
                    return [2 /*return*/, res
                            .status(400)
                            .send({ error: "startLocationId must be an integer" })];
                }
                startDateString = req.query.startDate;
                endDateString = req.query.endDate;
                return [4 /*yield*/, train_1.Train.findFirst({
                        where: {
                            name: trainNumber,
                            departureLocationId: startLocationId
                        },
                        include: {
                            journeys: {
                                where: {
                                    AND: [
                                        {
                                            date: {
                                                gte: startDateString
                                                    ? new Date(startDateString)
                                                    : undefined
                                            }
                                        },
                                        {
                                            date: {
                                                lte: endDateString
                                                    ? new Date(endDateString)
                                                    : undefined
                                            }
                                        },
                                    ]
                                },
                                include: { stations: true }
                            },
                            departureLocation: true,
                            arrivalLocation: true
                        }
                    })];
            case 1:
                train = _a.sent();
                return [2 /*return*/, res.send(train)];
            case 2:
                e_1 = _a.sent();
                console.log(e_1);
                return [2 /*return*/, res.sendStatus(400)];
            case 3: return [2 /*return*/];
        }
    });
}); });
app.get("/api/synced-train/:trainName", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var trainName, trains;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                trainName = req.params.trainName;
                return [4 /*yield*/, (0, train_1.getSyncedTrainsByNumber)(trainName)];
            case 1:
                trains = _a.sent();
                return [2 /*return*/, res.json(trains)];
        }
    });
}); });
app.get("/api/user-tracking/:username", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var username, _a, _b;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                username = req.params.username;
                _b = (_a = res).send;
                return [4 /*yield*/, (0, db_access_functions_1.getUserTracking)(username)];
            case 1:
                _b.apply(_a, [_c.sent()]);
                return [2 /*return*/];
        }
    });
}); });
app.post("/api/add-user-tracking", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, trainName, classification, startLocationID, addedTrack, e_2;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _a = req.body, trainName = _a.trainName, classification = _a.classification, startLocationID = _a.startLocationID;
                console.log(trainName, classification, startLocationID);
                _b.label = 1;
            case 1:
                _b.trys.push([1, 3, , 4]);
                return [4 /*yield*/, (0, db_access_functions_1.addUserTracking)("admin", trainName, classification.toLocaleLowerCase(), Number(startLocationID))];
            case 2:
                addedTrack = _b.sent();
                return [2 /*return*/, res.send({ data: addedTrack, messages: "ok" })];
            case 3:
                e_2 = _b.sent();
                return [2 /*return*/, res
                        .status(400)
                        .send({ data: {}, messages: e_2.toString() })];
            case 4: return [2 /*return*/];
        }
    });
}); });
app.post("/api/add-user-tracking-onlynum", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var trainName, data, output, e_3;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                console.log(req.body);
                trainName = req.body.trainName;
                _a.label = 1;
            case 1:
                _a.trys.push([1, 4, , 5]);
                return [4 /*yield*/, (0, db_access_functions_1.getTrainsByNumber)(trainName)];
            case 2:
                data = _a.sent();
                console.log(data.length, data);
                if (data.length > 1) {
                    // need to select which train with same number
                    return [2 /*return*/, res.send({
                            data: data,
                            messages: "multiple trains with same number, select one"
                        })];
                }
                return [4 /*yield*/, (0, db_access_functions_1.addUserTracking)("admin", data[0].transportMeanName, data[0].transportDenomination.toLocaleLowerCase(), Number(data[0].startLocation.locationId))];
            case 3:
                output = _a.sent();
                res.send({ data: output, messages: "ok" });
                return [3 /*break*/, 5];
            case 4:
                e_3 = _a.sent();
                res.send({ data: {}, messages: e_3.toString() });
                return [3 /*break*/, 5];
            case 5: return [2 /*return*/];
        }
    });
}); });
app.get("/api/autocomplete-by-train-number", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var trainName, data, e_4;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                trainName = req.query.trainName;
                console.log(trainName);
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, , 4]);
                return [4 /*yield*/, (0, db_access_functions_1.getTrainsByNumber)(trainName)];
            case 2:
                data = _a.sent();
                if (data.length > 1) {
                    // need to select which train with same number
                    console.log(data);
                    return [2 /*return*/, res.json({
                            data: data,
                            messages: "multiple trains with same number, select one"
                        })];
                }
                else {
                    return [2 /*return*/, res.json({
                            data: data,
                            messages: "ok"
                        })];
                }
                return [3 /*break*/, 4];
            case 3:
                e_4 = _a.sent();
                res.send({ data: {}, messages: e_4.toString() });
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); });
app.get("/api/autocomplete-station/:stationName", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var stationName, _a, _b;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                stationName = req.params.stationName;
                _b = (_a = res).send;
                return [4 /*yield*/, (0, api_1.getStationNameAutocompletion)(stationName)];
            case 1:
                _b.apply(_a, [_c.sent()]);
                return [2 /*return*/];
        }
    });
}); });
app.get("/api/getTrainsFromStartAndEndLocations", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, startLocationID, endLocationID, _b, searchId, totalSolutions, solutions, solutionsData;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                _a = req.query, startLocationID = _a.startLocationID, endLocationID = _a.endLocationID;
                if (!(Number(startLocationID) && Number(endLocationID))) {
                    console.log(startLocationID, endLocationID);
                    res.json({
                        data: [],
                        messages: "start and end locations must be integers"
                    });
                }
                return [4 /*yield*/, (0, api_1.getSearchIDByDepartureAndArrivalStations)(Number(startLocationID), Number(endLocationID))];
            case 1:
                _b = _c.sent(), searchId = _b.searchId, totalSolutions = _b.totalSolutions;
                return [4 /*yield*/, (0, api_1.getSolutionsBySearchID)(searchId, totalSolutions)];
            case 2:
                solutions = _c.sent();
                solutionsData = solutions.map(function (sol) {
                    return (0, utils_1.extractTrainDataFromSolution)(sol);
                });
                res.json({
                    data: solutionsData.filter(function (elem) { return Boolean(elem); }),
                    messages: solutionsData.length !== totalSolutions
                        ? "trovate " + solutionsData.length + " soluzioni su " + totalSolutions
                        : ""
                });
                return [2 /*return*/];
        }
    });
}); });
app.listen(port, function () {
    console.log("server started at http://localhost:" + port);
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
cron.schedule("45 21,22 * * *", function () {
    console.log("running a daily task");
    (0, deamon_1.startDeamon)();
});
//startDeamon();
