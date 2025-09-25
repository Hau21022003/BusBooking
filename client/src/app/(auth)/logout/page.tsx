"use client";

import authApiRequest from "@/api-requests/auth";
import { authStorage } from "@/storage/features/auth.storage";
import { useAppStore } from "@/stores/app-store";
import { usePathname, useRouter } from "next/navigation";
import { Suspense, useEffect } from "react";

function LogoutLogic() {
  const router = useRouter();
  const pathname = usePathname();
  const { setUser } = useAppStore();
  useEffect(() => {
    const controller = new AbortController();

    authApiRequest
      .logout()
      .then(() => {
        authStorage.clear();
        setUser(null);
        router.replace(`/login?redirectFrom=${pathname}`);
      })
      .catch((err) => {
        console.error("Logout failed:", err);
        router.replace(`/login?redirectFrom=${pathname}`);
      });

    return () => {
      controller.abort();
    };
  }, [router, pathname, setUser]);
  return <div className="text-sm text-gray-400">Logging out...</div>;
}

export default function LogoutPage() {
  return (
    <Suspense>
      <LogoutLogic />
    </Suspense>
  );
}
