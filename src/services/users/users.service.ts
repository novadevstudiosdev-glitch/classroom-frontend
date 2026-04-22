import { axiosClient } from "@/lib/axios/axios-client";
import type { UserProfile } from "@/types/user.types";

type ApiEnvelope<T> = {
  data?: T;
};

export type AuthMe = {
  sub: string;
  email: string;
  role: string;
  profile_id: string;
};

const unwrapData = <T>(payload: T | ApiEnvelope<T>): T => {
  return (payload as ApiEnvelope<T>).data ?? (payload as T);
};

export async function getCurrentAuthUser(): Promise<AuthMe> {
  const { data } = await axiosClient.get<ApiEnvelope<AuthMe> | AuthMe>("/auth/me");
  return unwrapData(data);
}

export async function getMyProfile(): Promise<UserProfile> {
  const { data } = await axiosClient.get<ApiEnvelope<UserProfile> | UserProfile>("/auth/profile");
  return unwrapData(data);
}
