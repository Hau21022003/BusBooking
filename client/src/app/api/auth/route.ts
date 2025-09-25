import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
export async function POST(request: Request) {
  const body = (await request.json()) as {
    accessToken: string;
    refreshToken: string;
  };
  const { accessToken, refreshToken } = body;
  const cookieStorage = await cookies();

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

  return new Response(JSON.stringify(body), {
    status: 200,
  });
}
