import {
  Check,
  Clock3,
  Eye,
  ListChecks,
  Share2,
  Star,
  Users,
} from "lucide-react";
import type { ReactNode } from "react";
import type { LessonBuilderControlBarProps } from "@/features/lesson-builder/types";

const LessonBuilderControlBar = ({
  className,
  draftLabel,
  isPublished,
  metrics,
  onTogglePublished,
}: LessonBuilderControlBarProps) => {
  const metricIconById: Record<string, ReactNode> = {
    exercises: <ListChecks size={16} className="text-white/60" />,
    points: <Star size={16} className="text-amber-500" />,
    duration: <Clock3 size={16} className="text-white/60" />,
    students: <Users size={16} className="text-white/60" />,
  };

  return (
    <div className="border-b border-white/10 bg-white/5 px-6 py-4 backdrop-blur-md">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <h3 className="text-base font-bold text-white">{className}</h3>
            <button
              type="button"
              className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold ${
                isPublished
                  ? "bg-green-200/20 text-green-200"
                  : "bg-white/10 text-white/70"
              }`}
            >
              <span
                className={`h-2 w-2 rounded-full ${
                  isPublished ? "bg-green-500" : "bg-gray-400"
                }`}
              />
              {draftLabel}
            </button>
          </div>

          <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
            {metrics.map((item) => (
              <div key={item.id} className="inline-flex items-center gap-2">
                {metricIconById[item.id] ?? <span className="text-white/60">•</span>}
                <span className="text-sm font-semibold text-white">{item.value}</span>
                <span className="text-xs text-white/70">{item.label}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            className="inline-flex items-center gap-1 rounded-lg border border-white/25 bg-white/10 px-3 py-2 text-sm font-semibold text-white hover:bg-white/20"
          >
            <Eye size={16} />
            Preview
          </button>
          <button
            type="button"
            className="inline-flex items-center gap-1 rounded-lg border border-white/25 bg-white/10 px-3 py-2 text-sm font-semibold text-white hover:bg-white/20"
          >
            <Share2 size={16} />
            Compartir
          </button>
          <button
            type="button"
            onClick={onTogglePublished}
            className={`inline-flex items-center gap-1 rounded-lg px-3 py-2 text-sm font-semibold text-white ${
              isPublished
                ? "bg-green-600 hover:bg-green-700"
                : "bg-[#1CB0F6] hover:bg-[#1398d8]"
            }`}
          >
            <Check size={16} />
            Publicar clase
          </button>
        </div>
      </div>
    </div>
  );
};

export default LessonBuilderControlBar;
