import { prisma } from "./index";

export const getSyncedTrainsByNumber = async (trainNum: string) => {
  return await prisma.trainNumber.findMany({
    where: {
      name: trainNum,
    },
    include: {
      departureLocation: true,
      arrivalLocation: true,
    },
  });
};

export const Train = prisma.trainNumber;
