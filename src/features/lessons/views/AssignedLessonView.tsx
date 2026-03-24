"use client";

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
  const [lesson, setLesson] = useState<Lesson | null>(() => LESSONS_MOCK.find((l) => l.id === lessonId) ?? null);
  const [activeBlockIndex, setActiveBlockIndex] = useState(0);

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

  if (!lesson) {
    return (
      <main className="min-h-screen p-6">
        <p className="text-gray-600">Leccion no encontrada.</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-white">
      <AssignedLessonHeader currentIndex={activeBlockIndex} totalBlocks={totalBlocks} hearts={3} />
      <AssignedLessonSummary lesson={lesson} />

      <section className="px-6 pb-6">
        <AssignedLessonBlocks
          key={`${lesson.id}-${safeBlockIndex}`}
          lesson={lesson}
          activeBlockIndex={safeBlockIndex}
          totalBlocks={totalBlocks}
          onContinue={() =>
            setActiveBlockIndex((prev) => Math.min(lastBlockIndex, prev + 1))
          }
        />
      </section>
    </main>
  );
};

export default AssignedLessonView;
