import { axiosClient } from "@/lib/axios/axios-client";
import type { TeacherClass } from "@/features/dashboard/teacher/types";

const toTeacherClass = (raw: Record<string, unknown>): TeacherClass => {
  const id =
    (raw.id as string | undefined) ??
    (raw.classroom_id as string | undefined) ??
    (raw.code as string | undefined) ??
    (raw.invite_code as string | undefined);

  const code =
    (raw.code as string | undefined) ??
    (raw.invite_code as string | undefined) ??
    id ??
    "";

  return {
    id,
    emoji: (raw.emoji as string | undefined) ?? "📚",
    name: (raw.name as string | undefined) ?? "Clase sin nombre",
    studentCount:
      (raw.studentCount as number | undefined) ??
      (raw.students_count as number | undefined) ??
      0,
    isActive:
      (raw.isActive as boolean | undefined) ??
      !(raw.is_archived as boolean | undefined),
    completionPercent:
      (raw.completionPercent as number | undefined) ??
      (raw.completion_percent as number | undefined) ??
      0,
    activeToday:
      (raw.activeToday as number | undefined) ??
      (raw.active_today as number | undefined) ??
      0,
    behind:
      (raw.behind as number | undefined) ??
      (raw.behind_count as number | undefined) ??
      0,
    code,
  };
};

export const getTeacherClassrooms = async (): Promise<TeacherClass[]> => {
  const { data } = await axiosClient.get("/classrooms");

  const rows = Array.isArray(data)
    ? data
    : Array.isArray(data?.items)
      ? data.items
      : Array.isArray(data?.data)
        ? data.data
        : [];

  return rows.map((row) => toTeacherClass(row as Record<string, unknown>));
};
