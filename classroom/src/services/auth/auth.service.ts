import axios from "axios";
import type { RefreshResponse } from "@/types/auth.types";

export async function refreshAccessToken(refreshToken: string) {
  const apiBaseUrl =
    process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:3000";

  const response = await axios.post<RefreshResponse>(
    `${apiBaseUrl}/auth/refresh`,
    { refreshToken }
  );

  return response.data;
}
