import { create } from "zustand";
import { tokenStorage } from "@/lib/axios/token-storage";
import { getCurrentAuthUser, getMyProfile } from "@/services/users/users.service";
import type { AuthStore } from "@/types/auth.types";

export const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  status: "idle",
  initialized: false,
  isAuthenticated: false,

  initializeAuth: async () => {
    const accessToken = tokenStorage.getAccessToken();
    if (!accessToken) {
      set({
        user: null,
        status: "unauthenticated",
        initialized: true,
        isAuthenticated: false,
      });
      return;
    }

    set({ status: "loading" });

    try {
      await getCurrentAuthUser();
      const user = await getMyProfile();
      set({
        user,
        status: "authenticated",
        initialized: true,
        isAuthenticated: true,
      });
    } catch {
      tokenStorage.clearTokens();
      set({
        user: null,
        status: "unauthenticated",
        initialized: true,
        isAuthenticated: false,
      });
    }
  },

  setSession: ({ accessToken, refreshToken, user = null }) => {
    tokenStorage.setTokens(accessToken, refreshToken);

    set({
      user,
      status: "authenticated",
      initialized: true,
      isAuthenticated: true,
    });
  },

  refreshUser: async () => {
    set({ status: "loading" });

    try {
      const user = await getMyProfile();
      set({
        user,
        status: "authenticated",
        initialized: true,
        isAuthenticated: true,
      });
    } catch {
      tokenStorage.clearTokens();
      set({
        user: null,
        status: "unauthenticated",
        initialized: true,
        isAuthenticated: false,
      });
    }
  },

  logout: () => {
    tokenStorage.clearTokens();
    set({
      user: null,
      status: "unauthenticated",
      initialized: true,
      isAuthenticated: false,
    });
  },
}));
