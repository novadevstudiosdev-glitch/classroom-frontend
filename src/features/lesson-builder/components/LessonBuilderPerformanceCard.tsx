import { BarChart3, Clock3, Trophy } from "lucide-react";
import type { LessonBuilderPerformanceCardProps } from "@/features/lesson-builder/types";

const LessonBuilderPerformanceCard = ({ data }: LessonBuilderPerformanceCardProps) => {
  return (
    <div className="rounded-2xl border bg-white p-5 shadow-sm">
      <h3 className="mb-3 text-sm font-bold text-gray-800">Rendimiento</h3>

      <div className="space-y-2">
        <div className="flex items-center justify-between rounded-lg border px-3 py-2">
          <span className="inline-flex items-center gap-2 text-xs text-gray-600">
            <BarChart3 size={14} />
            Tasa de completación
          </span>
          <span className="text-sm font-bold text-gray-800">{data.completionRate}</span>
        </div>

        <div className="flex items-center justify-between rounded-lg border px-3 py-2">
          <span className="inline-flex items-center gap-2 text-xs text-gray-600">
            <Trophy size={14} />
            Promedio de calificaciones
          </span>
          <span className="text-sm font-bold text-gray-800">{data.averageScore}</span>
        </div>

        <div className="flex items-center justify-between rounded-lg border px-3 py-2">
          <span className="inline-flex items-center gap-2 text-xs text-gray-600">
            <Clock3 size={14} />
            Tiempo promedio
          </span>
          <span className="text-sm font-bold text-gray-800">{data.averageTime}</span>
        </div>
      </div>
    </div>
  );
};

export default LessonBuilderPerformanceCard;
