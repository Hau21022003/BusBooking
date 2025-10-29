import z from "zod";

export const createStationSchema = z.object({
  name: z.string("Name is required").min(1, "Name is required").max(100),
  province: z.string().min(1, "Province is required"),
  district: z.string().min(1, "District is required"),
  ward: z.string().min(1, "Ward is required"),
  address: z.string().max(255).optional(),
  lat: z.number("Lat is required"),
  lng: z.number("Lng is required"),
});

export type CreateStation = z.infer<typeof createStationSchema>;
