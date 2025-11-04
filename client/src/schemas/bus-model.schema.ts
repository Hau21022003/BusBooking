import { SeatType } from "@/enums/bus-model.enum";
import z from "zod";

export const seatSchema = z.object({
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

export const createBusModelSchema = z.object({
  seatLayout: seatLayoutSchema,
  imageUrl: z.string("Image is required").optional(),
  description: z.string().optional(),
  name: z.string("Name is required").min(1, "Name is required"),
});
export type CreateBusModel = z.infer<typeof createBusModelSchema>;
