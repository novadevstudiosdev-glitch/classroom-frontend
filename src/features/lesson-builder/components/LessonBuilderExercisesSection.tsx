import { Plus } from "lucide-react";
import Link from "next/link";
import type { LessonBuilderExercisesSectionProps } from "@/features/lesson-builder/types";
import LessonBuilderExerciseCard from "./LessonBuilderExerciseCard";

const LessonBuilderExercisesSection = ({
  exercises,
  addExerciseHref,
}: LessonBuilderExercisesSectionProps) => {
  return (
    <section className="rounded-2xl border border-white/20 bg-white/10 p-5 shadow-sm backdrop-blur-md">
      <div className="mb-4 flex items-center justify-between gap-3 border-b border-white/15 pb-3">
        <h2 className="text-base font-bold text-white">
          Ejercicios ({exercises.length})
        </h2>
        {addExerciseHref ? (
          <Link
            href={addExerciseHref}
            className="inline-flex items-center justify-center gap-1 rounded-lg border border-white/25 bg-white/10 px-3 py-2 text-sm font-semibold text-white hover:bg-white/20"
          >
            <Plus size={16} />
            + Agregar ejercicios
          </Link>
        ) : (
          <button
            type="button"
            className="inline-flex items-center justify-center gap-1 rounded-lg border border-white/25 bg-white/10 px-3 py-2 text-sm font-semibold text-white hover:bg-white/20"
          >
            <Plus size={16} />
            + Agregar ejercicios
          </button>
        )}
      </div>

      <div className="space-y-3">
        {exercises.map((exercise, index) => (
          <LessonBuilderExerciseCard
            key={exercise.id}
            order={index + 1}
            exercise={exercise}
          />
        ))}
      </div>
    </section>
  );
};

export default LessonBuilderExercisesSection;
