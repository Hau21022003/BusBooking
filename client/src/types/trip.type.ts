import { SeatType } from "@/enums/bus.enum";
import { SeatStatus, TripStatus } from "@/enums/trip.enum";
import { Bus } from "@/types/bus.type";
import { Route } from "@/types/route.type";

export type SeatTrip = {
  row: number;
  col: number;
  status: SeatStatus;
  type: SeatType;
};

export type Trip = {
  id: number;
  routeId: string;
  busId: string;
  departureTime: Date;
  status: TripStatus;
  seats: SeatTrip[];
  prices: Record<SeatType, number>;
  bus: Bus;
  route: Route;
};

export type TripSearchParams = {
  busId?: string;
  routeId?: string;
  page?: string;
  date?: string;
};
