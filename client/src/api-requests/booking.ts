import http from "@/lib/http";
import { CreateBooking, CreateBookingPublic } from "@/schemas/booking.schema";
import { Booking } from "@/types/booking.type";

const BASE_URL = "/booking";
export const bookingApiRequest = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  find: (body: any) => http.post<Booking[]>(`${BASE_URL}/find-all`, body),
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
