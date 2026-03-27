"use client";

import { useCallback } from "react";
import { SESSION_RESULT_MOCK } from "@/features/lessons/data";
import {
  completeLessonSession,
  getSessionResultCacheByLessonId,
} from "@/features/lessons/services";
import type {
  CompleteLessonSessionInput,
  LessonSessionResultViewProps,
  SessionResultData,
} from "@/features/lessons/types";

const toNumber = (value: string | undefined, fallback: number) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
};

const normalizeStars = (value: number): 1 | 2 | 3 => {
  if (value >= 3) return 3;
  if (value <= 1) return 1;
  return 2;
};

const mapQueryToSessionResult = (
  lessonId: string,
  searchParams?: LessonSessionResultViewProps["searchParams"],
): SessionResultData | null => {
  if (!searchParams) return null;
  if (!searchParams.xp && !searchParams.correct && !searchParams.total) return null;

  const earnedXp = toNumber(searchParams.xp, SESSION_RESULT_MOCK.earnedXp);
  const stars = normalizeStars(toNumber(searchParams.stars, SESSION_RESULT_MOCK.stars));
  const correctAnswers = toNumber(searchParams.correct, SESSION_RESULT_MOCK.correctAnswers);
  const totalExercises = toNumber(searchParams.total, SESSION_RESULT_MOCK.totalExercises);
  const levelBefore = toNumber(searchParams.levelBefore, SESSION_RESULT_MOCK.levelBefore);
  const levelAfter = toNumber(searchParams.levelAfter, SESSION_RESULT_MOCK.levelAfter);

  return {
    lessonId,
    lessonTitle: searchParams.lessonTitle ?? SESSION_RESULT_MOCK.lessonTitle,
    earnedXp,
    stars,
    correctAnswers,
    totalExercises,
    levelBefore,
    levelAfter,
    didLevelUp: levelAfter > levelBefore,
  };
};

export const useLessonSession = () => {
  const finalizeSession = useCallback(async (input: CompleteLessonSessionInput) => {
    console.log("[useLessonSession] finalizar sesión", input);
    return completeLessonSession(input);
  }, []);

  const resolveSessionResult = useCallback(
    (lessonId: string, searchParams?: LessonSessionResultViewProps["searchParams"]) => {
      // Comentario coloquial:
      // prioridad de datos:
      // 1) query (cuando vienes directo de la sesión)
      // 2) cache local (si recargas la página)
      // 3) mock (fallback de seguridad)
      const fromQuery = mapQueryToSessionResult(lessonId, searchParams);
      if (fromQuery) return fromQuery;

      const fromCache = getSessionResultCacheByLessonId(lessonId);
      if (fromCache) return fromCache;

      return {
        ...SESSION_RESULT_MOCK,
        lessonId,
      };
    },
    [],
  );

  return {
    finalizeSession,
    resolveSessionResult,
  };
};
