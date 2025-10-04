export enum BookingStatus {
  RESERVED = "RESERVED",
  CONFIRMED = "CONFIRMED",
  CANCELLED = "CANCELLED",
}

export const bookingStatusMap: Record<BookingStatus, string> = {
  [BookingStatus.RESERVED]: "Đã giữ chỗ",
  [BookingStatus.CONFIRMED]: "Đã xác nhận",
  [BookingStatus.CANCELLED]: "Đã hủy",
};

export enum PaymentStatus {
  PENDING = "PENDING",
  PAID = "PAID",
}

export const paymentStatusMap: Record<PaymentStatus, string> = {
  [PaymentStatus.PENDING]: "Chờ thanh toán",
  [PaymentStatus.PAID]: "Đã thanh toán",
};
