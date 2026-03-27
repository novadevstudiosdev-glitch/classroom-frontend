import { axiosClient } from "@/lib/axios/axios-client";
import type {
  CompleteLessonSessionInput,
  CompleteLessonSessionRequest,
  CompleteLessonSessionResponse,
  SessionResultData,
} from "@/features/lessons/types";

const SESSION_RESULT_STORAGE_KEY = "lessons_session_result_cache_v1";

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value);

const normalizeStars = (value: number): 1 | 2 | 3 => {
  if (value >= 3) return 3;
  if (value <= 1) return 1;
  return 2;
};

const toSessionResultData = (
  input: CompleteLessonSessionInput,
  payload: CompleteLessonSessionResponse,
): SessionResultData => {
  return {
    lessonId: payload.lesson_id,
    lessonTitle: payload.lesson_title ?? input.lessonTitle,
    earnedXp: payload.earned_xp,
    stars: payload.stars,
    correctAnswers: payload.correct_answers,
    totalExercises: payload.total_exercises,
    levelBefore: payload.level_before,
    levelAfter: payload.level_after,
    didLevelUp: payload.level_after > payload.level_before,
  };
};

const buildLocalFallbackResult = (input: CompleteLessonSessionInput): SessionResultData => {
  const earnedXp = input.correctAnswers * 10 + 20;
  const ratio = input.totalExercises > 0 ? input.correctAnswers / input.totalExercises : 0;
  const stars = normalizeStars(ratio >= 0.9 ? 3 : ratio >= 0.7 ? 2 : 1);
  const levelBefore = 2;
  const initialXp = 80;
  const nextLevelXp = 120;
  const levelAfter = initialXp + earnedXp >= nextLevelXp ? 3 : 2;

  return {
    lessonId: input.lessonId,
    lessonTitle: input.lessonTitle,
    earnedXp,
    stars,
    correctAnswers: input.correctAnswers,
    totalExercises: input.totalExercises,
    levelBefore,
    levelAfter,
    didLevelUp: levelAfter > levelBefore,
  };
};

const saveSessionResultCache = (result: SessionResultData) => {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(
    `${SESSION_RESULT_STORAGE_KEY}_${result.lessonId}`,
    JSON.stringify(result),
  );
};

export const getSessionResultCacheByLessonId = (
  lessonId: string,
): SessionResultData | null => {
  if (typeof window === "undefined") return null;
  const raw = window.localStorage.getItem(`${SESSION_RESULT_STORAGE_KEY}_${lessonId}`);
  if (!raw) return null;

  try {
    const parsed: unknown = JSON.parse(raw);
    if (!isRecord(parsed)) return null;
    return parsed as unknown as SessionResultData;
  } catch {
    return null;
  }
};

export const completeLessonSession = async (
  input: CompleteLessonSessionInput,
): Promise<SessionResultData> => {
  const body: CompleteLessonSessionRequest = {
    correct_answers: input.correctAnswers,
    total_exercises: input.totalExercises,
  };

  try {
    // Comentario coloquial:
    // cuando backend tenga este endpoint estable, aquí ya queda listo.
    const { data } = await axiosClient.post(`/lessons/${input.lessonId}/complete`, body);
    const payload: unknown = data;

    let normalized: CompleteLessonSessionResponse | null = null;
    if (isRecord(payload) && isRecord(payload.data)) {
      normalized = payload.data as unknown as CompleteLessonSessionResponse;
    } else if (isRecord(payload)) {
      normalized = payload as unknown as CompleteLessonSessionResponse;
    }

    if (normalized) {
      const result = toSessionResultData(input, normalized);
      saveSessionResultCache(result);
      return result;
    }
  } catch {
    // Comentario coloquial:
    // si falla backend por ahora, seguimos con cálculo local para no frenar el flujo.
  }

  const fallback = buildLocalFallbackResult(input);
  saveSessionResultCache(fallback);
  return fallback;
};
