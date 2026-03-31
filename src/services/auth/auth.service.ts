import axios from "axios";
import type { LoginParams, RefreshResponse } from "@/types/auth.types";

type RefreshApiResponse = {
  accessToken?: string;
  refreshToken?: string;
  access_token?: string;
  refresh_token?: string;
};

const getApiBaseUrl = () => {
  const rawBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:3000";
  const normalizedBaseUrl = rawBaseUrl.replace(/\/+$/, "");
  return normalizedBaseUrl.endsWith("/api")
    ? normalizedBaseUrl
    : `${normalizedBaseUrl}/api`;
};

const normalizeTokens = (payload: RefreshApiResponse): RefreshResponse => {
  const accessToken = payload.access_token ?? payload.accessToken ?? "";
  const refreshToken = payload.refresh_token ?? payload.refreshToken;

  return {
    accessToken,
    refreshToken,
  };
};

export async function loginWithEmail(params: LoginParams): Promise<RefreshResponse> {
  const apiBaseUrl = getApiBaseUrl();

  const response = await axios.post<RefreshApiResponse>(`${apiBaseUrl}/auth/login`, {
    email: params.email,
    password: params.password,
    recaptcha_token: params.recaptchaToken,
  });

  return normalizeTokens(response.data);
}

export async function refreshAccessToken(refreshToken: string) {
  const apiBaseUrl = getApiBaseUrl();

  const response = await axios.post<RefreshApiResponse>(
    `${apiBaseUrl}/auth/refresh`,
    { refresh_token: refreshToken }
  );

  return normalizeTokens(response.data);
}
