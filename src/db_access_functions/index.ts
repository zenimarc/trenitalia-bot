import {
  ResponseAutocompletionStation,
  ResponseTrainLine,
  ResponseTrainNumber,
  TrainStops,
} from "../types";
import { getDelay, getStationNameAutocompletion, getTrainInfo } from "../api";

import { PrismaClient } from "../../prisma/generated/prisma-client-js/index.js";
import { JourneyStation } from "../../prisma/generated/prisma-client-js/index.js";
import { connect } from "http2";

const prisma = new PrismaClient();

export const syncTrainByNumber = async (trainNum: string) => {
  const respJson = await getTrainInfo(trainNum);
  console.log("\n\n il delay è:", respJson);
  const existJourney = await prisma.journey.findUnique({
    where: {
      trainNumberId_date: {
        trainNumberId: respJson.dateOfferedTransportMeanDeparture.name,
        date: respJson.dateOfferedTransportMeanDeparture.date,
      },
    },
  });
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
              id: respJson.dateOfferedTransportMeanDeparture.name,
            },
            create: {
              id: respJson.dateOfferedTransportMeanDeparture.name,
              classification:
                respJson.dateOfferedTransportMeanDeparture.classification
                  .classification,
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
                    id: respJson.arrivalLocation.locationId,
                  },
                  create: {
                    id: respJson.arrivalLocation.locationId,
                    name: respJson.arrivalLocation.name,
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
};
