import { axiosClient } from '@/lib/axios/axios-client';
import type {
  CompleteLessonSessionInput,
  CompleteLessonSessionRequest,
  CompleteLessonSessionResponse,
  SessionResultData,
} from '@/features/lessons/types';

const SESSION_RESULT_STORAGE_KEY = 'lessons_session_result_cache_v1';

const isRecord = (value: unknown): value is Record<string, unknown> => typeof value === 'object' && value !== null && !Array.isArray(value);

const isFiniteNumber = (value: unknown): value is number => typeof value === 'number' && Number.isFinite(value);

const isSessionResultData = (value: unknown): value is SessionResultData => {
  if (!isRecord(value)) return false;

  const stars = value.stars;
  return (
    typeof value.lessonId === 'string' &&
    typeof value.lessonTitle === 'string' &&
    isFiniteNumber(value.earnedXp) &&
    (stars === 1 || stars === 2 || stars === 3) &&
    isFiniteNumber(value.correctAnswers) &&
    isFiniteNumber(value.totalExercises) &&
    isFiniteNumber(value.levelBefore) &&
    isFiniteNumber(value.levelAfter) &&
    typeof value.didLevelUp === 'boolean'
  );
};

const isCompleteLessonSessionResponse = (value: unknown): value is CompleteLessonSessionResponse => {
  if (!isRecord(value)) return false;

  const stars = value.stars;
  return (
    (typeof value.lesson_id === 'string' || value.lesson_id === undefined) &&
    (typeof value.lesson_title === 'string' || value.lesson_title === undefined) &&
    isFiniteNumber(value.earned_xp) &&
    (stars === 1 || stars === 2 || stars === 3) &&
    isFiniteNumber(value.level_before) &&
    isFiniteNumber(value.level_after)
  );
};

const toSessionResultData = (input: CompleteLessonSessionInput, payload: CompleteLessonSessionResponse): SessionResultData => ({
  lessonId: payload.lesson_id ?? input.lessonId,
  lessonTitle: payload.lesson_title ?? input.lessonTitle,
  earnedXp: payload.earned_xp,
  stars: payload.stars,
  correctAnswers: input.correctAnswers,
  totalExercises: input.totalExercises,
  levelBefore: payload.level_before,
  levelAfter: payload.level_after,
  didLevelUp: payload.level_after > payload.level_before,
});

const saveSessionResultCache = (result: SessionResultData) => {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(`${SESSION_RESULT_STORAGE_KEY}_${result.lessonId}`, JSON.stringify(result));
};

export const getSessionResultCacheByLessonId = (lessonId: string): SessionResultData | null => {
  if (typeof window === 'undefined') return null;
  const raw = window.localStorage.getItem(`${SESSION_RESULT_STORAGE_KEY}_${lessonId}`);
  if (!raw) return null;

  try {
    const parsed: unknown = JSON.parse(raw);
    return isSessionResultData(parsed) ? parsed : null;
  } catch {
    return null;
  }
};

export const startLessonProgress = async (lessonId: string): Promise<void> => {
  try {
    await axiosClient.post(`/progress/lessons/${lessonId}/start`);
    console.log(`[startLessonProgress] Progreso iniciado para lección ${lessonId}`);
  } catch (error: unknown) {
    const err = error as any;
    // Si la lección ya está en progreso, es idempotente (no error)
    if (err?.response?.status === 409 || (err?.response?.data && err.response.data.message?.includes('already'))) {
      console.log(`[startLessonProgress] Lección ${lessonId} ya estaba en progreso (idempotente)`);
      return;
    }
    console.error(`[startLessonProgress] Error al iniciar progreso:`, error);
    // No lanzar error para no bloquear la experiencia del usuario
  }
};

export const completeLessonSession = async (input: CompleteLessonSessionInput): Promise<SessionResultData> => {
  const scorePct = input.totalExercises > 0 ? Math.round((input.correctAnswers / input.totalExercises) * 100) : 0;
  const body: CompleteLessonSessionRequest = {
    score_pct: scorePct,
  };

  const { data } = await axiosClient.patch(`/progress/lessons/${input.lessonId}/complete`, body);
  const payload: unknown = data;

  const normalized =
    isRecord(payload) && isCompleteLessonSessionResponse(payload.data) ? payload.data : isCompleteLessonSessionResponse(payload) ? payload : null;

  if (!normalized) {
    throw new Error('Respuesta invalida al completar la leccion.');
  }

  const result = toSessionResultData(input, normalized);
  saveSessionResultCache(result);
  return result;
};
