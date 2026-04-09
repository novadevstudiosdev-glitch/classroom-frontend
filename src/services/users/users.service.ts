import { axiosClient } from "@/lib/axios/axios-client";
import type { UserProfile } from "@/types/user.types";

export async function getMyProfile(): Promise<UserProfile> {
  const { data } = await axiosClient.get<{ data: UserProfile } | UserProfile>("/auth/profile");
  // Backend wraps responses in { statusCode, message, data } via TransformInterceptor
  return (data as { data: UserProfile }).data ?? (data as UserProfile);
}
