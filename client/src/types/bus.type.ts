import { SeatLayout } from "@/schemas/bus-model.schema";
import { CreateBus } from "@/schemas/bus.schema";
import { BusModel } from "@/types/bus-model.type";

export type Bus = CreateBus & {
  id: string;
  busModel?: BusModel;
  seatLayout: SeatLayout;
};
