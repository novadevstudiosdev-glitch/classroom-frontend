
import type { LessonContentJson } from "./lesson-block.types";

export type LessonStatus = "draft" | "published";

export interface Lesson {
  id: string;
  title: string;
  description: string;
  content_json: LessonContentJson;
  status: LessonStatus;
  coverImage?: string;
  subject?: string;
  created_at?: string;
  updated_at?: string;
}

export interface CreateLessonRequest {
  title: string;
  description: string;
  content_json: LessonContentJson;
}

export type CreateLessonResponse = Lesson;

export interface UpdateLessonRequest {
  title?: string;
  description?: string;
  content_json?: LessonContentJson;
  status?: LessonStatus;
}

export type UpdateLessonResponse = Lesson;

export interface GetLessonsQuery {
  status?: LessonStatus;
  page?: number;
  limit?: number;
}

export interface PaginationMeta {
  total: number;
  page: number;
  limit: number;
}

export interface GetLessonsResponse {
  data: Lesson[];
  meta: PaginationMeta;
}
