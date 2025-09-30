import { SeatType } from "@/enums/bus.enum";
import z from "zod";

export const createScheduleSchema = z.object({
  routeId: z.string("routeId is required").min(1, "routeId is required"),
  busId: z.string("busId is required").min(1, "busId is required"),
  departureTimes: z.array(
    z
      .string()
      .regex(
        /^([0-1]\d|2[0-3]):([0-5]\d)$/,
        "Invalid time format, expected HH:mm"
      )
  ),
  prices: z.record(z.enum(SeatType), z.number()),
  active: z.boolean(),
});

export type CreateSchedule = z.infer<typeof createScheduleSchema>;
