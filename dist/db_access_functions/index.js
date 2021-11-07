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
exports.__esModule = true;
exports.addCanceledTrain = exports.syncTrainByNumber = exports.getTrainsByNumber = exports.getJourneysTrainByNumber = exports.getUserTracking = exports.addUserTracking = exports.addUser = void 0;
var api_1 = require("../api");
var index_js_1 = require("../../prisma/generated/prisma-client-js/index.js");
var exceptions_1 = require("../utils/exceptions");
var prisma = new index_js_1.PrismaClient();
var addUser = function (name) { return __awaiter(void 0, void 0, void 0, function () {
    var e_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, prisma.user.create({
                        data: {
                            username: name
                        }
                    })];
            case 1: return [2 /*return*/, _a.sent()];
            case 2:
                e_1 = _a.sent();
                console.log(e_1);
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.addUser = addUser;
var addUserTracking = function (username, trainNumber, classification) { return __awaiter(void 0, void 0, void 0, function () {
    var user, Train;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, prisma.user.findFirst({
                    where: {
                        username: username
                    }
                })];
            case 1:
                user = _a.sent();
                if (!user) {
                    throw Error("User not found");
                }
                return [4 /*yield*/, prisma.trainNumber.findUnique({
                        where: {
                            name_classification: {
                                name: trainNumber,
                                classification: classification
                            }
                        }
                    })];
            case 2:
                Train = _a.sent();
                if (!Train) {
                    throw Error("train not found");
                }
                return [4 /*yield*/, prisma.userTrackTracking.create({
                        data: {
                            userId: user.id,
                            trainNumberId: Train.id
                        }
                    })];
            case 3: return [2 /*return*/, _a.sent()];
        }
    });
}); };
exports.addUserTracking = addUserTracking;
var getUserTracking = function (username) { return __awaiter(void 0, void 0, void 0, function () {
    var user;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, prisma.user.findFirst({
                    where: {
                        username: username
                    },
                    include: {
                        trackedTrains: {
                            include: {
                                trainNumber: true
                            }
                        }
                    }
                })];
            case 1:
                user = _a.sent();
                if (!user) {
                    throw new exceptions_1.UserNotFoundError("user not found");
                }
                return [2 /*return*/, user.trackedTrains.map(function (x) {
                        return {
                            name: x.trainNumber.name,
                            classification: x.trainNumber.classification,
                            departureLocationId: x.trainNumber.departureLocationId
                        };
                    })];
        }
    });
}); };
exports.getUserTracking = getUserTracking;
var getJourneysTrainByNumber = function (trainNumber) { return __awaiter(void 0, void 0, void 0, function () {
    var train;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, prisma.trainNumber.findFirst({
                    where: {
                        name: trainNumber
                    },
                    include: {
                        journeys: { include: { stations: true } }
                    }
                })];
            case 1:
                train = _a.sent();
                return [2 /*return*/, train];
        }
    });
}); };
exports.getJourneysTrainByNumber = getJourneysTrainByNumber;
var getTrainsByNumber = function (trainNum) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        return [2 /*return*/, (0, api_1.getSolutionsByTrainNumber)(trainNum)];
    });
}); };
exports.getTrainsByNumber = getTrainsByNumber;
var syncTrainByNumber = function (trainNum, classification, startLocation) { return __awaiter(void 0, void 0, void 0, function () {
    var respJson, trainNumber, trainId, existJourney, _a, _i, _b, stop_1, e_2, err;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                _c.trys.push([0, 13, , 14]);
                return [4 /*yield*/, (0, api_1.getTrainInfo)(trainNum, startLocation)];
            case 1:
                respJson = _c.sent();
                return [4 /*yield*/, prisma.trainNumber.findUnique({
                        where: {
                            name_classification: {
                                name: respJson.dateOfferedTransportMeanDeparture.name,
                                classification: respJson.dateOfferedTransportMeanDeparture.classification.classification.toLocaleLowerCase()
                            }
                        }
                    })];
            case 2:
                trainNumber = _c.sent();
                trainId = trainNumber === null || trainNumber === void 0 ? void 0 : trainNumber.id;
                _a = trainId;
                if (!_a) return [3 /*break*/, 4];
                return [4 /*yield*/, prisma.journey.findUnique({
                        where: {
                            trainNumberId_date: {
                                trainNumberId: trainId,
                                date: respJson.dateOfferedTransportMeanDeparture.date
                            }
                        }
                    })];
            case 3:
                _a = (_c.sent());
                _c.label = 4;
            case 4:
                existJourney = _a;
                if (!existJourney) return [3 /*break*/, 10];
                console.log("update del journey ", existJourney.date);
                return [4 /*yield*/, prisma.journey.update({
                        where: {
                            id: existJourney.id
                        },
                        data: {
                            delay: respJson.delay
                        }
                    })];
            case 5:
                _c.sent();
                _i = 0, _b = respJson.stops;
                _c.label = 6;
            case 6:
                if (!(_i < _b.length)) return [3 /*break*/, 9];
                stop_1 = _b[_i];
                return [4 /*yield*/, prisma.journeyStation
                        .update({
                        where: {
                            journeyId_stationId: {
                                journeyId: existJourney.id,
                                stationId: stop_1.location.locationId
                            }
                        },
                        data: {
                            plannedPlatform: stop_1.plannedPlatform,
                            actualPlatform: stop_1.actualPlatform,
                            departureTime: stop_1.departureTime,
                            arrivalTime: stop_1.arrivalTime,
                            departureDelay: stop_1.actualDepartureDelay,
                            arrivalDelay: stop_1.actualArrivalDelay
                        }
                    })["catch"](function (e) { return console.log(e); })];
            case 7:
                _c.sent();
                _c.label = 8;
            case 8:
                _i++;
                return [3 /*break*/, 6];
            case 9: return [3 /*break*/, 12];
            case 10: return [4 /*yield*/, prisma.journey.create({
                    data: {
                        date: respJson.dateOfferedTransportMeanDeparture.date,
                        trainNumber: {
                            connectOrCreate: {
                                where: {
                                    name_classification: {
                                        name: respJson.dateOfferedTransportMeanDeparture.name,
                                        classification: respJson.dateOfferedTransportMeanDeparture.classification.classification.toLocaleLowerCase()
                                    }
                                },
                                create: {
                                    name: respJson.dateOfferedTransportMeanDeparture.name,
                                    classification: respJson.dateOfferedTransportMeanDeparture.classification.classification.toLocaleLowerCase(),
                                    arrivalLocation: {
                                        connectOrCreate: {
                                            where: {
                                                id: respJson.arrivalLocation.locationId
                                            },
                                            create: {
                                                id: respJson.arrivalLocation.locationId,
                                                name: respJson.arrivalLocation.name
                                            }
                                        }
                                    },
                                    departureLocation: {
                                        connectOrCreate: {
                                            where: {
                                                id: respJson.departureLocation.locationId
                                            },
                                            create: {
                                                id: respJson.departureLocation.locationId,
                                                name: respJson.departureLocation.name
                                            }
                                        }
                                    }
                                }
                            }
                        },
                        stations: {
                            create: respJson.stops.map(function (stop) {
                                return {
                                    station: {
                                        connectOrCreate: {
                                            where: {
                                                id: stop.location.locationId
                                            },
                                            create: {
                                                id: stop.location.locationId,
                                                name: stop.location.name
                                            }
                                        }
                                    },
                                    plannedPlatform: stop.plannedPlatform,
                                    actualPlatform: stop.actualPlatform,
                                    departureTime: stop.departureTime,
                                    arrivalTime: stop.arrivalTime,
                                    departureDelay: stop.actualDepartureDelay,
                                    arrivalDelay: stop.actualArrivalDelay
                                };
                            })
                        },
                        delay: respJson.delay
                    }
                })];
            case 11:
                _c.sent();
                _c.label = 12;
            case 12: return [3 /*break*/, 14];
            case 13:
                e_2 = _c.sent();
                err = e_2;
                console.log(e_2);
                if (err.message === "canceled") {
                    // treno cancellato ho solo resp getTrainInfo in .text()
                    console.log("treno", trainNum, "cancellato");
                    (0, exports.addCanceledTrain)(trainNum, startLocation, classification);
                }
                return [3 /*break*/, 14];
            case 14: return [2 /*return*/];
        }
    });
}); };
exports.syncTrainByNumber = syncTrainByNumber;
var addCanceledTrain = function (trainNum, startLocationId, classification) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, prisma.journey.create({
                    data: {
                        trainNumber: {
                            connect: {
                                name_classification: {
                                    classification: classification.toLocaleLowerCase(),
                                    name: trainNum
                                }
                            }
                        },
                        date: new Date().toISOString(),
                        delay: 0,
                        isCanceled: true
                    }
                })];
            case 1: return [2 /*return*/, _a.sent()];
        }
    });
}); };
exports.addCanceledTrain = addCanceledTrain;
