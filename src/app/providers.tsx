"use client";

import { useEffect } from "react";
import { setupAxiosInterceptors } from "@/lib/axios/setup-interceptors";
import { useAuthStore } from "@/store/auth/auth.store";

let interceptorsInitialized = false;

export function Providers({ children }: { children: React.ReactNode }) {
  const { initialized, isAuthenticated, user, initializeAuth, refreshUser } = useAuthStore();

  // One-time setup
  useEffect(() => {
    if (!interceptorsInitialized) {
      setupAxiosInterceptors();
      interceptorsInitialized = true;
    }
    if (!initialized) {
      initializeAuth();
    }
  }, []);

  // Whenever isAuthenticated but user profile is missing, fetch it
  useEffect(() => {
    if (initialized && isAuthenticated && !user) {
      refreshUser();
    }
  }, [initialized, isAuthenticated, user]);

  return <>{children}</>;
}
