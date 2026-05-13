import { axiosClient } from "@/lib/axios/axios-client";
import type { ClassDetailData, ClassDetailStudent } from "@/features/dashboard/teacher/types";

const toClassDetailStudent = (raw: Record<string, unknown>): ClassDetailStudent => {
  const firstName = (raw.firstName as string | undefined) ?? (raw.first_name as string | undefined) ?? "";
  const lastName = (raw.lastName as string | undefined) ?? (raw.last_name as string | undefined) ?? "";
  const fullName =
    (raw.fullName as string | undefined) ??
    (raw.full_name as string | undefined) ??
    `${firstName} ${lastName}`.trim() ??
    "Alumno";

  return {
    id: (raw.id as string | undefined) ?? (raw.student_id as string | undefined) ?? fullName,
    fullName,
    progressPercent:
      (raw.progressPercent as number | undefined) ??
      (raw.progress_percent as number | undefined) ??
      0,
    lastActivity:
      (raw.lastActivity as string | undefined) ??
      (raw.last_activity as string | undefined),
  };
};

const toClassDetail = (raw: Record<string, unknown>, fallbackId: string): ClassDetailData => {
  const studentsRaw =
    (Array.isArray(raw.students) ? raw.students : []) as Record<string, unknown>[];

  return {
    classId: (raw.id as string | undefined) ?? fallbackId,
    className: (raw.name as string | undefined) ?? "Clase",
    classCode:
      (raw.code as string | undefined) ??
      (raw.invite_code as string | undefined) ??
      fallbackId,
    students: studentsRaw.map(toClassDetailStudent),
  };
};

export const getClassroomDetailById = async (
  classId: string,
): Promise<ClassDetailData> => {
  const { data } = await axiosClient.get(`/classrooms/${classId}`);
  const payload = data as Record<string, unknown>;

  if (
    payload.classroom &&
    typeof payload.classroom === "object" &&
    !Array.isArray(payload.classroom)
  ) {
    const classroom = payload.classroom as Record<string, unknown>;
    const students = Array.isArray(payload.students) ? payload.students : [];
    return toClassDetail({ ...classroom, students }, classId);
  }

  return toClassDetail(payload, classId);
};
