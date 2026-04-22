import type { TeacherDashboardHeroProps } from "@/features/dashboard/teacher/types";

const TeacherDashboardHero = ({ title, subtitle, stats }: TeacherDashboardHeroProps) => {
  return (
    <section className="pt-6">
      <div className="cosmic-hero">
        <div className="cosmic-hero-content">
          <span className="cosmic-badge">
            <span className="cosmic-badge-dot" />
            Panel docente
          </span>
          <h2 className="cosmic-title">{title}</h2>
          <p className="cosmic-subtitle">{subtitle}</p>

          <div className="cosmic-grid">
            {stats.map((stat) => (
              <div key={stat.id} className="cosmic-stat">
                <p className="cosmic-stat-value">{stat.value}</p>
                <p className="cosmic-stat-label">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default TeacherDashboardHero;
