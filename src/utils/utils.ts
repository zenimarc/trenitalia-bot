import { RespObjectToSolutionsBySearchID } from "../types";

export const extractTrainDataFromSolution = (
  respObj: RespObjectToSolutionsBySearchID
):
  | {
      trainName: string;
      classification: string;
      startLocationID: number;
    }
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

export type DayOfAWeekString =
  | "monday"
  | "tuesday"
  | "wednesday"
  | "thursday"
  | "friday"
  | "saturday"
  | "sunday";

export const dateDaysNamesToNumber = (day: DayOfAWeekString): number => {
  const match = {
    monday: 1,
    tuesday: 2,
    wednesday: 3,
    thursday: 4,
    friday: 5,
    saturday: 6,
    sunday: 0,
  };
  return match[day];
};
