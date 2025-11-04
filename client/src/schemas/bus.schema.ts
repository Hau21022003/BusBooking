import { z } from "zod";

export const createBusSchema = z.object({
  licensePlate: z
    .string("License plate is required")
    .min(1, "License plate is required"),
  busModelId: z.number("Bus model is required"),
});
export type CreateBus = z.infer<typeof createBusSchema>;
