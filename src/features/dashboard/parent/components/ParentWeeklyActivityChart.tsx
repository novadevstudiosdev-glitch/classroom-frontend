import type { ParentWeeklyActivityChartProps } from "@/features/dashboard/parent/types";

const ParentWeeklyActivityChart = ({ activity }: ParentWeeklyActivityChartProps) => {
  return (
    <section className="px-6 py-4">
      <h2 className="mb-4 text-xl font-bold text-white">Actividad semanal</h2>

      <div className="landing-module-card">
        <div className="flex h-40 items-end justify-between gap-2">
          {activity.map((item, index) => (
            <div key={item.dayLabel} className="flex flex-1 flex-col items-center gap-2">
              <div
                className={`w-full rounded-t-lg ${index === activity.length - 1 ? "bg-[#1CB0F6]" : "bg-blue-200/70"}`}
                style={{ height: `${item.value}%` }}
              />
              <span className="text-xs font-bold text-white/80">{item.dayLabel}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ParentWeeklyActivityChart;
