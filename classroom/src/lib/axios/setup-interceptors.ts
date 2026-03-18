import type { AxiosError } from "axios";
import { axiosClient } from "./axios-client";
import { tokenStorage } from "./token-storage";
import { refreshAccessToken } from "@/services/auth/auth.service";
import type { QueueItem } from "@/types/axios-interceptors.types";

let isRefreshing = false;
let failedQueue: QueueItem[] = [];

function processQueue(error: unknown, token: string | null = null) {
  failedQueue.forEach(({ resolve, reject }) => {
    if (error) {
      reject(error);
      return;
    }

    if (token) {
      resolve(token);
    }
  });

  failedQueue = [];
}

export function setupAxiosInterceptors() {
  axiosClient.interceptors.request.use((config) => {
    const accessToken = tokenStorage.getAccessToken();

    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }

    return config;
  });

  axiosClient.interceptors.response.use(
    (response) => response,
    async (error: AxiosError) => {
      const originalRequest = error.config;
      const status = error.response?.status;

      if (!originalRequest || status !== 401) {
        return Promise.reject(error);
      }

      if (originalRequest._retry) {
        return Promise.reject(error);
      }

      const refreshToken = tokenStorage.getRefreshToken();
      if (!refreshToken) {
        tokenStorage.clearTokens();
        return Promise.reject(error);
      }

      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({
            resolve: (newAccessToken: string) => {
              originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
              resolve(axiosClient(originalRequest));
            },
            reject,
          });
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const tokens = await refreshAccessToken(refreshToken);
        tokenStorage.setTokens(tokens.accessToken, tokens.refreshToken);
        processQueue(null, tokens.accessToken);

        originalRequest.headers.Authorization = `Bearer ${tokens.accessToken}`;
        return axiosClient(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError, null);
        tokenStorage.clearTokens();
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }
  );
}
