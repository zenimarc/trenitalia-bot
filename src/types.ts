export interface ResponseTrainNumber {
  startTime: string;
  transportMeanName: string; //sarebbe il numero
  transportDenomination: string; //sarebbe la classification "eurocity..."
  startLocation: { name: string; locationId: number };
  endLocation: { name: string; locationId: number };
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

interface OfferedTransportMeanDeparture {
  name: string;
  date: string;
  classification: {
    type: string;
    classification: string;
    [propName: string]: any;
  };
}
export interface ResponseTrainLine {
  dateOfferedTransportMeanDeparture: OfferedTransportMeanDeparture;
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

export interface RespToStartEndLocationSearch {
  searchId: string;
  totalSolutions: number;
  [propName: string]: any;
}

export interface RespObjectToSolutionsBySearchID {
  date: string;
  id: { travelSolutionId: number };
  departureLocation: TrainLocation;
  arrivalLocation: TrainLocation;
  departureTime: string;
  arrivalTime: string;
  solutionNodes: [
    {
      offeredTransportMeanDeparture: OfferedTransportMeanDeparture;
      startLocation: TrainLocation;
    }
  ];
}

export interface UserTracking {
  id: string;
  name: string;
  classification: string;
  departureLocationId: number;
  departureLocationName: string;
  arrivalLocationName: string;
}

export interface ResponseAPI {
  data: [];
  messages?: string;
  errors?: [{ message: string }];
}

export type DelayDataCharts = {
  date: string;
  value: number;
}[];
