import { revalidateApiRequest } from "@/api-requests/revalidate";
import http from "@/lib/http";
import { CreateSchedule } from "@/schemas/schedule.schema";
import { Schedule } from "@/types/schedule.type";

const BASE_URL = "/schedule";
export const scheduleApiRequest = {
  find: () =>
    http.get<Schedule[]>(BASE_URL, {
      cache: "force-cache",
      next: { tags: ["schedule"] },
    }),
  create: async (body: CreateSchedule) => {
    const res = await http.post<Schedule>(BASE_URL, body);
    await revalidateApiRequest("schedule");
    return res;
  },
  update: async (id: string, body: CreateSchedule) => {
    const res = await http.put<Schedule>(`${BASE_URL}/${id}`, body);
    await revalidateApiRequest("schedule");
    return res;
  },
  updateActive: async (id: number, active: "true" | "false") => {
    const res = await http.get<Schedule>(
      `${BASE_URL}/${id}/update-active?active=${active}`
    );
    await revalidateApiRequest("schedule");
    return res;
  },
  delete: async (id: string) => {
    const res = await http.delete(`${BASE_URL}/${id}`);
    await revalidateApiRequest("schedule");
    return res;
  },
};
