export enum BusType {
  SEAT_16 = "SEAT_16",
  SEAT_29 = "SEAT_29",
  SLEEPER_34 = "SLEEPER_34",
  LIMOUSINE_9 = "LIMOUSINE_9",
}

export enum SeatType {
  STANDARD = "STANDARD",
  FRONT = "FRONT",
  MIDDLE = "MIDDLE",
  BACK = "BACK",
  VIP = "VIP",
}

export const busTypeMap: Record<BusType, string> = {
  SEAT_16: "Xe 16 chỗ",
  LIMOUSINE_9: "Xe Limousine 9 chỗ",
  SEAT_29: "Xe 29 chỗ",
  SLEEPER_34: "Xe giường nằm 34 chỗ",
};
