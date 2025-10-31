import http from "@/lib/http";
import { CreateDeliveryInput, FindAllInput } from "@/schemas/delivery.schema";
import { Delivery } from "@/types/delivery.type";
import { PaginatedResponse } from "@/types/pagination.type";

const BASE_URL = "/delivery";
export const deliveryApiRequest = {
  findAll: (body: FindAllInput) =>
    http.post<PaginatedResponse<Delivery>>(`${BASE_URL}/find-all`, body),
  create: (body: CreateDeliveryInput) => http.post<Delivery>(BASE_URL, body),
  update: (id: number, body: CreateDeliveryInput) =>
    http.put<Delivery>(`${BASE_URL}/${id}`, body),
  delete: (id: number) => http.delete(`${BASE_URL}/${id}`),
  calculatePrice: (body: { tripId: number; weight: number }) =>
    http.post<{ price: number }>(`${BASE_URL}/calculate-price`, body),
};
