"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
var fs_1 = __importDefault(require("fs"));
var saveJsonToFile = function (json) {
    fs_1["default"].writeFile("resp.json", json, function (err) {
        console.log(err);
    });
};
exports["default"] = saveJsonToFile;
