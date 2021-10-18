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
  departureTime?: string;
  arrivalTime?: string;
  actualDepartureDelay?: number;
  actualArrivalDelay?: number;
  actualPlatform?: string;
  plannedPlatform: string;
  [propName: string]: any;
}

export interface ResponseTrainLine {
  dateOfferedTransportMeanDeparture: {
    name: string;
    date: string;
    classification: {
      type: string;
      classification: string;
      [propName: string]: any;
    };
  };
  departureLocation: { name: string; locationId: number };
  arrivalLocation: { name: string; locationId: number };
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
