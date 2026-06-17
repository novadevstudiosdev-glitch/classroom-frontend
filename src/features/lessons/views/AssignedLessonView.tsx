'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';
import { AssignedLessonBlocks, AssignedLessonHeader, AssignedLessonSummary } from '../components';
import { AuthBackgroundCanvas } from '@/features/auth/components/AuthBackgroundCanvas';
import { LESSONS_MOCK } from '../data';
import { useLessonSession } from '../hooks';
import { getLessonById, startLessonProgress } from '../services';
import type { AssignedLessonViewProps, Lesson } from '../types';

const AssignedLessonView = ({ lessonId }: AssignedLessonViewProps) => {
  const router = useRouter();
  const { finalizeSession } = useLessonSession();
  const [lesson, setLesson] = useState<Lesson | null>(() => LESSONS_MOCK.find((l) => l.id === lessonId) ?? null);
  const [activeBlockIndex, setActiveBlockIndex] = useState(0);
  const [correctExercises, setCorrectExercises] = useState(0);
  const [isStarting, setIsStarting] = useState(true);

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

  // Iniciar progreso de la lección al montar el componente
  useEffect(() => {
    let mounted = true;

    const initializeProgress = async () => {
      try {
        setIsStarting(true);
        await startLessonProgress(lessonId);
        if (!mounted) return;
        console.log(`[AssignedLessonView] Progreso de lección ${lessonId} iniciado`);
      } catch (error) {
        if (!mounted) return;
        console.error(`[AssignedLessonView] Error al iniciar progreso:`, error);
      } finally {
        if (mounted) {
          setIsStarting(false);
        }
      }
    };

    initializeProgress();

    return () => {
      mounted = false;
    };
  }, [lessonId]);

  const totalBlocks = useMemo(() => lesson?.content_json.blocks.length ?? 0, [lesson]);
  const lastBlockIndex = Math.max(0, totalBlocks - 1);
  const safeBlockIndex = Math.min(activeBlockIndex, lastBlockIndex);
  const totalExercises = useMemo(() => {
    const blocks = lesson?.content_json.blocks ?? [];
    return blocks.filter((block) =>
      ['question', 'multiple_choice', 'fill_blank', 'true_false', 'match_columns', 'order_elements'].includes(block.type),
    ).length;
  }, [lesson]);

  if (!lesson || isStarting) {
    return (
      <main className="landing-module-shell p-6">
        <p className="text-white/80">{!lesson ? 'Leccion no encontrada.' : 'Iniciando lección...'}</p>
      </main>
    );
  }

  return (
    <main className="relative min-h-screen">
      <div className="fixed inset-0 z-0">
        <AuthBackgroundCanvas />
      </div>

      <div className="landing-module-shell relative z-10 pb-24">
        <AssignedLessonHeader currentIndex={activeBlockIndex} totalBlocks={totalBlocks} hearts={3} />
        <AssignedLessonSummary lesson={lesson} />

        <section className="landing-module-content px-6 pb-6">
          <AssignedLessonBlocks
            key={`${lesson.id}-${safeBlockIndex}`}
            lesson={lesson}
            activeBlockIndex={safeBlockIndex}
            totalBlocks={totalBlocks}
            onContinue={async () => {
              console.log('[AssignedLessonView] continuar desde bloque', safeBlockIndex);
              const currentBlock = lesson.content_json.blocks[safeBlockIndex];
              const isExerciseBlock = ['question', 'multiple_choice', 'fill_blank', 'true_false', 'match_columns', 'order_elements'].includes(
                currentBlock.type,
              );

              const nextCorrectExercises = isExerciseBlock ? Math.min(correctExercises + 1, totalExercises) : correctExercises;

              if (safeBlockIndex >= lastBlockIndex) {
                const sessionResult = await finalizeSession({
                  lessonId,
                  lessonTitle: lesson.title,
                  correctAnswers: nextCorrectExercises,
                  totalExercises,
                });

                const params = new URLSearchParams({
                  xp: String(sessionResult.earnedXp),
                  stars: String(sessionResult.stars),
                  correct: String(sessionResult.correctAnswers),
                  total: String(sessionResult.totalExercises),
                  levelBefore: String(sessionResult.levelBefore),
                  levelAfter: String(sessionResult.levelAfter),
                  lessonTitle: sessionResult.lessonTitle,
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
      </div>
    </main>
  );
};

export default AssignedLessonView;
