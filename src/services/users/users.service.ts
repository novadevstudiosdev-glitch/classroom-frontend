import { axiosClient } from "@/lib/axios/axios-client";
import type { UserProfile } from "@/types/user.types";

export async function getMyProfile(): Promise<UserProfile> {
  const { data } = await axiosClient.get<UserProfile>("/auth/profile");
  return data;
}
