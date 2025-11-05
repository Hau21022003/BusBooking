import { SeatVariant } from "@/components/icon/seat-icon";

export enum SeatType {
  STANDARD = "STANDARD",
  FRONT = "FRONT",
  MIDDLE = "MIDDLE",
  BACK = "BACK",
  VIP = "VIP",
}

export const seatTypeLabels: Record<SeatType, string> = {
  [SeatType.STANDARD]: "ghế thường",
  [SeatType.VIP]: "ghế vip",
  [SeatType.FRONT]: "ghế trước",
  [SeatType.MIDDLE]: "ghế giữa",
  [SeatType.BACK]: "ghế sau",
};

export const seatVariantMap: Record<SeatType, SeatVariant> = {
  [SeatType.FRONT]: "front",
  [SeatType.MIDDLE]: "middle",
  [SeatType.BACK]: "back",
  [SeatType.STANDARD]: "default",
  [SeatType.VIP]: "vip",
};
