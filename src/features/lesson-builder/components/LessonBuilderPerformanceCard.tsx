import { BarChart3, Clock3, Trophy } from "lucide-react";
import type { LessonBuilderPerformanceCardProps } from "@/features/lesson-builder/types";

const LessonBuilderPerformanceCard = ({ data }: LessonBuilderPerformanceCardProps) => {
  return (
    <div className="rounded-2xl border border-white/20 bg-white/10 p-5 shadow-sm backdrop-blur-md">
      <h3 className="mb-3 text-sm font-bold text-white">Rendimiento</h3>

      <div className="space-y-2">
        <div className="flex items-center justify-between rounded-lg border border-white/25 bg-gradient-to-r from-[#2c65f6]/20 via-[#00ffe4]/20 to-[#0ad3fb]/20 backdrop-blur-2xl border border-white/20 shadow-[0_0_40px_rgba(0,255,228,0.25)] rounded-3xl  px-3 py-2">
          <span className="inline-flex items-center gap-2 text-md text-white/80">
            <BarChart3 size={14} />
            Porcentaje de progreso
          </span>
          <span className="text-sm font-bold text-white">{data.completionRate}</span>
        </div>

        <div className="flex items-center justify-between rounded-lg border border-white/25 bg-gradient-to-br from-[#FFD700]/20 to-[#FF9500]/20 backdrop-blur-xl border border-white/20 shadow-lg rounded-2xl px-3 py-2">
          <span className="inline-flex items-center gap-2 text-md text-red/100">
            <Trophy size={14} />
            Promedio de calificaciones
          </span>
          <span className="text-sm font-bold text-white">{data.averageScore}</span>
        </div>

        <div className="flex items-center justify-between rounded-lg border border-white/25 bg-gradient-to-br from-[#6C63FF]/25 to-[#9B5DE5]/25 backdrop-blur-2xl border border-white/20 shadow-xl rounded-3xl px-3 py-2">
          <span className="inline-flex items-center gap-2 text-md text-white/80">
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
