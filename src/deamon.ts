import { getUserTracking, syncTrainByNumber } from "./db_access_functions";

export const startDeamon = async () => {
  const trackings = await getUserTracking("admin");
  for (const tracking of trackings) {
  }
};
