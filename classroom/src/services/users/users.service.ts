import { axiosClient } from "@/lib/axios/axios-client";
import type { UserProfile } from "@/types/user.types";

export async function getMyProfile() {
  const response = await axiosClient.get<UserProfile>("/users/me");
  return response.data;
}
