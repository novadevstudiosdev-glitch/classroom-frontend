import type { ParentWeeklyXpChartProps } from "@/features/dashboard/parent/types";

const ParentWeeklyXpChart = ({ items }: ParentWeeklyXpChartProps) => {
  const maxXp = Math.max(...items.map((item) => item.xp), 1);

  return (
    <section className="px-6 py-4">
      <h2 className="mb-4 text-xl font-bold text-white">XP acumulado por semana</h2>

      <div className="landing-module-card">
        <div className="flex h-44 items-end justify-between gap-2">
          {items.map((item, index) => {
            const heightPercent = Math.max((item.xp / maxXp) * 100, 6);

            return (
              <div key={`${item.dayLabel}-${index}`} className="flex flex-1 flex-col items-center gap-2">
                <span className="text-xs font-semibold text-white/75">{item.xp}</span>
                <div
                  className={`w-full rounded-t-lg ${
                    index === items.length - 1 ? "bg-[#58CC02]" : "bg-[#1CB0F6]/70"
                  }`}
                  style={{ height: `${heightPercent}%` }}
                />
                <span className="text-xs font-bold text-white/80">{item.dayLabel}</span>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default ParentWeeklyXpChart;
