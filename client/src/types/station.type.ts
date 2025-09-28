import { CreateStation } from "@/schemas/station.schema";

export type Station = CreateStation & { id: number; fullAddress: string };
