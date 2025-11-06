import http from "@/lib/http";
import {
  CreateBooking,
  CreateBookingPublic,
  FindAllInput,
} from "@/schemas/booking.schema";
import { Booking } from "@/types/booking.type";
import { PaginatedResponse } from "@/types/pagination.type";

const BASE_URL = "/booking";
export const bookingApiRequest = {
  find: (body: FindAllInput) =>
    http.post<PaginatedResponse<Booking>>(`${BASE_URL}/find-all`, body),
  create: (body: CreateBooking) => http.post<Booking>(BASE_URL, body),
  delete: (id: number) => http.delete(`${BASE_URL}/${id}`),
  confirmBooking: (id: number) => http.get(`${BASE_URL}/${id}/confirm`),
  cancelBooking: (id: number) => http.get(`${BASE_URL}/${id}/cancel`),
  updatePaymentStatus: (id: number) => http.get(`${BASE_URL}/${id}/payment`),
  downloadInvoice: (id: number) =>
    http.get<Blob>(`${BASE_URL}/${id}/pdf`, { responseType: "blob" }),
  createPublic: (body: CreateBookingPublic) =>
    http.post(`${BASE_URL}/public`, body),
};
