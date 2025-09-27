import { BusType, SeatType } from "@/enums/bus.enum";
import { z } from "zod";

export const seatSchema = z.object({
  id: z.string().min(1, "id is required"),
  row: z.number().int().nonnegative("row must be ≥ 0"),
  col: z.number().int().nonnegative("col must be ≥ 0"),
  type: z.enum(SeatType),
});
export type Seat = z.infer<typeof seatSchema>;

export const seatLayoutSchema = z.object({
  rows: z.number("rows is required").int().positive("rows must be positive"),
  cols: z.number("cols is required").int().positive("cols must be positive"),
  seats: z.array(seatSchema),
});
export type SeatLayout = z.infer<typeof seatLayoutSchema>;

export const createBusSchema = z.object({
  type: z.enum(BusType, "Bus type is required"),
  licensePlate: z
    .string("License plate is required")
    .min(1, "License plate is required"),
  seatLayout: seatLayoutSchema,
  imageUrl: z.string("Image is required").optional(),
});
export type CreateBus = z.infer<typeof createBusSchema>;
