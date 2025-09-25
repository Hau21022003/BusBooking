import authApiRequest from "@/api-requests/auth";
import { cookies } from "next/headers";

export async function POST(request: Request) {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("accessToken")?.value;
  const refreshToken = cookieStore.get("refreshToken")?.value;
  cookieStore.delete("accessToken");
  cookieStore.delete("refreshToken");
  if (!accessToken || !refreshToken) {
    return Response.json(
      {
        message: "accessToken or refreshToken is required",
      },
      { status: 200 }
    );
  }
  try {
    const result = await authApiRequest.sLogout({ accessToken, refreshToken });
    return Response.json(result.payload);
  } catch (error) {
    console.log(error);
    return Response.json(
      { message: "Something error in backend server" },
      { status: 200 }
    );
  }
}
