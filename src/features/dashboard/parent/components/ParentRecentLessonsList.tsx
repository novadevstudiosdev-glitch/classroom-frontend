import type { ParentRecentLessonsListProps } from "@/features/dashboard/parent/types";

const ParentRecentLessonsList = ({ lessons }: ParentRecentLessonsListProps) => {
  return (
    <section className="px-6 py-4">
      <h2 className="mb-4 text-xl font-bold text-white">Últimas lecciones</h2>

      <div className="landing-module-card divide-y divide-white/10 p-0">
        {lessons.map((lesson) => (
          <article key={lesson.id} className="flex items-center gap-4 p-4">
            <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-white/10 text-2xl">
              {lesson.icon}
            </div>

            <div className="flex-1">
              <p className="text-sm font-bold text-white">{lesson.title}</p>
              <p className="text-xs text-white/70">
                {lesson.subject} • {lesson.dateLabel}
              </p>
            </div>

            <div className="flex items-center gap-2">
              <div className="flex gap-0.5">
                {Array.from({ length: lesson.stars }).map((_, index) => (
                  <span key={`${lesson.id}-star-${index}`}>⭐</span>
                ))}
              </div>
              <span className="text-sm font-bold text-[#FF9600]">+{lesson.xp}</span>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
};

export default ParentRecentLessonsList;
