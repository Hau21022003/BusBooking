import { RouteStopType } from "@/enums/route-stop";
import { z } from "zod";

export const routeStopSchema = z.object({
  stationId: z.number().optional(),
  name: z.string().min(1, "Name is required"),
  type: z.enum(RouteStopType).default(RouteStopType.STOP), // phân biệt trạm chính hay điểm dừng
  arrivalSeconds: z.number().int().nonnegative().optional(),
});

export const createRouteSchema = z.object({
  name: z
    .string("Route name is required")
    .min(1, "Route name is required")
    .max(200),
  stops: z.array(routeStopSchema),
});

export type CreateRoute = z.infer<typeof createRouteSchema>;
