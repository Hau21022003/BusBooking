import { Role } from "@/enums/user-role.enum";
import http from "@/lib/http";
import { LoginBody, RegisterBody } from "@/schemas/auth.schema";
import { LoginRes, RegisterRes } from "@/types/auth.type";

const authApiRequest = {
  sLogin: (body: LoginBody) => http.post<LoginRes>("/auth/signin", body),
  login: (body: LoginBody) =>
    http.post<LoginRes>("/api/auth/login", body, { baseUrl: "" }),
  register: (body: RegisterBody) =>
    http.post<RegisterRes>("/auth/signup", body),
  forgotPassword: (email: string) => http.get(`/auth/forgot-password/${email}`),
  verifyEmail: (token: string) => http.get(`/auth/verify-email/${token}`),
  auth: (body: {
    accessToken: string;
    refreshToken: string;
  }) =>
    http.post("/api/auth", body, {
      baseUrl: "",
    }),
  sLogout: ({
    refreshToken,
    accessToken,
  }: {
    refreshToken: string;
    accessToken: string;
  }) =>
    http.post(
      "/auth/logout",
      { refreshToken },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    ),
  logout: () => http.post("/api/auth/logout", null, { baseUrl: "" }),
};

export default authApiRequest;
