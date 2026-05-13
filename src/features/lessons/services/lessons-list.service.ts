import { axiosClient } from "@/lib/axios/axios-client";
import type { Lesson } from "../types";

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value);

const normalizeLessons = (payload: unknown): Lesson[] => {
  if (Array.isArray(payload)) {
    return payload as Lesson[];
  }

  if (!isRecord(payload)) {
    return [];
  }

  if (Array.isArray(payload.data)) {
    return payload.data as Lesson[];
  }

  if (isRecord(payload.data) && Array.isArray(payload.data.data)) {
    return payload.data.data as Lesson[];
  }

  return [];
};

export const getLessonsList = async (): Promise<Lesson[]> => {
  const { data } = await axiosClient.get("/lessons");
  return normalizeLessons(data);
};

