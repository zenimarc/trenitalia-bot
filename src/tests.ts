import {
  getSearchIDByDepartureAndArrivalStations,
  getSolutionsBySearchID,
  getStationNameAutocompletion,
} from "./api";
import { ResponseAutocompletionStation } from "./types";
import { extractTrainDataFromSolution, sleep } from "./utils/utils";

const main = async () => {
  const startlocationID = (await getStationNameAutocompletion("domodossola"))[0]
    .locationId;
  const endlocationID = (
    await getStationNameAutocompletion("milano centrale")
  )[0].locationId;

  const { searchId, totalSolutions } =
    await getSearchIDByDepartureAndArrivalStations(
      startlocationID,
      endlocationID
    );
  console.log(searchId, totalSolutions);
  const solutions = await getSolutionsBySearchID(searchId, totalSolutions);
  const solutionsData = solutions.map((sol) =>
    extractTrainDataFromSolution(sol)
  );

  console.log(solutionsData);
  console.log("trovate", solutionsData.length, "soluzioni su", totalSolutions);
};

main();
