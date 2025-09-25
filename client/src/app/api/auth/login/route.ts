import { LoginBody } from "@/schemas/auth.schema";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import authApiRequest from "@/api-requests/auth";
import { HttpError } from "@/lib/error";

export async function POST(request: Request) {
  const body = (await request.json()) as LoginBody;
  const cookieStorage = await cookies();
  try {
    const { payload } = await authApiRequest.sLogin(body);
    const { accessToken, refreshToken } = payload;
    const decodeAccessToken = jwt.decode(accessToken) as { exp: number };
    const decodeRefreshToken = jwt.decode(refreshToken) as { exp: number };
    cookieStorage.set("accessToken", accessToken, {
      path: "/",
      httpOnly: true,
      sameSite: "lax",
      secure: true,
      expires: decodeAccessToken.exp * 1000,
    });
    cookieStorage.set("refreshToken", refreshToken, {
      path: "/",
      httpOnly: true,
      sameSite: "lax",
      secure: true,
      expires: decodeRefreshToken.exp * 1000,
    });
    return Response.json(payload);
  } catch (error) {
    if (error instanceof HttpError) {
      return Response.json(error.payload, { status: error.status });
    } else {
      return Response.json({ message: "Something error" }, { status: 500 });
    }
  }
}
