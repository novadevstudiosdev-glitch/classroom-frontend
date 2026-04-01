import axios from "axios";
import { axiosClient } from "@/lib/axios/axios-client";

type ApiEnvelope<T> = {
  data?: T;
  message?: string;
  statusCode?: number;
};

type LoginRequest = {
  email: string;
  password: string;
  recaptcha_token?: string;
};

type RegisterTeacherRequest = {
  first_name: string;
  last_name: string;
  email: string;
  password: string;
  country: string;
  recaptcha_token: string;
};

type RegisterParentRequest = {
  first_name: string;
  last_name: string;
  email: string;
  password: string;
  student_email: string;
  recaptcha_token: string;
};

type LoginBackendResponse = {
  access_token?: string;
  refresh_token?: string;
  role?: string;
  profile_id?: string;
  accessToken?: string;
  refreshToken?: string;
  profileId?: string;
};

export type AuthSession = {
  accessToken: string;
  refreshToken?: string;
  role?: string;
  profileId?: string;
};

const getApiBaseUrl = () => {
  const rawBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:3000";
  return rawBaseUrl.replace(/\/+$/, "");
};

const extractData = <T>(payload: unknown): T => {
  if (
    typeof payload === "object" &&
    payload !== null &&
    "data" in payload &&
    (payload as ApiEnvelope<T>).data !== undefined
  ) {
    return (payload as ApiEnvelope<T>).data as T;
  }

  return payload as T;
};

const normalizeSession = (raw: LoginBackendResponse): AuthSession => ({
  accessToken: raw.access_token ?? raw.accessToken ?? "",
  refreshToken: raw.refresh_token ?? raw.refreshToken,
  role: raw.role,
  profileId: raw.profile_id ?? raw.profileId,
});

export async function loginWithEmailPassword(payload: LoginRequest) {
  const response = await axiosClient.post("/auth/login", payload);
  const normalized = normalizeSession(extractData<LoginBackendResponse>(response.data));

  if (!normalized.accessToken) {
    throw new Error("No se recibió access token en el login.");
  }

  return normalized;
}

export async function registerTeacher(payload: RegisterTeacherRequest) {
  const response = await axiosClient.post("/auth/register/teacher", payload);
  return extractData<{ message?: string; user_id?: string; profile_id?: string }>(response.data);
}

export async function registerParent(payload: RegisterParentRequest) {
  const response = await axiosClient.post("/auth/register/parent", payload);
  return extractData<{ message?: string; user_id?: string; profile_id?: string }>(response.data);
}

export async function refreshAccessToken(refreshToken: string) {
  const apiBaseUrl = getApiBaseUrl();

  const response = await axios.post(
    `${apiBaseUrl}/api/auth/refresh`,
    { refresh_token: refreshToken },
    {
      headers: {
        Authorization: `Bearer ${refreshToken}`,
      },
    }
  );

  const normalized = normalizeSession(extractData<LoginBackendResponse>(response.data));

  if (!normalized.accessToken) {
    throw new Error("No se recibió access token al refrescar sesión.");
  }

  return normalized;
}

export function getGoogleAuthUrl() {
  const apiBaseUrl = getApiBaseUrl();
  return apiBaseUrl.endsWith("/api")
    ? `${apiBaseUrl}/auth/google`
    : `${apiBaseUrl}/api/auth/google`;
}
