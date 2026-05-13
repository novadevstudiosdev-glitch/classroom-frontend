"use client";

import { useCallback, useEffect, useState } from "react";
import { STUDENT_DASHBOARD_FALLBACK } from "@/features/dashboard/student/data";
import {
  getOrCreateStudentLinkCode,
  getStudentFeed,
  getStudentParentRequests,
  getStudentProfile,
} from "@/features/dashboard/student/services";
import type {
  StudentDashboardData,
  StudentDashboardState,
  StudentFeed,
  StudentFeedClass,
} from "@/features/dashboard/student/types/student-dashboard.types";

const SUBJECT_COLORS = ["#FFD84D", "#34D399", "#A855F7", "#FB923C", "#F43F5E", "#3B82F6"];
const SUBJECT_ICONS = ["🔢", "🔬", "📖", "🏛️", "🎨", "💻"];

const percent = (value: unknown): number => {
  if (typeof value !== "number" || !Number.isFinite(value)) return 0;
  return Math.max(0, Math.min(100, Math.round(value)));
};

const pickClasses = (feed: StudentFeed): StudentFeedClass[] => {
  if (Array.isArray(feed.classes)) return feed.classes;
  return [];
};

const mapFeedToDashboard = (feed: StudentFeed): Pick<StudentDashboardData, "subjects" | "recentActivity" | "mission"> => {
  const classes = pickClasses(feed);

  const subjects = classes.slice(0, 6).map((classItem, index) => {
    const items = Array.isArray(classItem.items) ? classItem.items : [];
    const total = items.length;
    const sum = items.reduce((acc, item) => acc + percent(item.progress_percent), 0);

    return {
      name: classItem.class_name ?? `Materia ${index + 1}`,
      progress: total > 0 ? Math.round(sum / total) : 0,
      icon: SUBJECT_ICONS[index % SUBJECT_ICONS.length],
      color: SUBJECT_COLORS[index % SUBJECT_COLORS.length],
    };
  });

  const flattened = classes.flatMap((classItem) =>
    (Array.isArray(classItem.items) ? classItem.items : []).map((item, idx) => ({
      id: item.id || `${classItem.classroom_id ?? "class"}-${idx}`,
      title: item.title || "Actividad",
      whenLabel: item.updated_at ? "Reciente" : "Hace poco",
      scoreLabel: `${percent(item.progress_percent)}%`,
      icon: item.type === "minigame" ? "🎮" : "📘",
    })),
  );

  const missionSource = flattened[0];
  const missionProgress = missionSource
    ? Math.max(1, Math.min(5, Math.round((Number.parseInt(missionSource.scoreLabel, 10) / 100) * 5)))
    : STUDENT_DASHBOARD_FALLBACK.mission.completed;

  return {
    subjects: subjects.length > 0 ? subjects : STUDENT_DASHBOARD_FALLBACK.subjects,
    recentActivity:
      flattened.length > 0
        ? flattened.slice(0, 3)
        : STUDENT_DASHBOARD_FALLBACK.recentActivity,
    mission: missionSource
      ? {
          title: missionSource.title,
          description: "Continua tu progreso en la actividad destacada.",
          completed: missionProgress,
          total: 5,
          rewardXp: 150,
        }
      : STUDENT_DASHBOARD_FALLBACK.mission,
  };
};

export const useStudentDashboard = () => {
  const [state, setState] = useState<StudentDashboardState>({
    data: STUDENT_DASHBOARD_FALLBACK,
    loading: true,
    error: null,
  });

  const fetchDashboardData = useCallback(async (): Promise<StudentDashboardData> => {
    const [profile, feed, pendingParentRequests, link] = await Promise.all([
      getStudentProfile(),
      getStudentFeed(),
      getStudentParentRequests(),
      getOrCreateStudentLinkCode(),
    ]);

    const mapped = mapFeedToDashboard(feed);

    return {
      ...STUDENT_DASHBOARD_FALLBACK,
      ...mapped,
      profile,
      pendingParentRequests,
      parentLinkCode: link?.link_code ?? null,
    };
  }, []);

  const load = useCallback(async () => {
    setState((current) => ({ ...current, loading: true, error: null }));

    try {
      const data = await fetchDashboardData();
      setState({ loading: false, error: null, data });
    } catch {
      setState({
        loading: false,
        error: "No se pudo cargar la informacion del alumno.",
        data: STUDENT_DASHBOARD_FALLBACK,
      });
    }
  }, [fetchDashboardData]);

  useEffect(() => {
    let mounted = true;

    const bootstrap = async () => {
      try {
        const data = await fetchDashboardData();
        if (!mounted) return;
        setState({ loading: false, error: null, data });
      } catch {
        if (!mounted) return;
        setState({
          loading: false,
          error: "No se pudo cargar la informacion del alumno.",
          data: STUDENT_DASHBOARD_FALLBACK,
        });
      }
    };

    void bootstrap();

    return () => {
      mounted = false;
    };
  }, [fetchDashboardData]);

  return {
    ...state,
    reload: load,
  };
};
