import { axiosClient } from "@/lib/axios/axios-client";
import { PARENT_DASHBOARD_MOCK } from "@/features/dashboard/parent/data";
import type { ParentDashboardData } from "@/features/dashboard/parent/types";

const toText = (value: unknown, fallback: string): string => {
  return typeof value === "string" && value.trim().length > 0 ? value : fallback;
};

const toNumber = (value: unknown, fallback = 0): number => {
  return typeof value === "number" && Number.isFinite(value) ? value : fallback;
};

const mapParentDashboardResponse = (
  payload: Record<string, unknown>,
  studentId: string,
): ParentDashboardData => {
  const mockChild =
    PARENT_DASHBOARD_MOCK.children.find((child) => child.id === studentId) ??
    PARENT_DASHBOARD_MOCK.children[0];

  const completedLessonsRaw = Array.isArray(payload.completed_lessons)
    ? payload.completed_lessons
    : [];

  const weeklyXpRaw = Array.isArray(payload.weekly_xp) ? payload.weekly_xp : [];

  return {
    ...PARENT_DASHBOARD_MOCK,
    profile: {
      ...PARENT_DASHBOARD_MOCK.profile,
      name: toText(payload.parent_name, PARENT_DASHBOARD_MOCK.profile.name),
    },
    streak: {
      ...PARENT_DASHBOARD_MOCK.streak,
      days: toNumber(payload.current_streak_days, PARENT_DASHBOARD_MOCK.streak.days),
    },
    lastSessionReport: {
      dateLabel: toText(
        payload.last_session_date,
        PARENT_DASHBOARD_MOCK.lastSessionReport.dateLabel,
      ),
      durationLabel: toText(
        payload.last_session_duration,
        PARENT_DASHBOARD_MOCK.lastSessionReport.durationLabel,
      ),
      xpGained: toNumber(
        payload.last_session_xp,
        PARENT_DASHBOARD_MOCK.lastSessionReport.xpGained,
      ),
      solvedExercises: toNumber(
        payload.last_session_exercises,
        PARENT_DASHBOARD_MOCK.lastSessionReport.solvedExercises,
      ),
    },
    classProgress: Array.isArray(payload.class_progress)
      ? (payload.class_progress as Record<string, unknown>[]).map((item, index) => ({
          id: toText(item.id, `class-${index}`),
          className: toText(item.class_name, "Clase"),
          completionPercent: toNumber(item.completion_percent, 0),
          completedLessons: toNumber(item.completed_lessons, 0),
          totalLessons: toNumber(item.total_lessons, 0),
        }))
      : PARENT_DASHBOARD_MOCK.classProgress,
    completedLessons:
      completedLessonsRaw.length > 0
        ? (completedLessonsRaw as Record<string, unknown>[]).map((lesson, index) => ({
            id: toText(lesson.id, `completed-${index}`),
            title: toText(lesson.title, "Lección"),
            subject: toText(lesson.subject, "Materia"),
            completedAtLabel: toText(lesson.completed_at, "Sin fecha"),
            score: toNumber(lesson.score, 0),
          }))
        : PARENT_DASHBOARD_MOCK.completedLessons,
    weeklyXp:
      weeklyXpRaw.length > 0
        ? (weeklyXpRaw as Record<string, unknown>[]).map((item, index) => ({
            dayLabel: toText(item.day_label, ["L", "M", "X", "J", "V", "S", "D"][index] ?? "D"),
            xp: toNumber(item.xp, 0),
          }))
        : PARENT_DASHBOARD_MOCK.weeklyXp,
    recentLessons: PARENT_DASHBOARD_MOCK.recentLessons,
    weeklyActivity: PARENT_DASHBOARD_MOCK.weeklyActivity,
    bottomNavigation: PARENT_DASHBOARD_MOCK.bottomNavigation,
    // dejamos este dato por si luego quieres mostrar "viendo datos de X hijo"
    children: [
      ...PARENT_DASHBOARD_MOCK.children.map((child) =>
        child.id === mockChild.id ? { ...child, name: toText(payload.student_name, child.name) } : child,
      ),
    ],
  };
};

export const getParentDashboardData = async (
  studentId: string,
): Promise<ParentDashboardData> => {
  try {
    // Endpoint pedido: GET /reports/parent/student/:student_id
    const { data } = await axiosClient.get(`/reports/parent/student/${studentId}`);

    if (data && typeof data === "object") {
      return mapParentDashboardResponse(data as Record<string, unknown>, studentId);
    }

    return PARENT_DASHBOARD_MOCK;
  } catch {
    // Fallback a mock para que la vista siga funcionando mientras conectamos backend real.
    return PARENT_DASHBOARD_MOCK;
  }
};
