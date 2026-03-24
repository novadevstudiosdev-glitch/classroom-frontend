import { axiosClient } from "@/lib/axios/axios-client";
import type { Lesson } from "../types";

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value);

export const getLessonById = async (lessonId: string): Promise<Lesson> => {
  const { data } = await axiosClient.get(`/lessons/${lessonId}`);

  const payload: unknown = data;

  if (isRecord(payload) && isRecord(payload.data)) {
    return payload.data as unknown as Lesson;
  }

  if (isRecord(payload)) {
    return payload as unknown as Lesson;
  }

  return payload as unknown as Lesson;
};
