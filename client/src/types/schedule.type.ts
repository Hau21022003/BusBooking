import { CreateSchedule } from "@/schemas/schedule.schema";
import { Bus } from "@/types/bus.type";
import { Route } from "@/types/route.type";

export type Schedule = CreateSchedule & { id: number; bus: Bus; route: Route };
