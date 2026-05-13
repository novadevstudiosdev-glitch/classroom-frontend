import { axiosClient } from "@/lib/axios/axios-client";
import type {
  ParentBottomNavigationItem,
  ParentClassProgressItem,
  ParentCompletedLesson,
  ParentDashboardData,
  ParentRecentLesson,
  ParentWeeklyActivityItem,
  ParentWeeklyXpItem,
} from "@/features/dashboard/parent/types";

const requireText = (value: unknown): string => {
  if (typeof value !== "string" || value.trim().length === 0) {
    throw new Error("Parent dashboard record not found");
  }

  return value;
};

const requireNumber = (value: unknown): number => {
  if (typeof value !== "number" || !Number.isFinite(value)) {
    throw new Error("Parent dashboard record not found");
  }

  return value;
};

const toStars = (value: unknown): 1 | 2 | 3 => {
  const stars = requireNumber(value);

  if (stars >= 3) return 3;
  if (stars >= 2) return 2;
  return 1;
};

const toObjectArray = (value: unknown): Record<string, unknown>[] => {
  return Array.isArray(value)
    ? value.filter((item): item is Record<string, unknown> => item !== null && typeof item === "object")
    : [];
};

const mapClassProgress = (payload: Record<string, unknown>): ParentClassProgressItem[] => {
  return toObjectArray(payload.class_progress).map((item, index) => ({
    id: typeof item.id === "string" && item.id.trim().length > 0 ? item.id : `class-${index}`,
    className: requireText(item.class_name),
    completionPercent: requireNumber(item.completion_percent),
    completedLessons: requireNumber(item.completed_lessons),
    totalLessons: requireNumber(item.total_lessons),
  }));
};

const mapCompletedLessons = (payload: Record<string, unknown>): ParentCompletedLesson[] => {
  return toObjectArray(payload.completed_lessons).map((lesson, index) => ({
    id: typeof lesson.id === "string" && lesson.id.trim().length > 0 ? lesson.id : `completed-${index}`,
    title: requireText(lesson.title),
    subject: requireText(lesson.subject),
    completedAtLabel: requireText(lesson.completed_at),
    score: requireNumber(lesson.score),
  }));
};

const mapRecentLessons = (payload: Record<string, unknown>): ParentRecentLesson[] => {
  return toObjectArray(payload.recent_lessons).map((lesson, index) => ({
    id: typeof lesson.id === "string" && lesson.id.trim().length > 0 ? lesson.id : `lesson-${index}`,
    icon: requireText(lesson.icon),
    title: requireText(lesson.title),
    subject: requireText(lesson.subject),
    dateLabel: requireText(lesson.date_label),
    stars: toStars(lesson.stars),
    xp: requireNumber(lesson.xp),
  }));
};

const mapWeeklyActivity = (payload: Record<string, unknown>): ParentWeeklyActivityItem[] => {
  return toObjectArray(payload.weekly_activity).map((item) => ({
    dayLabel: requireText(item.day_label),
    value: requireNumber(item.value),
  }));
};

const mapWeeklyXp = (payload: Record<string, unknown>): ParentWeeklyXpItem[] => {
  return toObjectArray(payload.weekly_xp).map((item) => ({
    dayLabel: requireText(item.day_label),
    xp: requireNumber(item.xp),
  }));
};

const buildBottomNavigation = (): ParentBottomNavigationItem[] => [
  { id: "home", icon: "🏠", label: "Inicio", isActive: true, href: "/dashboard/parent" },
  { id: "progress", icon: "📊", label: "Progreso", href: "/dashboard/parent/progress" },
  { id: "alerts", icon: "🔔", label: "Alertas", href: "/dashboard/parent/alerts" },
  { id: "settings", icon: "⚙️", label: "Ajustes", href: "/dashboard/parent/settings" },
];

const mapParentDashboardResponse = (payload: Record<string, unknown>): ParentDashboardData => {
  return {
    profile: {
      initials: "",
      greeting: "Hola,",
      name: requireText(payload.parent_name),
    },
    children: [],
    streak: {
      days: requireNumber(payload.current_streak_days),
      label: requireText(payload.current_streak_label),
    },
    lastSessionReport: {
      dateLabel: requireText(payload.last_session_date),
      durationLabel: requireText(payload.last_session_duration),
      xpGained: requireNumber(payload.last_session_xp),
      solvedExercises: requireNumber(payload.last_session_exercises),
    },
    classProgress: mapClassProgress(payload),
    completedLessons: mapCompletedLessons(payload),
    weeklyXp: mapWeeklyXp(payload),
    recentLessons: mapRecentLessons(payload),
    weeklyActivity: mapWeeklyActivity(payload),
    bottomNavigation: buildBottomNavigation(),
  };
};

export const getParentDashboardData = async (
  studentId: string,
): Promise<ParentDashboardData> => {
  const { data } = await axiosClient.get(`/reports/parent/student/${studentId}`);

  if (data && typeof data === "object") {
    return mapParentDashboardResponse(data as Record<string, unknown>);
  }

  throw new Error("Invalid parent dashboard response");
};
