"use client";

import { useMemo } from "react";
import {
  SessionResultActions,
  SessionResultCelebration,
  SessionResultHeader,
  SessionResultLevelUp,
  SessionResultStars,
  SessionResultXpCounter,
} from "@/features/lessons/components";
import { SESSION_RESULT_MOCK } from "@/features/lessons/data";
import type { LessonSessionResultViewProps, SessionResultData } from "@/features/lessons/types";

const toNumber = (value: string | undefined, fallback: number) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
};

const normalizeStars = (value: number): 1 | 2 | 3 => {
  if (value >= 3) return 3;
  if (value <= 1) return 1;
  return 2;
};

const LessonSessionResultView = ({
  lessonId,
  searchParams,
}: LessonSessionResultViewProps) => {
  const resultData = useMemo<SessionResultData>(() => {
    // Comentario coloquial:
    // por ahora usamos query params + fallback mock.
    // cuando backend esté listo, aquí solo reemplazas por respuesta real del endpoint de "session complete".
    const earnedXp = toNumber(searchParams?.xp, SESSION_RESULT_MOCK.earnedXp);
    const stars = normalizeStars(toNumber(searchParams?.stars, SESSION_RESULT_MOCK.stars));
    const correctAnswers = toNumber(searchParams?.correct, SESSION_RESULT_MOCK.correctAnswers);
    const totalExercises = toNumber(searchParams?.total, SESSION_RESULT_MOCK.totalExercises);
    const levelBefore = toNumber(searchParams?.levelBefore, SESSION_RESULT_MOCK.levelBefore);
    const levelAfter = toNumber(searchParams?.levelAfter, SESSION_RESULT_MOCK.levelAfter);

    return {
      lessonId,
      lessonTitle: searchParams?.lessonTitle ?? SESSION_RESULT_MOCK.lessonTitle,
      earnedXp,
      stars,
      correctAnswers,
      totalExercises,
      levelBefore,
      levelAfter,
      didLevelUp: levelAfter > levelBefore,
    };
  }, [lessonId, searchParams]);

  console.log("[LessonSessionResultView] data de resultado", resultData);

  return (
    <main className="landing-module-shell px-6 py-8">
      <div className="landing-module-content mx-auto max-w-2xl space-y-4">
        <SessionResultHeader lessonTitle={resultData.lessonTitle} />

        <SessionResultCelebration />

        <div className="grid gap-4 md:grid-cols-2">
          <SessionResultXpCounter earnedXp={resultData.earnedXp} />
          <SessionResultStars stars={resultData.stars} />
        </div>

        <section className="rounded-2xl border border-white/20 bg-white/10 p-4 text-center shadow-lg">
          <p className="text-sm text-white/80">
            Ejercicios correctos:{" "}
            <span className="font-bold text-white">
              {resultData.correctAnswers}/{resultData.totalExercises}
            </span>
          </p>
        </section>

        <SessionResultLevelUp
          didLevelUp={resultData.didLevelUp}
          levelBefore={resultData.levelBefore}
          levelAfter={resultData.levelAfter}
        />

        <SessionResultActions backHref="/lessons" backLabel="Volver al mapa" />
      </div>
    </main>
  );
};

export default LessonSessionResultView;
