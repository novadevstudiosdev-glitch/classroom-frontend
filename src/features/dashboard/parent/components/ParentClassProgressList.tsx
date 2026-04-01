import type { ParentClassProgressListProps } from "@/features/dashboard/parent/types";

const ParentClassProgressList = ({ items }: ParentClassProgressListProps) => {
  return (
    <section className="px-6 py-4">
      <h2 className="mb-4 text-xl font-bold text-white">Progreso por clase</h2>

      <div className="landing-module-card space-y-4">
        {items.map((item) => (
          <article key={item.id} className="rounded-xl bg-white/6 p-4">
            <div className="mb-2 flex items-center justify-between gap-2">
              <h3 className="font-bold text-white">{item.className}</h3>
              <span className="text-sm font-semibold text-[#1CB0F6]">
                {item.completionPercent}%
              </span>
            </div>

            <div className="h-2 overflow-hidden rounded-full bg-white/15">
              <div
                className="h-full rounded-full bg-[#1CB0F6] transition-all"
                style={{ width: `${item.completionPercent}%` }}
              />
            </div>

            <p className="mt-2 text-xs text-white/70">
              {item.completedLessons}/{item.totalLessons} lecciones completadas
            </p>
          </article>
        ))}
      </div>
    </section>
  );
};

export default ParentClassProgressList;
