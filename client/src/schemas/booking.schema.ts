import { BookingStatus, PaymentStatus } from "@/enums/booking.enum";
import z from "zod";

export const SeatSchema = z.object({
  row: z.number().int().nonnegative().describe("Row index (integer >= 0)"),
  col: z.number().int().nonnegative().describe("Col index (integer >= 0)"),
});
export type SeatDto = z.infer<typeof SeatSchema>;

export const CreateBookingSchema = z.object({
  phone: z.string().optional(),
  pickupLocation: z.string().optional(),
  tripId: z.number().int().positive(),
  seat: SeatSchema,
  paymentStatus: z.enum(PaymentStatus),
  bookingStatus: z.enum([BookingStatus.CONFIRMED, BookingStatus.RESERVED]),
});
export type CreateBooking = z.infer<typeof CreateBookingSchema>;

export const CreateBookingPublicSchema = z.object({
  phone: z
    .string("Vui lòng nhập số điện thoại")
    .min(0, "Vui lòng nhập số điện thoại"),
  pickupLocation: z
    .string("Vui lòng nhập địa điểm đón")
    .min(0, "Vui lòng nhập địa điểm đón"),
  tripId: z.number().int().positive(),
  seat: SeatSchema,
});
export type CreateBookingPublic = z.infer<typeof CreateBookingPublicSchema>;
