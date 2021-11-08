import { RespObjectToSolutionsBySearchID } from "../types";

export const extractTrainDataFromSolution = (
  respObj: RespObjectToSolutionsBySearchID
):
  | { trainName: string; classification: string; startLocationID: number }
  | undefined => {
  const solutionNode = respObj.solutionNodes.filter(
    (sol) => sol.offeredTransportMeanDeparture?.name !== undefined
  )[0];

  return (
    solutionNode && {
      trainName: solutionNode.offeredTransportMeanDeparture.name,
      classification:
        solutionNode.offeredTransportMeanDeparture.classification
          .classification,
      startLocationID: solutionNode.startLocation.locationId,
    }
  );
};

export const sleep = (ms: number) => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};
