"use client";

import { Suspense, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/auth/auth.store";

const getRedirectByRole = (role?: string | null) => {
  if (role === "teacher") return "/dashboard/teacher";
  if (role === "parent") return "/dashboard/parent";
  if (role === "student") return "/dashboard/student";
  return "/";
};

const getTokenValue = (params: URLSearchParams, key: string) => {
  const value = params.get(key);
  return value && value.trim().length > 0 ? value : null;
};

function AuthCallbackInner() {
  const router = useRouter();
  const setSession = useAuthStore((state) => state.setSession);

  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);

    const accessToken =
      getTokenValue(searchParams, "access_token") ??
      getTokenValue(searchParams, "accessToken");
    const refreshToken =
      getTokenValue(searchParams, "refresh_token") ??
      getTokenValue(searchParams, "refreshToken") ??
      undefined;
    const role =
      getTokenValue(searchParams, "role") ??
      getTokenValue(searchParams, "profile_role");

    if (!accessToken) {
      router.replace("/register?mode=login&error=oauth");
      return;
    }

    setSession({ accessToken, refreshToken });
    router.replace(getRedirectByRole(role));
    router.refresh();
  }, [router, setSession]);

  return (
    <main className="min-h-screen flex items-center justify-center bg-slate-950 text-white">
      <div className="text-center">
        <p className="text-lg font-semibold">Conectando tu cuenta…</p>
        <p className="text-sm text-slate-300 mt-2">No cierres esta ventana.</p>
      </div>
    </main>
  );
}

export default function AuthCallbackPage() {
  return (
    <Suspense fallback={
      <main className="min-h-screen flex items-center justify-center bg-slate-950 text-white">
        <p className="text-lg font-semibold">Cargando…</p>
      </main>
    }>
      <AuthCallbackInner />
    </Suspense>
  );
}
