import { Account } from "@/types/account.type";

export type RegisterRes = {
  accessToken: string;
  accessTokenExpiresAt: string;
  refreshToken: string;
  refreshTokenExpiresAt: string;
  account: Account;
};

export type LoginRes = RegisterRes;
