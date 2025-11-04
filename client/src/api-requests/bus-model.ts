import { revalidateApiRequest } from "@/api-requests/revalidate";
import http from "@/lib/http";
import { CreateBusModel } from "@/schemas/bus-model.schema";
import { BusModel } from "@/types/bus-model.type";

const BASE_URL = "/bus-model";
const revalidateTag = "bus-model";
export const busModelApiRequest = {
  create: async (body: CreateBusModel) => {
    const res = await http.post<BusModel>(BASE_URL, body);
    await revalidateApiRequest(revalidateTag);
    return res;
  },
  update: async (id: number, body: CreateBusModel) => {
    const res = await http.put(`${BASE_URL}/${id}`, body);
    await revalidateApiRequest(revalidateTag);
    return res;
  },
  findAll: () =>
    http.get<BusModel[]>(BASE_URL, {
      cache: "force-cache",
      next: { tags: [revalidateTag] },
    }),
  delete: async (id: number) => {
    const res = await http.delete(`${BASE_URL}/${id}`);
    await revalidateApiRequest(revalidateTag);
    return res;
  },
};
