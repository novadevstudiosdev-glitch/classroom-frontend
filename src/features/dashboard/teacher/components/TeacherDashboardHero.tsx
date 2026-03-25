import type { TeacherDashboardHeroProps } from "@/features/dashboard/teacher/types";

const TeacherDashboardHero = ({ title, subtitle, stats }: TeacherDashboardHeroProps) => {
  return (
    <div className="bg-[#1CB0F6] px-6 py-8 text-white">
      <h1 className="mb-2 text-2xl font-bold">{title}</h1>
      <p className="mb-6 text-sm text-white/80">{subtitle}</p>

      <div className="grid grid-cols-3 gap-3">
        {stats.map((stat) => (
          <div
            key={stat.id}
            className="rounded-2xl bg-white/20 p-4 text-center backdrop-blur-sm"
          >
            <p className="mb-1 text-3xl font-bold">{stat.value}</p>
            <p className="text-xs text-white/80">{stat.label}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TeacherDashboardHero;
