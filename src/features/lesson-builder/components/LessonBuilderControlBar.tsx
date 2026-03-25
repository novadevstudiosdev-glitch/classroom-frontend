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
    exercises: <ListChecks size={16} className="text-gray-500" />,
    points: <Star size={16} className="text-amber-500" />,
    duration: <Clock3 size={16} className="text-gray-500" />,
    students: <Users size={16} className="text-gray-500" />,
  };

  return (
    <div className="border-b bg-white px-6 py-4">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <h3 className="text-base font-bold text-gray-800">{className}</h3>
            <button
              type="button"
              className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold ${
                isPublished
                  ? "bg-green-100 text-green-700"
                  : "bg-gray-100 text-gray-600"
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
                {metricIconById[item.id] ?? <span className="text-gray-500">•</span>}
                <span className="text-sm font-semibold text-gray-700">{item.value}</span>
                <span className="text-xs text-gray-500">{item.label}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            className="inline-flex items-center gap-1 rounded-lg border px-3 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50"
          >
            <Eye size={16} />
            Preview
          </button>
          <button
            type="button"
            className="inline-flex items-center gap-1 rounded-lg border px-3 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50"
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
