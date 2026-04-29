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
  const  resultData = resolveSessionResult(lessonId, searchParams);

  console.log("[LessonSessionResultView] data de resultado", resultData);

  return (
    <main className="landing-module-shell relative overflow-hidden px-6 py-12">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-10 top-20 h-72 w-72 rounded-full bg-[#6C63FF]/30 blur-3xl" />
        <div className="absolute right-6 top-40 h-72 w-72 rounded-full bg-[#2DD4BF]/30 blur-3xl" />
        <div className="absolute bottom-10 left-1/2 h-64 w-64 -translate-x-1/2 rounded-full bg-[#FFD700]/30 blur-3xl" />
      </div>

      <div className="landing-module-content relative mx-auto max-w-4xl space-y-10">
        

        <SessionResultHeader lessonTitle={resultData.lessonTitle} />

        <SessionResultCelebration />

        <div className="grid items-center gap-8 md:grid-cols-2">
          <SessionResultXpCounter earnedXp={resultData.earnedXp} />
          <SessionResultStars stars={resultData.stars} />
        </div>

        <section className="text-center">
          <p className="inline-flex items-center gap-3 rounded-full px-6 py-3 text-lg font-black uppercase tracking-[0.08em] text-white shadow-[0_10px_30px_rgba(2,6,26,0.4)]">
            <span className="text-[#2DD4BF] text-xl">✔</span>
            Ejercicios completados:
            <span className="text-[#FFD700] text-2xl tracking-normal">
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
