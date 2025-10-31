import { DeliveryStatus } from "@/enums/delivery.enum";
import { CreateDeliveryInput } from "@/schemas/delivery.schema";
import { Station } from "@/types/station.type";
import { Trip } from "@/types/trip.type";

export type Delivery = CreateDeliveryInput & {
  id: number;
  trip?: Trip;
  price: number;
  pickupStation?: Station;
  dropoffStation?: Station;
  status: DeliveryStatus;
};
