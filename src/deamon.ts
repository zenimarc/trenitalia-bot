import {
  getTrainsByNumber,
  getUserTracking,
  syncTrainByNumber,
} from "./db_access_functions";
import { UserTracking } from "./types";
import { sleep } from "./utils/utils";

const MAX_RETRIES = 3;
const WAIT_AFTER_FIRST_TRY = 1 * 1000; // 10 minutes
const WAIT_IN_RETRY_SESSION = 1 * 1000; // 1 minute

export const startDeamon = async () => {
  const pendingRetries = [];

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
      pendingRetries.push(tracking);
    }
  }

  await sleep(WAIT_AFTER_FIRST_TRY);

  let retries = 0;
  let stillPending = [...pendingRetries];

  while (stillPending.length > 0 && retries <= MAX_RETRIES) {
    stillPending = await retryErrors(stillPending);
    retries += 1;
    await sleep(WAIT_IN_RETRY_SESSION);
  }
};

const retryErrors = async (
  listToRetry: UserTracking[]
): Promise<UserTracking[]> => {
  const pendingRetries = [];
  for (const tracking of listToRetry) {
    try {
      await syncTrainByNumber(
        tracking.name,
        tracking.classification,
        tracking.departureLocationId
      );
    } catch (e) {
      console.log(e);
      pendingRetries.push(tracking);
    }
  }
  return pendingRetries;
};
