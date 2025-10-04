import z from "zod";

export const PaginationSchema = z
  .object({
    pageNumber: z.number().int().min(1).default(1).optional(),
    pageSize: z.number().int().min(10).default(10).optional(),
  })
  .strict();

export type Pagination = z.TypeOf<typeof PaginationSchema>;
