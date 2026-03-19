import type { UserProfile } from "./user.types";

export type AuthStatus = "idle" | "loading" | "authenticated" | "unauthenticated";

export type SetSessionInput = {
  accessToken: string;
  refreshToken?: string;
  user?: UserProfile | null;
};

export type AuthStore = {
  user: UserProfile | null;
  status: AuthStatus;
  initialized: boolean;
  isAuthenticated: boolean;
  initializeAuth: () => Promise<void>;
  setSession: (params: SetSessionInput) => void;
  refreshUser: () => Promise<void>;
  logout: () => void;
};

export type RefreshResponse = {
  accessToken: string;
  refreshToken?: string;
};
