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
exports.getStationNameAutocompletion = exports.getDelay = exports.getTrainInfo = exports.getSolutionsByTrainNumber = void 0;
var cross_fetch_1 = __importDefault(require("cross-fetch"));
var API = "https://app.lefrecce.it/";
var trainNumberEndpoint = "Channels.AppApi/rest/transports";
var trainNumberEndpoint2 = "/Channels.AppApi/rest/transports/caring";
var stationAutocompletionEndpoint = "/Channels.AppApi/rest/locations";
var headers = {
    //cookie: JSESSIONID=0000Eo3lPaK90L2wSSFPPRKwrXL:1dhkmtc5b
    //customerdeviceid: 0e63472afb63ffdbTrenitaliac6e62dc5-1a78-4626-a42b-dc319c21d1e0
    //deviceplatformtoken: eZ1LWe2DReiC2SrbHnZ6oU:APA91bFBQuBxSYoKWNXDalicLtLmcBEIrx27bdAQmHIqBSzRXrycrc0sXmVQW8_kP191btJchDwqIuj5jbV5EDa_IxCToM3oLi-nv5nNeImKKqqx5NjiDakqOufNnXApafxcxkY_46av
    deviceplatform: "GOOGLE_ANDROID",
    channel: "804",
    "accept-language": "en",
    "client-version": "8.600.0.38815",
    "accept-encoding": "gzip, deflate",
    "user-agent": "okhttp/3.12.6"
};
var getSolutionsByTrainNumber = function (trainNumber) { return __awaiter(void 0, void 0, void 0, function () {
    var url, resp, data;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                url = API + trainNumberEndpoint + "?transportName=" + trainNumber;
                return [4 /*yield*/, (0, cross_fetch_1["default"])(url, { headers: headers })];
            case 1:
                resp = _a.sent();
                if (resp.status === 500) {
                    throw Error("il server API trenitalia non risponde correttamente");
                }
                return [4 /*yield*/, resp.json()];
            case 2:
                data = _a.sent();
                return [2 /*return*/, data];
        }
    });
}); };
exports.getSolutionsByTrainNumber = getSolutionsByTrainNumber;
var _getUrlByTrainNumber = function (trainNumber) { return __awaiter(void 0, void 0, void 0, function () {
    var data;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, (0, exports.getSolutionsByTrainNumber)(trainNumber)];
            case 1:
                data = _a.sent();
                return [2 /*return*/, (API +
                        trainNumberEndpoint2 +
                        ("?transportMeanName=" + trainNumber + "&origin=" + data[0].startLocation.locationId))];
        }
    });
}); };
var _getUrlByTrainNumberAndLocation = function (trainNumber, locationId) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        return [2 /*return*/, (API +
                trainNumberEndpoint2 +
                ("?transportMeanName=" + trainNumber + "&origin=" + locationId))];
    });
}); };
var getTrainInfo = function (trainNumber, startLocation) { return __awaiter(void 0, void 0, void 0, function () {
    var url, resp, respText, respJson;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, _getUrlByTrainNumberAndLocation(trainNumber, startLocation)];
            case 1:
                url = _a.sent();
                return [4 /*yield*/, (0, cross_fetch_1["default"])(url, {
                        headers: headers
                    })];
            case 2:
                resp = _a.sent();
                return [4 /*yield*/, resp.text()];
            case 3:
                respText = _a.sent();
                try {
                    respJson = JSON.parse(respText);
                    //console.log("json di resp a url: ", respJson);
                    return [2 /*return*/, respJson];
                }
                catch (e) {
                    if (respText.includes("has been canceled")) {
                        throw Error("canceled");
                    }
                    else {
                        console.log("errore fetch di ", trainNumber);
                        console.log(respText);
                        throw e;
                    }
                }
                return [2 /*return*/];
        }
    });
}); };
exports.getTrainInfo = getTrainInfo;
var getDelay = function (data) { return data.delay; };
exports.getDelay = getDelay;
var getStationNameAutocompletion = function (partialName) { return __awaiter(void 0, void 0, void 0, function () {
    var url, resp, data;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                url = API +
                    stationAutocompletionEndpoint +
                    ("?name=" + partialName + "&limit=100&multi=true&withbdo=false&zonaFrecce=false");
                return [4 /*yield*/, (0, cross_fetch_1["default"])(url, { headers: headers })];
            case 1:
                resp = _a.sent();
                return [4 /*yield*/, resp.json()];
            case 2:
                data = (_a.sent());
                Array.from(data).forEach(function (el) {
                    return console.log("station: " + el.name + " have id: " + el.locationId);
                });
                return [2 /*return*/];
        }
    });
}); };
exports.getStationNameAutocompletion = getStationNameAutocompletion;
