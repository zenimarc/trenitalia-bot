import {
  ResponseAutocompletionStation,
  ResponseTrainLine,
  ResponseTrainNumber,
} from "types";

const API = "https://app.lefrecce.it/";
const trainNumberEndpoint = "Channels.AppApi/rest/transports";
const trainNumberEndpoint2 = "/Channels.AppApi/rest/transports/caring";

const stationAutocompletionEndpoint = "/Channels.AppApi/rest/locations";

const headers = {
  //cookie: JSESSIONID=0000Eo3lPaK90L2wSSFPPRKwrXL:1dhkmtc5b
  //customerdeviceid: 0e63472afb63ffdbTrenitaliac6e62dc5-1a78-4626-a42b-dc319c21d1e0
  //deviceplatformtoken: eZ1LWe2DReiC2SrbHnZ6oU:APA91bFBQuBxSYoKWNXDalicLtLmcBEIrx27bdAQmHIqBSzRXrycrc0sXmVQW8_kP191btJchDwqIuj5jbV5EDa_IxCToM3oLi-nv5nNeImKKqqx5NjiDakqOufNnXApafxcxkY_46av
  deviceplatform: "GOOGLE_ANDROID",
  channel: "804",
  "accept-language": "en",
  "client-version": "8.600.0.38815",
  "accept-encoding": "gzip, deflate",
  "user-agent": "okhttp/3.12.6",
};

const _getUrlByTrainNumber = async (trainNumber: string) => {
  const url = API + trainNumberEndpoint + "?transportName=" + trainNumber;
  const resp = await fetch(url, { headers });
  const data = (await resp.json()) as ResponseTrainNumber[];
  return (
    API +
    trainNumberEndpoint2 +
    `?transportMeanName=${trainNumber}&origin=${data[0].startLocation.locationId}`
  );
};

export const getTrainInfo = async (trainNumber: string) => {
  const url = await _getUrlByTrainNumber(trainNumber);
  const resp = await fetch(url, {
    headers,
  });
  return await resp.json();
};

const getDelay = (data: ResponseTrainLine) => data.delay;

export const getStationNameAutocompletion = async (partialName: string) => {
  const url =
    API +
    stationAutocompletionEndpoint +
    `?name=${partialName}&limit=100&multi=true&withbdo=false&zonaFrecce=false`;
  const resp = await fetch(url, { headers });
  const data = (await resp.json()) as ResponseAutocompletionStation[];
  Array.from(data).forEach((el) =>
    console.log("station: " + el.name + " have id: " + el.locationId)
  );
};
