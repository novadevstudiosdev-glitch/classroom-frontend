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
        <h2 className="text-base font-bold text-[#FFD700]">Ejercicios</h2>
        <p className="text-md text-white/70">
          Tienes {totalExercises} ejercicios en esta lección.
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center gap-1 rounded-lg border border-white/25 bg-gradient-to-br from-[#FFD700]/30 to-[#FF9500]/30 backdrop-blur-xl border border-white/20 shadow-lg rounded-2xl text-white px-3 py-2 text-md font-semibold text-black hover:bg-[#FF9500]"
        >
          Ver ejercicios
          <ArrowRight size={16} />
        </button>
        <Link
          href={addExerciseHref}
          className="inline-flex items-center gap-1 rounded-lg border border-white/25 bg-gradient-to-br from-[#6C63FF]/30 to-[#9B5DE5]/30 backdrop-blur-xl border border-white/20 shadow-lg rounded-2xl text-white px-3 py-2 text-sm font-semibold text-white hover:bg-[#9B5DE5]"
        >
          <Plus size={16} />
          Agregar ejercicio
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
