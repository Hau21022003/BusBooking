"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { userApiRequest } from "@/api-requests/user";
import { handleErrorApi } from "@/lib/error";
import { authStorage } from "@/storage/features/auth.storage";
import authApiRequest from "@/api-requests/auth";
import { useAppStore } from "@/stores/app-store";

export default function GoogleSuccessPage() {
  const router = useRouter();
  const { setUser } = useAppStore();

  const load = async () => {
    const url = new URL(window.location.href);
    const accessToken = url.searchParams.get("accessToken");
    const refreshToken = url.searchParams.get("refreshToken");

    if (accessToken && refreshToken) {
      authStorage.saveAccessToken(accessToken);
      try {
        const rsp = await userApiRequest.getProfile();
        const user = rsp.payload;
        await authApiRequest.auth({
          accessToken,
          refreshToken,
        });
        setUser(user);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (error: any) {
        handleErrorApi({
          error,
        });
      }

      router.replace("/");
    } else {
      router.replace("/login");
    }
  };
  useEffect(() => {
    load();
  }, [router]);

  return <p>Log in...</p>;
}
