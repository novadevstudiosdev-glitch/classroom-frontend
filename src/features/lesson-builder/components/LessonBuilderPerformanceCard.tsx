import { BarChart3, Clock3, Trophy } from "lucide-react";
import type { LessonBuilderPerformanceCardProps } from "@/features/lesson-builder/types";

const LessonBuilderPerformanceCard = ({ data }: LessonBuilderPerformanceCardProps) => {
  return (
    <div className="rounded-2xl border border-white/20 bg-white/10 p-5 shadow-sm backdrop-blur-md">
      <h3 className="mb-3 text-sm font-bold text-white">Rendimiento</h3>

      <div className="space-y-2">
        <div className="flex items-center justify-between rounded-lg border border-white/25 bg-white/10 px-3 py-2">
          <span className="inline-flex items-center gap-2 text-xs text-white/80">
            <BarChart3 size={14} />
            Tasa de completación
          </span>
          <span className="text-sm font-bold text-white">{data.completionRate}</span>
        </div>

        <div className="flex items-center justify-between rounded-lg border border-white/25 bg-white/10 px-3 py-2">
          <span className="inline-flex items-center gap-2 text-xs text-white/80">
            <Trophy size={14} />
            Promedio de calificaciones
          </span>
          <span className="text-sm font-bold text-white">{data.averageScore}</span>
        </div>

        <div className="flex items-center justify-between rounded-lg border border-white/25 bg-white/10 px-3 py-2">
          <span className="inline-flex items-center gap-2 text-xs text-white/80">
            <Clock3 size={14} />
            Tiempo promedio
          </span>
          <span className="text-sm font-bold text-white">{data.averageTime}</span>
        </div>
      </div>
    </div>
  );
};

export default LessonBuilderPerformanceCard;
