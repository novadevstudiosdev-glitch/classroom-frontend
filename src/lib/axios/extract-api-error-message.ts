import axios from "axios";

type BackendErrorPayload = {
  message?: string | string[];
  error?: string;
  statusCode?: number;
};

export function extractApiErrorMessage(
  error: unknown,
  fallback = "No se pudo completar la operación."
) {
  if (axios.isAxiosError(error)) {
    const payload = error.response?.data as BackendErrorPayload | undefined;
    const message = payload?.message;

    if (Array.isArray(message) && message.length > 0) {
      return message.join(", ");
    }

    if (typeof message === "string" && message.trim().length > 0) {
      return message;
    }

    if (typeof payload?.error === "string" && payload.error.trim().length > 0) {
      return payload.error;
    }
  }

  if (error instanceof Error && error.message.trim().length > 0) {
    return error.message;
  }

  return fallback;
}
