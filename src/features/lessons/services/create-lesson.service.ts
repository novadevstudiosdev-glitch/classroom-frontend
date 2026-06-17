import { axiosClient } from '@/lib/axios/axios-client';
import type { CreateLessonRequest, Lesson } from '../types';

const isRecord = (value: unknown): value is Record<string, unknown> => typeof value === 'object' && value !== null && !Array.isArray(value);

const normalizeLesson = (payload: unknown): Lesson => {
  if (isRecord(payload) && isRecord(payload.data)) {
    return payload.data as unknown as Lesson;
  }

  return payload as unknown as Lesson;
};

export const createLesson = async (body: CreateLessonRequest): Promise<Lesson> => {
  const { data } = await axiosClient.post('/lessons', body);
  return normalizeLesson(data);
};
