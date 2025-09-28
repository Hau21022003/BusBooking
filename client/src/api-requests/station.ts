import { revalidateApiRequest } from "@/api-requests/revalidate";
import http from "@/lib/http";
import { CreateStation } from "@/schemas/station.schema";
import { Station } from "@/types/station.type";

const BASE_URL = "/station";
export const stationApiRequest = {
  find: () =>
    http.get<Station[]>(BASE_URL, {
      cache: "force-cache",
      next: { tags: ["station"] },
    }),
  create: async (body: CreateStation) => {
    const res = await http.post<Station>(BASE_URL, body);
    await revalidateApiRequest("station");
    return res;
  },
  update: async (id: number, body: CreateStation) => {
    const res = await http.put<Station>(`${BASE_URL}/${id}`, body);
    await revalidateApiRequest("station");
    return res;
  },
  delete: async (id: number) => {
    const res = await http.delete(`${BASE_URL}/${id}`);
    await revalidateApiRequest("station");
    return res;
  },
};
