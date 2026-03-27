"use client";

import {
  SessionResultActions,
  SessionResultCelebration,
  SessionResultHeader,
  SessionResultLevelUp,
  SessionResultStars,
  SessionResultXpCounter,
} from "@/features/lessons/components";
import { useLessonSession } from "@/features/lessons/hooks";
import type { LessonSessionResultViewProps } from "@/features/lessons/types";

const LessonSessionResultView = ({
  lessonId,
  searchParams,
}: LessonSessionResultViewProps) => {
  const { resolveSessionResult } = useLessonSession();
  const resultData = resolveSessionResult(lessonId, searchParams);

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
