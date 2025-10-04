import { BookingStatus, PaymentStatus } from "@/enums/booking.enum";
import { Trip } from "@/types/trip.type";

export type SeatBooking = {
  row: number;
  col: number;
};

export type Booking = {
  id: number;
  phone?: string;
  pickupLocation: string;
  tripId: number;
  seat: SeatBooking;
  paymentStatus: PaymentStatus;
  bookingStatus: BookingStatus;
  price: number;
  trip?: Trip;
};
