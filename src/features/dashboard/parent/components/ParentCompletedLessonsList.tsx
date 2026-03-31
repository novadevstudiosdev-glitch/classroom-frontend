import type { ParentCompletedLessonsListProps } from "@/features/dashboard/parent/types";

const ParentCompletedLessonsList = ({ lessons }: ParentCompletedLessonsListProps) => {
  return (
    <section className="px-6 py-4">
      <h2 className="mb-4 text-xl font-bold text-white">Lecciones completadas</h2>

      <div className="landing-module-card divide-y divide-white/10 p-0">
        {lessons.map((lesson) => (
          <article key={lesson.id} className="flex items-center justify-between gap-4 p-4">
            <div>
              <p className="text-sm font-bold text-white">{lesson.title}</p>
              <p className="text-xs text-white/70">
                {lesson.subject} • {lesson.completedAtLabel}
              </p>
            </div>

            <div className="rounded-xl bg-white/10 px-3 py-2 text-right">
              <p className="text-xs text-white/70">Puntaje</p>
              <p className="text-sm font-bold text-[#FF9600]">{lesson.score} pts</p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
};

export default ParentCompletedLessonsList;
