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
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
exports.__esModule = true;
exports.startDeamon = void 0;
var db_access_functions_1 = require("./db_access_functions");
var utils_1 = require("./utils/utils");
var MAX_RETRIES = 3;
var WAIT_AFTER_FIRST_TRY = 1 * 1000; // 10 minutes
var WAIT_IN_RETRY_SESSION = 1 * 1000; // 1 minute
var startDeamon = function () { return __awaiter(void 0, void 0, void 0, function () {
    var pendingRetries, trackings, _i, trackings_1, tracking, e_1, retries, stillPending;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                pendingRetries = [];
                return [4 /*yield*/, (0, db_access_functions_1.getUserTracking)("admin")];
            case 1:
                trackings = _a.sent();
                _i = 0, trackings_1 = trackings;
                _a.label = 2;
            case 2:
                if (!(_i < trackings_1.length)) return [3 /*break*/, 7];
                tracking = trackings_1[_i];
                _a.label = 3;
            case 3:
                _a.trys.push([3, 5, , 6]);
                return [4 /*yield*/, (0, db_access_functions_1.syncTrainByNumber)(tracking.name, tracking.classification, tracking.departureLocationId)];
            case 4:
                _a.sent();
                return [3 /*break*/, 6];
            case 5:
                e_1 = _a.sent();
                console.log(e_1);
                pendingRetries.push(tracking);
                return [3 /*break*/, 6];
            case 6:
                _i++;
                return [3 /*break*/, 2];
            case 7: return [4 /*yield*/, (0, utils_1.sleep)(WAIT_AFTER_FIRST_TRY)];
            case 8:
                _a.sent();
                retries = 0;
                stillPending = __spreadArray([], pendingRetries, true);
                _a.label = 9;
            case 9:
                if (!(stillPending.length > 0 && retries <= MAX_RETRIES)) return [3 /*break*/, 12];
                return [4 /*yield*/, retryErrors(stillPending)];
            case 10:
                stillPending = _a.sent();
                retries += 1;
                return [4 /*yield*/, (0, utils_1.sleep)(WAIT_IN_RETRY_SESSION)];
            case 11:
                _a.sent();
                return [3 /*break*/, 9];
            case 12: return [2 /*return*/];
        }
    });
}); };
exports.startDeamon = startDeamon;
var retryErrors = function (listToRetry) { return __awaiter(void 0, void 0, void 0, function () {
    var pendingRetries, _i, listToRetry_1, tracking, e_2;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                pendingRetries = [];
                _i = 0, listToRetry_1 = listToRetry;
                _a.label = 1;
            case 1:
                if (!(_i < listToRetry_1.length)) return [3 /*break*/, 6];
                tracking = listToRetry_1[_i];
                _a.label = 2;
            case 2:
                _a.trys.push([2, 4, , 5]);
                return [4 /*yield*/, (0, db_access_functions_1.syncTrainByNumber)(tracking.name, tracking.classification, tracking.departureLocationId)];
            case 3:
                _a.sent();
                return [3 /*break*/, 5];
            case 4:
                e_2 = _a.sent();
                console.log(e_2);
                pendingRetries.push(tracking);
                return [3 /*break*/, 5];
            case 5:
                _i++;
                return [3 /*break*/, 1];
            case 6: return [2 /*return*/, pendingRetries];
        }
    });
}); };
