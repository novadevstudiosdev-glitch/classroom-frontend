"use client";

import { useEffect } from "react";
import { setupAxiosInterceptors } from "@/lib/axios/setup-interceptors";

let interceptorsInitialized = false;

export function Providers({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    if (!interceptorsInitialized) {
      setupAxiosInterceptors();
      interceptorsInitialized = true;
    }
  }, []);

  return <>{children}</>;
}
