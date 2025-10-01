import z from "zod";

const departureTimeSchema = z.object({
  hour: z.number().int().min(0).max(23),
  minute: z.number().int().min(0).max(59),
});

export const createScheduleSchema = z.object({
  routeId: z.string("routeId is required").min(1, "routeId is required"),
  busId: z.string("busId is required").min(1, "busId is required"),
  departureTimes: z.array(departureTimeSchema),
  prices: z.object({
    STANDARD: z.number().optional(),
    FRONT: z.number().optional(),
    MIDDLE: z.number().optional(),
    BACK: z.number().optional(),
    VIP: z.number().optional(),
  }),
  active: z.boolean(),
});

export type CreateSchedule = z.infer<typeof createScheduleSchema>;
