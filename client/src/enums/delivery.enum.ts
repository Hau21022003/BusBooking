export enum DeliveryStatus {
  PENDING = "PENDING",
  IN_TRANSIT = "IN_TRANSIT",
  DELIVERED = "DELIVERED",
  CANCELLED = "CANCELLED",
  RETURNED = "RETURNED",
}

export const deliveryStatusLabels: Record<DeliveryStatus, string> = {
  [DeliveryStatus.PENDING]: "Đang chờ xử lý",
  [DeliveryStatus.IN_TRANSIT]: "Đang vận chuyển",
  [DeliveryStatus.DELIVERED]: "Đã giao hàng",
  [DeliveryStatus.CANCELLED]: "Đã hủy",
  [DeliveryStatus.RETURNED]: "Hoàn hàng",
};
