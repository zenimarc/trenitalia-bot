"use strict";
exports.__esModule = true;
exports.extractTrainDataFromSolution = void 0;
var extractTrainDataFromSolution = function (respObj) {
    var solutionNode = respObj.solutionNodes.filter(function (sol) { var _a; return ((_a = sol.offeredTransportMeanDeparture) === null || _a === void 0 ? void 0 : _a.name) !== undefined; })[0];
    return {
        trainName: solutionNode.offeredTransportMeanDeparture.name,
        classification: solutionNode.offeredTransportMeanDeparture.classification.classification,
        startLocationID: solutionNode.startLocation.locationId
    };
};
exports.extractTrainDataFromSolution = extractTrainDataFromSolution;
