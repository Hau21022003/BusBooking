import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import jwt from "jsonwebtoken";
import { JwtPayload } from "@/types/jwt.type";

export default async function Home() {
  const cookieStorage = await cookies();
  const accessToken = cookieStorage.get("accessToken")?.value;

  if (accessToken) {
    const decoded = jwt.decode(accessToken) as JwtPayload | null;

    if (decoded?.role === "ADMIN") {
      return redirect("/admin/bus/list");
    }
  }

  return redirect("/home");
}
