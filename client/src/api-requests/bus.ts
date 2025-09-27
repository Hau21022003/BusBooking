import http from "@/lib/http";
import { CreateBus } from "@/schemas/bus.schema";
import { Bus } from "@/types/bus.type";

const BASE_URL = "/bus";
export const busApiRequest = {
  find: () =>
    http.get<Bus[]>(BASE_URL, {
      cache: "force-cache",
      next: { tags: ["bus"] },
    }),
  create: (body: CreateBus) => http.post(BASE_URL, body),
  update: (id: string, body: CreateBus) => http.put(`${BASE_URL}/${id}`, body),
  delete: (id: string) => http.delete(`${BASE_URL}/${id}`),
};
