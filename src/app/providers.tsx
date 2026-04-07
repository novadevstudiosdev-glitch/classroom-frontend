"use client";

import { useEffect } from "react";
import { setupAxiosInterceptors } from "@/lib/axios/setup-interceptors";
import { useAuthStore } from "@/store/auth/auth.store";

let interceptorsInitialized = false;

export function Providers({ children }: { children: React.ReactNode }) {
  const { initialized, initializeAuth } = useAuthStore();

  useEffect(() => {
    if (!interceptorsInitialized) {
      setupAxiosInterceptors();
      interceptorsInitialized = true;
    }

    if (!initialized) {
      initializeAuth();
    }
  }, []);

  return <>{children}</>;
}
