import { revalidateApiRequest } from "@/api-requests/revalidate";
import http from "@/lib/http";
import { CreateRoute } from "@/schemas/route.schema";
import { Route } from "@/types/route.type";

const BASE_URL = "route";
export const routeApiRequest = {
  find: () =>
    http.get<Route[]>(BASE_URL, {
      cache: "force-cache",
      next: { tags: ["route"] },
    }),
  create: async (body: CreateRoute) => {
    const res = await http.post<Route>(BASE_URL, body);
    await revalidateApiRequest("route");
    return res;
  },
  update: async (id: string, body: CreateRoute) => {
    const res = await http.put<Route>(`${BASE_URL}/${id}`, body);
    await revalidateApiRequest("route");
    return res;
  },
  delete: async (id: string) => {
    const res = await http.delete(`${BASE_URL}/${id}`);
    await revalidateApiRequest("route");
    return res;
  },
};
