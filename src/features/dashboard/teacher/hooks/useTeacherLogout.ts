"use client";

import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/auth/auth.store";
import { useTeacherIdentityStore } from "../store/teacher-identity.store";

export const useTeacherLogout = () => {
  const router = useRouter();
  const logout = useAuthStore((state) => state.logout);
  const resetTeacherIdentity = useTeacherIdentityStore((state) => state.reset);

  return () => {
    resetTeacherIdentity();
    logout();
    router.replace("/");
  };
};
