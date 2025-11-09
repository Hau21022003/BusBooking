import { CreateAccountInput } from "@/schemas/account.schema";

// export type Account = {
//   id: string;
//   fullName: string;
//   avatar?: string;
//   email: string;
//   role: Role;
//   isActive: boolean;
//   createdAt: string;
// };

export type Account = CreateAccountInput & {
  id: string;
  createdAt: string;
};
