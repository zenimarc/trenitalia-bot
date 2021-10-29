import {
  ResponseAutocompletionStation,
  ResponseTrainLine,
  ResponseTrainNumber,
  TrainStops,
  UserTrackings,
} from "../types";
import {
  getDelay,
  getSolutionsByTrainNumber,
  getStationNameAutocompletion,
  getTrainInfo,
} from "../api";

import { PrismaClient } from "../../prisma/generated/prisma-client-js/index.js";
import { JourneyStation } from "../../prisma/generated/prisma-client-js/index.js";
import { connect } from "http2";
import { UserNotFoundError } from "../utils/exceptions";

const prisma = new PrismaClient();

export const addUser = async (name: string) => {
  try {
    return await prisma.user.create({
      data: {
        username: name,
      },
    });
  } catch (e) {
    console.log(e);
  }
};

export const addUserTracking = async (
  username: string,
  trainNumber: string,
  classification: string
) => {
  const user = await prisma.user.findFirst({
    where: {
      username: username,
    },
  });
  if (!user) {
    throw Error("User not found");
  }

  const Train = await prisma.trainNumber.findUnique({
    where: {
      name_classification: {
        name: trainNumber,
        classification: classification,
      },
    },
  });
  if (!Train) {
    throw Error("train not found");
  }

  return await prisma.userTrackTracking.create({
    data: {
      userId: user.id,
      trainNumberId: Train.id,
    },
  });
};

export const getUserTracking = async (username: string) => {
  const user = await prisma.user.findFirst({
    where: {
      username: username,
    },
    include: {
      trackedTrains: {
        include: {
          trainNumber: true,
        },
      },
    },
  });
  if (!user) {
    throw new UserNotFoundError("user not found");
  }
  return user.trackedTrains.map((x) => {
    return {
      name: x.trainNumber.name,
      classification: x.trainNumber.classification,
      departureLocationId: x.trainNumber.departureLocationId,
    };
  });
};

export const getJourneysTrainByNumber = async (trainNumber: string) => {
  const train = await prisma.trainNumber.findFirst({
    where: {
      id: trainNumber,
    },
    include: {
      journeys: { include: { stations: true } },
    },
  });
  return train?.journeys;
};

export const getTrainsByNumber = async (trainNum: string) => {
  return getSolutionsByTrainNumber(trainNum);
};

export const syncTrainByNumber = async (
  trainNum: string,
  classification: string,
  startLocation: number
) => {
  try {
    const respJson = await getTrainInfo(trainNum, startLocation);
    //console.log("\n\n resp json:", respJson);

    const trainNumber = await prisma.trainNumber.findUnique({
      where: {
        name_classification: {
          name: respJson.dateOfferedTransportMeanDeparture.name,
          classification:
            respJson.dateOfferedTransportMeanDeparture.classification.classification.toLocaleLowerCase(),
        },
      },
    });

    const trainId = trainNumber?.id;

    const existJourney =
      trainId &&
      (await prisma.journey.findUnique({
        where: {
          trainNumberId_date: {
            trainNumberId: trainId,
            date: respJson.dateOfferedTransportMeanDeparture.date,
          },
        },
      }));
    if (existJourney) {
      console.log("update del journey ", existJourney.date);
      await prisma.journey.update({
        where: {
          id: existJourney.id,
        },
        data: {
          delay: respJson.delay,
        },
      });
      for (const stop of respJson.stops) {
        await prisma.journeyStation
          .update({
            where: {
              journeyId_stationId: {
                journeyId: existJourney.id,
                stationId: stop.location.locationId,
              },
            },
            data: {
              plannedPlatform: stop.plannedPlatform,
              actualPlatform: stop.actualPlatform,
              departureTime: stop.departureTime,
              arrivalTime: stop.arrivalTime,
              departureDelay: stop.actualDepartureDelay,
              arrivalDelay: stop.actualArrivalDelay,
            },
          })
          .catch((e) => console.log(e));
      }
    } else {
      await prisma.journey.create({
        data: {
          date: respJson.dateOfferedTransportMeanDeparture.date,
          trainNumber: {
            connectOrCreate: {
              where: {
                name_classification: {
                  name: respJson.dateOfferedTransportMeanDeparture.name,
                  classification:
                    respJson.dateOfferedTransportMeanDeparture.classification.classification.toLocaleLowerCase(),
                },
              },
              create: {
                name: respJson.dateOfferedTransportMeanDeparture.name,
                classification:
                  respJson.dateOfferedTransportMeanDeparture.classification.classification.toLocaleLowerCase(),
                arrivalLocation: {
                  connectOrCreate: {
                    where: {
                      id: respJson.arrivalLocation.locationId,
                    },
                    create: {
                      id: respJson.arrivalLocation.locationId,
                      name: respJson.arrivalLocation.name,
                    },
                  },
                },
                departureLocation: {
                  connectOrCreate: {
                    where: {
                      id: respJson.departureLocation.locationId,
                    },
                    create: {
                      id: respJson.departureLocation.locationId,
                      name: respJson.departureLocation.name,
                    },
                  },
                },
              },
            },
          },
          stations: {
            create: respJson.stops.map((stop: TrainStops) => {
              return {
                station: {
                  connectOrCreate: {
                    where: {
                      id: stop.location.locationId,
                    },
                    create: {
                      id: stop.location.locationId,
                      name: stop.location.name,
                    },
                  },
                },
                plannedPlatform: stop.plannedPlatform,
                actualPlatform: stop.actualPlatform,
                departureTime: stop.departureTime,
                arrivalTime: stop.arrivalTime,
                departureDelay: stop.actualDepartureDelay,
                arrivalDelay: stop.actualArrivalDelay,
              };
            }),
          },
          delay: respJson.delay,
        },
      });
    }
  } catch (e) {
    const err = e as Error;
    console.log(e);
    if (err.message === "canceled") {
      // treno cancellato ho solo i dati di getTrainInfo in .text()
      console.log("treno", trainNum, "cancellato");
    }
  }
};
