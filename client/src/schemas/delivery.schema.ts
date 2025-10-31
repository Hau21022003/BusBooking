import { DeliveryStatus } from "@/enums/delivery.enum";
import z from "zod";

export const createDeliverySchema = z.object({
  senderName: z
    .string("senderName is required")
    .min(1, "senderName is required"),
  senderPhone: z
    .string("senderPhone is required")
    .min(1, "senderPhone is required"),
  receiverName: z
    .string("receiverName is required")
    .min(1, "receiverName is required"),
  receiverPhone: z
    .string("receiverPhone is required")
    .min(1, "receiverPhone is required"),

  pickupStationId: z.number("pickupLocation is required"),
  dropoffStationId: z.number("dropoffLocation is required"),

  routeId: z.string(),

  weight: z
    .number("weight is required")
    .positive("weight must be greater than 0"),

  description: z.string().optional(),

  status: z.enum(DeliveryStatus).optional(),
  tripId: z.number().int().positive().optional(),
});

export type CreateDeliveryInput = z.infer<typeof createDeliverySchema>;

export const FindAllSchema = z.object({
  startDate: z.string().datetime().optional(),
  endDate: z.string().datetime().optional(),
  search: z.string().optional(),
});
export type FindAllInput = z.infer<typeof FindAllSchema>;
