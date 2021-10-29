import {
  getTrainsByNumber,
  getUserTracking,
  syncTrainByNumber,
} from "./db_access_functions";

export const startDeamon = async () => {
  const trackings = await getUserTracking("admin");
  for (const tracking of trackings) {
    try {
      await syncTrainByNumber(
        tracking.name,
        tracking.classification,
        tracking.departureLocationId
      );
    } catch (e) {
      console.log(e);
    }
  }
};
