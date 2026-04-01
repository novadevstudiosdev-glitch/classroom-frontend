import type { ParentLastSessionReportCardProps } from "@/features/dashboard/parent/types";

const ParentLastSessionReportCard = ({ report }: ParentLastSessionReportCardProps) => {
  return (
    <section className="px-6 py-4">
      <h2 className="mb-4 text-xl font-bold text-white">Reporte de última sesión</h2>

      <div className="landing-module-card">
        <p className="mb-4 text-sm text-white/70">{report.dateLabel}</p>

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          <div className="rounded-xl bg-white/8 p-3 text-center">
            <p className="text-2xl">⏱️</p>
            <p className="text-lg font-bold text-white">{report.durationLabel}</p>
            <p className="text-xs text-white/70">Duración</p>
          </div>

          <div className="rounded-xl bg-white/8 p-3 text-center">
            <p className="text-2xl">⚡</p>
            <p className="text-lg font-bold text-[#FF9600]">+{report.xpGained}</p>
            <p className="text-xs text-white/70">XP ganado</p>
          </div>

          <div className="rounded-xl bg-white/8 p-3 text-center">
            <p className="text-2xl">✅</p>
            <p className="text-lg font-bold text-[#58CC02]">{report.solvedExercises}</p>
            <p className="text-xs text-white/70">Ejercicios</p>
          </div>

          <div className="rounded-xl bg-white/8 p-3 text-center">
            <p className="text-2xl">📅</p>
            <p className="text-lg font-bold text-white">{report.dateLabel}</p>
            <p className="text-xs text-white/70">Fecha</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ParentLastSessionReportCard;
