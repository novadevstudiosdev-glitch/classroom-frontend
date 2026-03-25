import { Plus } from "lucide-react";
import type { LessonBuilderExercisesSectionProps } from "@/features/lesson-builder/types";
import LessonBuilderExerciseCard from "./LessonBuilderExerciseCard";

const LessonBuilderExercisesSection = ({
  exercises,
}: LessonBuilderExercisesSectionProps) => {
  return (
    <section className="rounded-2xl border bg-white p-5 shadow-sm">
      <div className="mb-4 flex items-center justify-between gap-4 border-b pb-3">
        <h2 className="text-base font-bold text-gray-800">
          Ejercicios ({exercises.length})
        </h2>
        <button
          type="button"
          className="inline-flex items-center gap-1 rounded-lg bg-[#1CB0F6] px-3 py-2 text-sm font-semibold text-white hover:bg-[#1398d8]"
        >
          <Plus size={16} />
          Agregar ejercicio
        </button>
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
