import { axiosClient } from "@/lib/axios/axios-client";
import type { TeacherClass } from "@/features/dashboard/teacher/types";

export type TeacherProfile = {
  id: string;
  user_id: string;
  first_name: string;
  last_name: string;
  country: string;
  plan_type?: string;
  created_at?: string;
  updated_at?: string;
};

export type TeacherStudentStats = {
  total: number;
  active: number;
  behind: number;
  low_participation: number;
};

export type TeacherClassStudent = {
  student_id: string;
  alias: string;
  avatar_id: string | null;
  level: number | null;
  xp_total: number | null;
  joined_at: string;
  last_activity: string | null;
  avg_score_pct: number;
  participated_lessons: number;
  absent_lessons: number;
  pending_tasks: number;
  total_lessons: number;
  participation_pct: number;
  absence_pct: number;
  low_participation: boolean;
};

export type TeacherClassProgressLesson = {
  lesson_id: string;
  title: string;
  due_date?: string | null;
  assigned_at?: string | null;
};

export type TeacherClassProgressStudent = {
  student_id: string;
  alias: string;
  avatar_id: string | null;
  xp_total: number | null;
  level: number | null;
};

export type TeacherClassProgressItem = {
  student_id: string;
  lesson_id: string;
  status: string | null;
  stars: number | null;
  score_pct: number | null;
  xp_earned: number | null;
  completed_at: string | null;
};

export type TeacherClassProgress = {
  classroom_id: string;
  classroom_name: string;
  students: TeacherClassProgressStudent[];
  lessons: TeacherClassProgressLesson[];
  progress: TeacherClassProgressItem[];
};

const extractData = <T>(payload: unknown): T => {
  if (
    typeof payload === "object" &&
    payload !== null &&
    "data" in payload &&
    (payload as { data?: T }).data !== undefined
  ) {
    return (payload as { data: T }).data;
  }

  return payload as T;
};

const readString = (value: unknown): string => {
  return typeof value === "string" ? value : "";
};

const readNumber = (value: unknown): number => {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
};

const toTeacherClass = (raw: Record<string, unknown>): TeacherClass => {
  const id = readString(raw.id ?? raw.classroom_id);
  const code = readString(raw.code ?? raw.invite_code);

  return {
    id,
    emoji: readString(raw.emoji),
    name: readString(raw.name),
    studentCount: readNumber(raw.studentCount ?? raw.students_count),
    isActive: !(raw.is_archived === true),
    completionPercent: readNumber(raw.completionPercent ?? raw.completion_percent),
    activeToday: readNumber(raw.activeToday ?? raw.active_today),
    behind: readNumber(raw.behind ?? raw.behind_count),
    code,
  };
};

export const getTeacherProfile = async (): Promise<TeacherProfile> => {
  const { data } = await axiosClient.get("/teachers/me");
  return extractData<TeacherProfile>(data);
};

export const getTeacherStudentStats = async (): Promise<TeacherStudentStats> => {
  const { data } = await axiosClient.get("/teachers/me/students/stats");
  return extractData<TeacherStudentStats>(data);
};

export const getTeacherClassrooms = async (): Promise<TeacherClass[]> => {
  const { data } = await axiosClient.get("/classrooms");
  const payload = extractData<unknown>(data);
  const rows: unknown[] = Array.isArray(payload) ? payload : [];

  return rows
    .map((row) => toTeacherClass((row ?? {}) as Record<string, unknown>))
    .filter((item) => item.id && item.name && item.code);
};

export const getTeacherClassStudents = async (
  classId: string,
): Promise<TeacherClassStudent[]> => {
  const { data } = await axiosClient.get(`/classrooms/${classId}/students/list`);
  const payload = extractData<unknown>(data);

  return Array.isArray(payload) ? (payload as TeacherClassStudent[]) : [];
};

export const getTeacherClassProgress = async (
  classId: string,
): Promise<TeacherClassProgress> => {
  const { data } = await axiosClient.get(`/classrooms/${classId}/progress`);
  return extractData<TeacherClassProgress>(data);
};
