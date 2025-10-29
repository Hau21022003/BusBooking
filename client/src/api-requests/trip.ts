import { TripStatus } from "@/enums/trip.enum";
import http from "@/lib/http";
import { FindAll, FindAllPublic } from "@/schemas/trip.schema";
import { PaginatedResponse } from "@/types/pagination.type";
import { Trip } from "@/types/trip.type";

const BASE_URL = "/trip";
export const tripApiRequest = {
  findAll: (body: FindAll) =>
    http.post<PaginatedResponse<Trip>>(`${BASE_URL}/find-all`, body),
  delete: (tripId: number) => http.delete(`${BASE_URL}/${tripId}`),
  updateStatus: (tripId: number, status: TripStatus) =>
    http.put(`${BASE_URL}/${tripId}/update-status`, { status }),
  findAllPublic: (body: FindAllPublic) => {
    const params = new URLSearchParams();

    if (body.busType) params.append("busType", body.busType);
    if (body.date) params.append("date", body.date);
    if (body.routeId) params.append("routeId", body.routeId);

    const queryString = params.toString();
    const url = `${BASE_URL}/find-all-public${
      queryString ? `?${queryString}` : ""
    }`;

    return http.get<Trip[]>(url);
  },
  findOne: (tripId: number) => http.get<Trip>(`${BASE_URL}/${tripId}`),
};
