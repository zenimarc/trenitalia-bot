import {
  RespObjectToSolutionsBySearchID,
  ResponseAutocompletionStation,
  ResponseTrainLine,
  ResponseTrainNumber,
} from "../types";
import fetch from "cross-fetch";

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

export const getSolutionsByTrainNumber = async (
  trainNumber: string
): Promise<ResponseTrainNumber[]> => {
  const url = API + trainNumberEndpoint + "?transportName=" + trainNumber;
  const resp = await fetch(url, { headers });
  if (resp.status === 500) {
    throw Error("il server API trenitalia non risponde correttamente");
  }
  const data = await resp.json();
  return data;
};

const _getUrlByTrainNumber = async (trainNumber: string) => {
  const data = await getSolutionsByTrainNumber(trainNumber);
  return (
    API +
    trainNumberEndpoint2 +
    `?transportMeanName=${trainNumber}&origin=${data[0].startLocation.locationId}`
  );
};

const _getUrlByTrainNumberAndLocation = async (
  trainNumber: string,
  locationId: number
) => {
  return (
    API +
    trainNumberEndpoint2 +
    `?transportMeanName=${trainNumber}&origin=${locationId}`
  );
};

export const getTrainInfo = async (
  trainNumber: string,
  startLocation: number
): Promise<ResponseTrainLine> => {
  const url = await _getUrlByTrainNumberAndLocation(trainNumber, startLocation);
  //console.log("url da richiamare: ", url);
  const resp = await fetch(url, {
    headers,
  });
  //console.log("resp di url", await resp.text());
  const respText = await resp.text();
  try {
    const respJson = JSON.parse(respText);
    //console.log("json di resp a url: ", respJson);
    return respJson;
  } catch (e) {
    if (respText.includes("has been canceled")) {
      throw Error("canceled");
    } else {
      console.log("errore fetch di ", trainNumber);
      console.log(respText);
      throw e;
    }
  }
};

export const getDelay = (data: ResponseTrainLine) => data.delay;

export const getStationNameAutocompletion = async (
  partialName: string
): Promise<ResponseAutocompletionStation[]> => {
  const url =
    API +
    stationAutocompletionEndpoint +
    `?name=${partialName}&limit=100&multi=true&withbdo=false&zonaFrecce=false`;
  const resp = await fetch(url, { headers });
  const data = (await resp.json()) as ResponseAutocompletionStation[];
  Array.from(data).forEach((el) =>
    console.log("station: " + el.name + " have id: " + el.locationId)
  );
  return data;
};

export const getSearchIDByDepartureAndArrivalStations = async (
  departureStationID: number,
  arrivalStationID: number,
  departureTime = new Date().toISOString(),
  frecce: boolean = false,
  regional: boolean = false,
  maxchanges: number = -1,
  adultNo: number = 1
) => {
  const resp = await fetch(
    `${API}/Channels.AppApi/rest/search?startlocationid=${departureStationID}&endlocationid=${arrivalStationID}&arflag=A&departure_time=${encodeURIComponent(
      departureTime
    )}&adultno=${adultNo}&childno=0&direction=A&frecce=${frecce}&regional=${regional}&maxchanges=${maxchanges}&return_departure_time=${encodeURIComponent(
      departureTime
    )}`,
    { headers }
  );
  //console.log(resp);
  const respJson = await resp.json();
  return respJson;
};

// in questo momento non prende tutte le soluzioni, bisogna guardare a che sol id siamo arrivati
// e confrontare con totalSol, quindi usare parametro offset per otteneree altre sol.
export const getSolutionsBySearchID = async (
  searchID: string,
  totalSol: number,
  offset = 0
): Promise<RespObjectToSolutionsBySearchID[]> => {
  const resp = await fetch(
    API +
      "/Channels.AppApi/rest/search/" +
      searchID +
      "/solutions?offset=" +
      offset +
      "&onlyFrecce=false&onlyRegional=false&orderby=0",
    { headers }
  );
  const respText = await resp.text();
  try {
    const respJson = JSON.parse(respText);
    return respJson;
  } catch (e) {
    console.log(respText);
    throw e;
  }
};
