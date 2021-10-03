export interface ResponseTrainNumber {
  startTime: string;
  startLocation: { name: string; locationId: number };
  [propName: string]: any;
}

export interface TrainLocation {
  name: string;
  locationId: number;
  geographicCoordinates: { longitude: number; latitude: number };
  [propName: string]: any;
}

export interface TrainStops {
  location: TrainLocation;
  departureTime: string;
  actualDepartureDelay: string;
  actualPlatform: string;
  plannedPlatform: string;
  [propName: string]: any;
}

export interface ResponseTrainLine {
  departureLocation: { name: string };
  arrivalLocation: { name: string };
  stops: TrainStops[];
  delay: number; // delay of the train in ms
  status: string;
  [propName: string]: any;
}

export interface ResponseAutocompletionStation {
  name: string;
  locationId: number;
  [propName: string]: any;
}
