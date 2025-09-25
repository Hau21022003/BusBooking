import { Role } from "@/enums/user-role.enum";

export type Account = {
  id: string;
  fullName: string;
  avatar?: string;
  email: string;
  role: Role;
  isActive: boolean;
  createdAt: string;
};
