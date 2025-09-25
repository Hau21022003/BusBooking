import { Role } from "@/enums/user-role.enum";

export type JwtPayload = {
  exp: number;
  iat: number;
  sub: string;
  email: string;
  role: Role;
};
