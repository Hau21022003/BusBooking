export enum Role {
  ADMIN = "ADMIN",
  STATION_STAFF = "STATION_STAFF",
}

export const roleLabels: Record<Role, string> = {
  [Role.ADMIN]: "Quản trị",
  [Role.STATION_STAFF]: "Nhân viên",
};
