import { SeatType } from "@/enums/bus.enum";
import { SeatStatus, TripStatus } from "@/enums/trip.enum";

export type SeatTrip = {
  row: number;
  col: number;
  status: SeatStatus;
  type: SeatType;
};

export type TripDto = {
  id: number;
  routeId: string;
  busId: string;
  departureTime: Date;
  status: TripStatus;
  seats: SeatTrip[];
  prices: Record<SeatType, number>;
};
