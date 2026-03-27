"use client";

import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import {
  AssignedLessonBlocks,
  AssignedLessonHeader,
  AssignedLessonSummary,
} from "../components";
import { LESSONS_MOCK } from "../data";
import { getLessonById } from "../services";
import type { AssignedLessonViewProps, Lesson } from "../types";

const AssignedLessonView = ({ lessonId }: AssignedLessonViewProps) => {
  const router = useRouter();
  const [lesson, setLesson] = useState<Lesson | null>(() => LESSONS_MOCK.find((l) => l.id === lessonId) ?? null);
  const [activeBlockIndex, setActiveBlockIndex] = useState(0);
  const [correctExercises, setCorrectExercises] = useState(0);

  useEffect(() => {
    let mounted = true;

    const loadLesson = async () => {
      try {
        const response = await getLessonById(lessonId);
        if (!mounted) return;
        setLesson(response);
      } catch {
        if (!mounted) return;
        setLesson(LESSONS_MOCK.find((l) => l.id === lessonId) ?? null);
      }
    };

    loadLesson();

    return () => {
      mounted = false;
    };
  }, [lessonId]);

  const totalBlocks = useMemo(() => lesson?.content_json.blocks.length ?? 0, [lesson]);
  const lastBlockIndex = Math.max(0, totalBlocks - 1);
  const safeBlockIndex = Math.min(activeBlockIndex, lastBlockIndex);
  const hasPrevious = safeBlockIndex > 0;
  const hasNext = safeBlockIndex < lastBlockIndex;
  const totalExercises = useMemo(() => {
    const blocks = lesson?.content_json.blocks ?? [];
    return blocks.filter((block) =>
      ["question", "multiple_choice", "fill_blank", "true_false", "match_columns", "order_elements"].includes(block.type),
    ).length;
  }, [lesson]);

  if (!lesson) {
    return (
      <main className="landing-module-shell p-6">
        <p className="text-white/80">Leccion no encontrada.</p>
      </main>
    );
  }

  return (
    <main className="landing-module-shell">
      <AssignedLessonHeader currentIndex={activeBlockIndex} totalBlocks={totalBlocks} hearts={3} />
      <AssignedLessonSummary lesson={lesson} />

      <section className="landing-module-content px-6 pb-6">
        <AssignedLessonBlocks
          key={`${lesson.id}-${safeBlockIndex}`}
          lesson={lesson}
          activeBlockIndex={safeBlockIndex}
          totalBlocks={totalBlocks}
          hasPrevious={hasPrevious}
          hasNext={hasNext}
          onPrevious={() => {
            console.log("[AssignedLessonView] bloque anterior");
            setActiveBlockIndex((prev) => Math.max(0, prev - 1));
          }}
          onNext={() => {
            console.log("[AssignedLessonView] bloque siguiente");
            setActiveBlockIndex((prev) => Math.min(lastBlockIndex, prev + 1));
          }}
          onContinue={() => {
            // Log de control: te sirve para checar si "continuar" del bloque dispara bien.
            console.log("[AssignedLessonView] continuar desde bloque", safeBlockIndex);
            const currentBlock = lesson.content_json.blocks[safeBlockIndex];
            const isExerciseBlock = [
              "question",
              "multiple_choice",
              "fill_blank",
              "true_false",
              "match_columns",
              "order_elements",
            ].includes(currentBlock.type);

            const nextCorrectExercises = isExerciseBlock
              ? Math.min(correctExercises + 1, totalExercises)
              : correctExercises;

            if (safeBlockIndex >= lastBlockIndex) {
              const earnedXp = nextCorrectExercises * 10 + 20;
              const ratio = totalExercises > 0 ? nextCorrectExercises / totalExercises : 0;
              const stars = ratio >= 0.9 ? 3 : ratio >= 0.7 ? 2 : 1;
              const levelBefore = 2;
              const initialXp = 80;
              const nextLevelXp = 120;
              const levelAfter = initialXp + earnedXp >= nextLevelXp ? 3 : 2;

              // Comentario coloquial:
              // por ahora mando estos datos por query para avanzar el front.
              // cuando el backend de "finalizar sesión" esté, se reemplaza esta parte por su response.
              const params = new URLSearchParams({
                xp: String(earnedXp),
                stars: String(stars),
                correct: String(nextCorrectExercises),
                total: String(totalExercises),
                levelBefore: String(levelBefore),
                levelAfter: String(levelAfter),
                lessonTitle: lesson.title,
              });

              console.log("[AssignedLessonView] fin de lección, navegando a resultado", {
                lessonId,
                earnedXp,
                stars,
                nextCorrectExercises,
                totalExercises,
              });

              router.push(`/lessons/${lessonId}/result?${params.toString()}`);
              return;
            }

            if (isExerciseBlock) {
              setCorrectExercises(nextCorrectExercises);
            }

            setActiveBlockIndex((prev) => Math.min(lastBlockIndex, prev + 1));
          }}
        />
      </section>
    </main>
  );
};

export default AssignedLessonView;
