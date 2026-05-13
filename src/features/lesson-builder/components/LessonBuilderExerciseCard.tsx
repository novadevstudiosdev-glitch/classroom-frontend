import { Clock3, Star } from "lucide-react";
import type { LessonBuilderExerciseCardProps } from "@/features/lesson-builder/types";

const LessonBuilderExerciseCard = ({
  order,
  exercise,
}: LessonBuilderExerciseCardProps) => {
  return (
    <article className="flex items-start justify-between gap-4 rounded-xl border border-white/20 bg-white/5 p-4 shadow-sm">
      <div className="flex items-start gap-3">
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#1CB0F6]/10 text-sm font-bold text-[#1CB0F6]">
          {order}
        </div>
        <div>
          <h3 className="text-sm font-bold text-white">{exercise.title}</h3>
          <p className="mt-1 text-xs text-white/70">{exercise.subtitle}</p>
        </div>
      </div>

      <div className="flex items-center gap-3 text-xs font-semibold text-white/80">
        <span className="inline-flex items-center gap-1">
          <Clock3 size={14} className="text-white/60" />
          {exercise.duration}
        </span>
        <span className="inline-flex items-center gap-1">
          <Star size={14} className="text-amber-500" />
          {exercise.points}
        </span>
      </div>
    </article>
  );
};

export default LessonBuilderExerciseCard;
