"use client";

import { useState } from "react";
import { ArrowRight, Plus } from "lucide-react";
import Link from "next/link";
import LessonBuilderExercisesModal from "./LessonBuilderExercisesModal";
import type { LessonBuilderExercisesSummaryCardProps } from "@/features/lesson-builder/types";

const LessonBuilderExercisesSummaryCard = ({
  totalExercises,
  exercises,
  addExerciseHref = "/lesson-builder/exercises/new",
}: LessonBuilderExercisesSummaryCardProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <section className="rounded-2xl border border-white/20 bg-white/10 p-5 shadow-sm backdrop-blur-md">
      <div className="mb-3">
        <h2 className="text-base font-bold text-white">Ejercicios</h2>
        <p className="text-sm text-white/70">
          Tienes {totalExercises} ejercicios en esta lección.
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center gap-1 rounded-lg border border-white/25 bg-white/10 px-3 py-2 text-sm font-semibold text-white hover:bg-white/20"
        >
          Ver ejercicios
          <ArrowRight size={16} />
        </button>
        <Link
          href={addExerciseHref}
          className="inline-flex items-center gap-1 rounded-lg border border-white/25 bg-white/10 px-3 py-2 text-sm font-semibold text-white hover:bg-white/20"
        >
          <Plus size={16} />
          + Agregar ejercicio
        </Link>
      </div>

      <LessonBuilderExercisesModal
        isOpen={isModalOpen}
        exercises={exercises}
        onClose={() => setIsModalOpen(false)}
      />
    </section>
  );
};

export default LessonBuilderExercisesSummaryCard;
