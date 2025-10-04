import { PaginationSchema } from "@/schemas/pagination.schema";
import z from "zod";

export const findAllSchema = PaginationSchema.extend({
  busId: z.string().optional(),
  routeId: z.string().optional(),
  startDate: z.string().datetime().optional(),
  endDate: z.string().datetime().optional(),
});

export type FindAll = z.infer<typeof findAllSchema>;
