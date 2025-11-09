import http from "@/lib/http";
import { CreateAccountInput } from "@/schemas/account.schema";
import { Account } from "@/types/account.type";

const BASE_URL = "/users";
export const userApiRequest = {
  getProfile: () => http.get<Account>(`${BASE_URL}/profile`),
  create: (body: CreateAccountInput) => http.post(BASE_URL, body),
  update: (id: string, body: CreateAccountInput) =>
    http.put(`${BASE_URL}/${id}`, body),
};
